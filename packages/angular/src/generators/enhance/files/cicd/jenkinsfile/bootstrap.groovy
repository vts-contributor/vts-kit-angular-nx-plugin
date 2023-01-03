import org.jenkinsci.plugins.workflow.steps.FlowInterruptedException
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

jenkinsfile_CI = load 'cicd/jenkinsfile/CI.groovy'
jenkinsfile_utils = load 'cicd/jenkinsfile/utils.groovy'
jenkinsfile_CD = load 'cicd/jenkinsfile/CD.groovy'

/**
 * Push commit event pipeline
 */
@SuppressWarnings("GroovyUnusedCatchParameter")
def bootstrapPushCommitBuild() {
    echo 'Trigger Push commit event'
    env.gitlabBuildID = env.pushBuildPrefix + "-" + env.BUILD_NUMBER
    if (pushCommitInOpenMR(env.gitlabBranch)) {
        stage("Cancel Push commit build") {
            echo "Push branch is in an Open Merge Request. Cancel build"
            currentBuild.result = "ABORTED"
        }
    } else {
        echo "Commit is not in an open MR. Continue building..."
        try {
            updateGitlabCommitStatus name: "build", state: 'running'
            updateGitlabCommitStatus name: "${env.gitlabBuildID}", state: 'running'
            jenkinsfile_CI.buildPushCommit()
            currentBuild.result = "SUCCESS"
        } catch (FlowInterruptedException interruptEx) {
            currentBuild.result = "ABORTED"
        } catch (InterruptedException ex) {
            currentBuild.result = "ABORTED"
        } catch (err) {
            echo "Error: ${err}"
            if (currentBuild.result != "ABORTED") {
                currentBuild.result = "FAILURE"
            }
            throw err
        } finally {
            updateGitlabCommitStatus name: "${env.gitlabBuildID}", state: 'success'
            if (currentBuild.result != "SUCCESS" && currentBuild.result != "ABORTED") {
                echo "Current build FAILURE"
                currentBuild.result = "FAILURE"
            }
            def buildIcon = ""
            def buildResultStr = ""
            if (currentBuild.result == "SUCCESS") {
                updateGitlabCommitStatus name: "build", state: 'success'
                buildIcon = ":white_check_mark:"
                buildResultStr = "Build Success."
            } else if (currentBuild.result == "ABORTED") {
                updateGitlabCommitStatus name: "build", state: 'canceled'
                buildIcon = ":warning:"
                buildResultStr = "Build Canceled."
            } else if (currentBuild.result == "FAILURE") {
                updateGitlabCommitStatus name: "build", state: 'failed'
                buildIcon = ":x:"
                buildResultStr = "Build Fail."
                echo "Send email fail result"
            }
            echo """
                env.UNIT_TEST_RESULT_STR: ${env.UNIT_TEST_RESULT_STR}
                env.CODE_COVERAGE_RESULT_STR: ${env.CODE_COVERAGE_RESULT_STR}
                env.SONAR_QUBE_SCAN_RESULT_STR: ${env.SONAR_QUBE_SCAN_RESULT_STR}
                env.SECURITY_RESULT_STR: ${env.SECURITY_RESULT_STR}
                env.FUNCTIONAL_TEST_RESULT_STR: ${env.FUNCTIONAL_TEST_RESULT_STR}
            """

            def buildResultContent =
                (env.UNIT_TEST_RESULT_STR == null ? "" : env.UNIT_TEST_RESULT_STR) +
                (env.CODE_COVERAGE_RESULT_STR == null ? "" : env.CODE_COVERAGE_RESULT_STR) +
                (env.SONAR_QUBE_SCAN_RESULT_STR == null ? "" : env.SONAR_QUBE_SCAN_RESULT_STR) +
                (env.SECURITY_RESULT_STR == null ? "" : env.SECURITY_RESULT_STR) +
                (env.FUNCTIONAL_TEST_RESULT_STR == null ? "" : env.FUNCTIONAL_TEST_RESULT_STR)
            try {
                if (env.mailTo == null || env.mailTo == '') {
                    echo "Skip send mail due to mail to null"
                } else {
                    mail([
                        bcc: '',
                        body: " <summary>Push Commit <strong>${env.gitlabSourceBranch}:${lastCommitShortName}</strong>: " +
                        "<br/> ${buildResultStr}</summary> <br/> <h4><i><a href='${env.BUILD_URL}display/redirect'>" +
                        "Build Details...</a></i></h4><br/>" +
                        "<br/>${buildResultContent}",
                        mimeType: 'text/html',
                        cc: "${env.mailCC}",
                        replyTo: '',
                        subject: "$JOB_NAME - Build # $BUILD_NUMBER - $currentBuild.result!",
                        to: "${env.mailTo}"
                    ])
                }
            } catch (err) {
                echo "Send mail failure"
            }
        }
    }
}

/**
 * Rebuild merge request event pipeline
 */
def bootstrapRebuildMergeRequest() {
    if (isOpenMergeRequest(env.gitlabMergeRequestIid)) {
        if (isWIPMergeRequest(env.gitlabMergeRequestIid)) {
            echo "Rebuild WIP Merge Request. Execute Push Commit Build"
            env.gitlabAfter = env.gitlabMergeRequestLastCommit
            bootstrapPushCommitBuild()
        } else {
            echo "Rebuild Merge Request. Execute Merge Request Build"
            bootstrapMergeRequestBuild()
        }
    } else {
        echo "This merge request is currently not open. Cancel build"
        addGitLabMRComment comment: "This merge request is currently not open. Cancel build"
        currentBuild.result = "ABORTED"
    }
}

/**
 * Build merge request event pipeline
 */
def bootstrapMergeRequestBuild() {
    try {
        if (checkIfBranchesRevisionAreSame(env.gitlabSourceBranch, env.gitlabTargetBranch)) {
            stage("Cancel Build When Source Branch is the same with Target Branch") {
                echo "Source branch has same commitID with target branch. Stop build"
                env.CHECK_IF_BRANCHES_REVISION_ARE_SAME_RESULT = "Source branch has same commitID with target branch. Stop build"
            }
            throw new InterruptedException("Source branch has same commitID with target branch. Stop build")
        }
        env.gitlabBuildID = env.mrBuildPrefix + "-" + env.BUILD_NUMBER
        updateGitlabCommitStatus name: "build", state: 'running'
        updateGitlabCommitStatus name: "${env.gitlabBuildID}", state: 'running'
        jenkinsfile_CI.buildMergeRequest()
        currentBuild.result = "SUCCESS"
    } catch (FlowInterruptedException interruptEx) {
        echo "Build canceled: ${interruptEx}"
        currentBuild.result = "ABORTED"
    } catch (InterruptedException interruptEx) {
        echo "Build canceled: ${interruptEx}"
        currentBuild.result = "ABORTED"
    } catch (err) {
        echo "Build error: ${err}"
        if (currentBuild.result != "ABORTED") {
            currentBuild.result = "FAILURE"
        }
        throw err
    } finally {
        def buildIcon = ""
        def buildResultStr = ""
        if (env.sourceBranchCommitID != env.targetBranchCommitID) {
            updateGitlabCommitStatus name: "${env.gitlabBuildID}", state: 'success'
            if (currentBuild.result != "SUCCESS" && currentBuild.result != "ABORTED") {
                currentBuild.result = "FAILURE"
            }
            if (currentBuild.result == "SUCCESS") {
                updateGitlabCommitStatus name: "build", state: 'success'
                buildIcon = ":white_check_mark:"
                buildResultStr += "Build Success."
            } else if (currentBuild.result == "ABORTED") {
                updateGitlabCommitStatus name: "build", state: 'canceled'
                buildIcon = ":warning:"
                buildResultStr = "Build Canceled."
            } else if (currentBuild.result == "FAILURE") {
                updateGitlabCommitStatus name: "build", state: 'failed'
                buildIcon = ":x:"
                buildResultStr = "Build Fail."
            }
        } else {
            if (currentBuild.result == "SUCCESS") {
                buildIcon = ":white_check_mark:"
                buildResultStr += "Build Success."
            } else if (currentBuild.result == "ABORTED") {
                buildIcon = ":warning:"
                buildResultStr = "Build Canceled."
            } else if (currentBuild.result == "FAILURE") {
                buildIcon = ":x:"
                buildResultStr = "Build Fail."
            }
        }
        def lastCommitShortName = env.gitlabMergeRequestLastCommit.substring(0, 8)
        def display_build_name = "${env.gitlabSourceBranch}:${lastCommitShortName} -> ${env.gitlabTargetBranch} - ${env.gitlabActionType}".toString()

        def buildSummary = "<summary>$buildIcon Merge request <strong>${display_build_name}</strong>: " +
            "${buildResultStr}</summary>"
        def buildDetail = "<h4><i><a href='${env.BUILD_URL}display/redirect'>" +
            "Build Details...</a></i></h4><br/><br/>"

        echo """
            env.SONAR_QUBE_SCAN_RESULT_STR: ${env.SONAR_QUBE_SCAN_RESULT_STR}
        """

        def buildResultContent =
            (env.CANCEL_BUILD_WARNING == null ? "" : env.CANCEL_BUILD_WARNING) +
            (env.CHECK_IF_BRANCHES_REVISION_ARE_SAME_RESULT == null ? "" : env.CHECK_IF_BRANCHES_REVISION_ARE_SAME_RESULT) +
            (env.SONAR_QUBE_SCAN_RESULT_STR == null ? "" : env.SONAR_QUBE_SCAN_RESULT_STR)

        def mergeRequestBuildStr =
            "<details> ${buildSummary}<br/><br/> ${buildResultContent}" +
            "${buildDetail}</details>".toString()
        echo "Comment ${mergeRequestBuildStr}"
        addGitLabMRComment comment: "${mergeRequestBuildStr}"
        echo "Comment added !"

        try {
            if (env.mailTo == null || env.mailTo == '') {
                echo "Skip send mail due to mail to null"
            } else {
                mail([
                    bcc: '',
                    body: "${mergeRequestBuildStr}",
                    mimeType: 'text/html',
                    cc: "${env.mailCC}",
                    replyTo: '',
                    subject: "$JOB_NAME - Build # $BUILD_NUMBER - $currentBuild.result!",
                    to: "${env.mailTo}"
                ])
            }
        } catch (err) {
            echo "Send mail failure"
        }
    }
}

/**
 * Deploy to production event pipeline
 */
def bootstrapDeployToProduction() {
    env.DEPLOY_RESULT_DESCRIPTION = ""
    try {
        jenkinsfile_CD.deployToProduction()
        env.DEPLOY_RESULT_DESCRIPTION += "<h4>:white_check_mark: Deploy Final Result: Success.<h4>"
    } catch (err) {
        echo "${err}"
        echo "Build result:"
        echo "${currentBuild.result}"
        env.DEPLOY_RESULT_DESCRIPTION += "<h4>:x: Deploy Final Result: Failed.<h4>"
        if (err != null && err != '') {
            env.DEPLOY_RESULT_DESCRIPTION += "<h4>${err.getMessage()}</h4>"
        }
    } finally {
        updateGitlabCommitStatus name: "deploy to production", state: 'success'
        //theem vao do 
        if (currentBuild.result != "SUCCESS" && currentBuild.result != "ABORTED") {
            currentBuild.result = "FAILURE"
        }
        def buildIcon = ""
        def buildResultStr = ""
        if (currentBuild.result == "SUCCESS") {
            updateGitlabCommitStatus name: "deploy to production", state: 'success'
            buildIcon = ":white_check_mark:"
            buildResultStr = "Deploy Success. "
        } else if (currentBuild.result == "ABORTED") {
            updateGitlabCommitStatus name: "deploy to production", state: 'canceled'
            buildIcon = ":warning:"
            buildResultStr = "Deploy Canceled."
        } else if (currentBuild.result == "FAILURE") {
            updateGitlabCommitStatus name: "deploy to production", state: 'failed'
            buildIcon = ":x:"
            buildResultStr = "Deploy Fail."
        }
        env.DEPLOY_RESULT_DESCRIPTION += "<h4><i><a href='${env.BUILD_URL}display/redirect'>" +
            "Deploy Process Details...</a></i></h4><br/><br/>"
        
        if (currentBuild.result == "ABORTED") {
            env.DEPLOY_RESULT_TITLE = "Deploy Result"
        } else {
            env.DEPLOY_RESULT_TITLE = "Deploy version ${env.projectVersion} Result"
        }

        echo "Title: ${env.DEPLOY_RESULT_TITLE}"
        echo "Description: ${env.DEPLOY_RESULT_DESCRIPTION}"
        withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
            passwordVariable: 'password')]) {
            def issueContentJson = """ 
            {
                "title": "${env.DEPLOY_RESULT_TITLE}",
                "description": "${env.DEPLOY_RESULT_DESCRIPTION}",
                "labels": "Deploy Result"
            }
            """
            def createIssueResp = httpRequest([
                acceptType: 'APPLICATION_JSON',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                customHeaders: [
                    [name: "PRIVATE-TOKEN", value: password]
                ],
                url: "${env.gitProjectApiUrl}/issues",
                requestBody: issueContentJson
            ])
            def notifyMemberLevel = 40
            def projectMemberList = jenkinsfile_utils.getProjectMember(notifyMemberLevel)
            def issueCommentStr = ""
            for (member in projectMemberList) {
                issueCommentStr += "@${member} "
            }
            echo "call member: ${issueCommentStr}"
            def issueCreated = jenkinsfile_utils.jsonParse(createIssueResp.content)
            def issueCommentJson = """ 
            {
                "body": "${issueCommentStr}"
            }
            """
            httpRequest([
                acceptType: 'APPLICATION_JSON',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                customHeaders: [
                    [name: "PRIVATE-TOKEN", value: password]
                ],
                url: "${env.gitProjectApiUrl}/issues/${issueCreated["iid"]}/notes",
                requestBody: issueCommentJson
            ])
        }
    }
}

/**
 * Check source branch revision is the same with target branch revision
 * @param branch which this push commit build event push to
 * @return boolean true if this push branch is in a open merge request
 */
def checkIfBranchesRevisionAreSame(sourceBranch, targetBranch) {
    withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
        passwordVariable: 'password')]) {
        def branchPageIndex = 0
        def hasBranchPage = true
        while (hasBranchPage) {
            def branchesResponse = httpRequest([
                acceptType: 'APPLICATION_JSON',
                httpMode: 'GET',
                contentType: 'APPLICATION_JSON',
                customHeaders: [
                    [name: 'Private-Token', value: password]
                ],
                url: "${env.gitProjectApiUrl}/repository/branches?page=${branchPageIndex}"
            ])
            def branches = jenkinsfile_utils.jsonParse(branchesResponse.content)
            for (branch in branches) {
                if (branch['name'] == sourceBranch) {
                    env.sourceBranchCommitID = branch['commit']['id']
                }
                if (branch['name'] == targetBranch) {
                    env.targetBranchCommitID = branch['commit']['id']
                }
            }
            if (branches.size() == 0) {
                hasBranchPage = false
            } else {
                branchPageIndex += 1
            }
        }
    }
    echo "Source Branch Commit ID: ${env.sourceBranchCommitID}"
    echo "Target Branch Commit ID: ${env.targetBranchCommitID}"
    return env.sourceBranchCommitID == env.targetBranchCommitID
}

/**
 * Check if this push commit is in source branch of an Open Merge Request
 * @param branch which this push commit build event push to
 * @return boolean true if this push branch is in a open merge request
 */
def pushCommitInOpenMR(pushBranch) {
    def isInOpenMR = false
    withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
        passwordVariable: 'password')]) {
        def response = httpRequest([
            acceptType: 'APPLICATION_JSON',
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            customHeaders: [
                [name: 'Private-Token', value: password]
            ],
            url: "${env.gitProjectApiUrl}/merge_requests?state=opened&source_branch=${pushBranch}"
        ])

        def openMRList = jenkinsfile_utils.jsonParse(response.content)
        if (openMRList.size() > 0) {
            def checkMR = openMRList[0]
            if (checkMR["work_in_progress"] == false) {
                isInOpenMR = true
            }
        }
    }
    return isInOpenMR
}

/**
 * Check if this merge request is a open merge request
 * @param gitlabMergeRequestIid Merge request iid
 * @return boolean true if checked merge request is a open merge request, false if is a closed MR
 */
def isOpenMergeRequest(gitlabMergeRequestIid) {
    withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
        passwordVariable: 'password')]) {
        def response = httpRequest([
            acceptType: 'APPLICATION_JSON',
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            customHeaders: [
                [name: 'Private-Token', value: password]
            ],
            url: "${env.gitProjectApiUrl}/merge_requests/${gitlabMergeRequestIid}"
        ])
        def mergeRequestInfo = jenkinsfile_utils.jsonParse(response.content)
        return (mergeRequestInfo['state'] == 'opened')
    }
}

/**
 * Check if this merge request is a open and WIP merge request or not
 * @param branch which this push commit build event push to
 * @return boolean true if this push branch is in a open merge request
 */
def isWIPMergeRequest(gitlabMergeRequestIid) {
    withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
        passwordVariable: 'password')]) {
        def response = httpRequest([
            acceptType: 'APPLICATION_JSON',
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            customHeaders: [
                [name: 'Private-Token', value: password]
            ],
            url: "${env.gitProjectApiUrl}/merge_requests/${gitlabMergeRequestIid}"
        ])
        def mergeRequestInfo = jenkinsfile_utils.jsonParse(response.content)
        return mergeRequestInfo['work_in_progress']
    }
}

/**
 * Make comment to Gitlab with build results
 */
def updateGitlabPushComment(buildIcon, buildResultStr, lastCommitShortName) {

    def buildSummary = "<summary>$buildIcon Push Commit <strong>${env.gitlabSourceBranch}:${lastCommitShortName}</strong>: " +
        "${buildResultStr}</summary>"

    echo """
        env.SONAR_QUBE_SCAN_RESULT_STR: ${env.SONAR_QUBE_SCAN_RESULT_STR}
    """

    def buildResultContent =
        (env.SONAR_QUBE_SCAN_RESULT_STR == null ? "" : env.SONAR_QUBE_SCAN_RESULT_STR)
    def buildDetails =
        "<h4><i><a href='${env.BUILD_URL}display/redirect'>" +
        "Build Details...</a></i></h4><br/><br/>"
    def buildCommitStr =
        "<details> ${buildSummary}<br/><br/>${buildResultContent}" +
        "${buildDetails}</details>".toString()
    def requestBody = '{"note":"' + buildCommitStr + '", "line_type": "new"}'
    echo "${requestBody}"
    withCredentials([usernamePassword(credentialsId: "${env.gitUserPassSecret}", usernameVariable: 'username',
        passwordVariable: 'password')]) {
        sh "curl -X POST ${env.gitProjectApiUrl}/repository/commits/${env.gitlabAfter}/comments " +
            "-H 'Cache-Control: no-cache' -H 'Content-Type: application/json' " +
            "-H 'PRIVATE-TOKEN: ${password}' " +
            "-d '${requestBody}' "
    }
}

/**
 * Custom initial environments
 */
def initGlobalEnv() {
    // Load local environment
    try {
        echo 'Load local environment: Loading'
        load 'cicd/jenkinsfile/environment.groovy'
        echo 'Load local environment: Success'

        // Load remote environment
        if (env.remoteConfigFile != null && env.remoteConfigFile != '') {
            try {
                echo 'Load remote environment: Loading'
                configFileProvider([configFile(fileId: "${env.remoteConfigFile}", targetLocation: 'cicd/')]) {
                    load "cicd/${env.remoteConfigFile}"
                    echo 'Load remote environment: Loaded'
                }
            } catch (Exception e) {
                echo 'Load remote environment: Error'
            }
        }
    } catch (Exception e) {
        echo 'Load local environment: Error'
    }

    // Extra project environments
    env.gitlabUrl = sh(script: "echo ${env.gitlabSourceRepoHttpUrl} | cut -d/ -f1-3", returnStdout:true).trim()
    env.MERGE_REQUEST_BUILD_COMMENT = ""
    env.PUSH_COMMIT_BUILD_COMMENT = ""
    env.lastCommitShortName = env.gitlabMergeRequestLastCommit.substring(0, 8)
    env.display_build_name = "${env.gitlabSourceBranch}:${lastCommitShortName} -> ${env.gitlabTargetBranch}".toString()
    if (env.gitlabSourceRepoName != null) {
        env.gitlabSourceRepoName = env.gitlabSourceRepoName.replace(" ", "-")
    }
    if (env.gitlabTargetRepoName != null) {
        env.gitlabTargetRepoName = env.gitlabTargetRepoName.replace(" ", "-")
    }

    def project = jenkinsfile_utils.getProject()
    env.gitProjectApiUrl= "${env.gitlabUrl}/api/v4/projects/${project.id}"

    // Dump environments
    echo 'Environments:'
    sh 'env'
}

/**
 * Detect trigger events
 */
def checkBuildType() {
    def buildType = "none"
    if ("${env.gitlabActionType}".toString() == "PUSH") {
        buildType = "push_commit_build"
    } else if ("${env.gitlabActionType}".toString() == "MERGE") {
        if ("${env.gitlabMergeRequestState}".toString() == "opened") {
            buildType = "merge_request_build"
        } else if ("${env.gitlabMergeRequestState}".toString() == "closed") {
            buildType = "close_mr_build"
        } else if ("${env.gitlabMergeRequestState}".toString() == "merged") {
            buildType = "accept_mr_build"
        } else {
            buildType = "merge_request_build"
        }
    } else if ("${env.gitlabActionType}".toString() == "NOTE") {
        buildType = "rebuild_merge_request"
    } else if ("${env.gitlabActionType}".toString() == "TAG_PUSH") {
        buildType = "deploy_production"
    }
    return buildType
}

/**
 * Determine pipeline to run
 */
def bootstrap_build() {
    initGlobalEnv()
    env.BUILD_TYPE = checkBuildType()
    switch (env.BUILD_TYPE) {
    case "push_commit_build":
        bootstrapPushCommitBuild()
        break
    case "merge_request_build":
        bootstrapMergeRequestBuild()
        break
    case "rebuild_merge_request":
        bootstrapRebuildMergeRequest()
        break
    case "accept_mr_build":
        break
    case "close_mr_build":
        break
    case "deploy_production":
        bootstrapDeployToProduction()
        break
    default:
        break
    }
}

return [
    bootstrap_build: this.&bootstrap_build,
    bootstrapDeployToProduction: this.&bootstrapDeployToProduction,
]