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
            echo "error: ${err}"
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
                if (env.mailTo == null) {
                    echo "skip send mail due to mail to null"
                } else {
                    mail([
                        bcc: '',
                        body: " <summary>Push Commit <strong>${env.gitlabSourceBranch}:${lastCommitShortName}</strong>: " +
                        "<br/> ${buildResultStr}</summary> <br/> <h4><i><a href='${env.BUILD_URL}display/redirect'>" +
                        "Build Details...</a></i></h4><br/>" +
                        "<br/>${buildResultContent}",
                        mimeType: 'text/html',
                        cc: "${env.mailCC}",
                        from: 'jenkins_mail',
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
                echo "source branch has same commitID with target branch. Stop build"
                env.CHECK_IF_BRANCHES_REVISION_ARE_SAME_RESULT = "Source branch has same commitID with target branch. Stop build"
            }
            throw new InterruptedException("Source branch has same commitID with target branch. Stop build")
        }
        env.gitlabBuildID = env.mrBuildPrefix + "-" + env.BUILD_NUMBER
        updateGitlabCommitStatus name: "build", state: 'running'
        updateGitlabCommitStatus name: "${env.gitlabBuildID}", state: 'running'
        stage('Cancel old MR Build') {
            cancelOldMrBuild(env.gitlabMergeRequestIid, env.BUILD_TYPE)
        }
        updateGitlabCommitStatus name: "build", state: 'running'
        jenkinsfile_CI.buildMergeRequest()
        currentBuild.result = "SUCCESS"
    } catch (FlowInterruptedException interruptEx) {
        echo "Build canceled: ${interruptEx}"
        currentBuild.result = "ABORTED"
    } catch (InterruptedException interruptEx) {
        echo "Build canceled: ${interruptEx}"
        currentBuild.result = "ABORTED"
    } catch (err) {
        echo "build error: ${err}"
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
        echo "comment ${mergeRequestBuildStr}"
        addGitLabMRComment comment: "${mergeRequestBuildStr}"
        echo "comment added !"
        mail([
            bcc: '',
            body: "${mergeRequestBuildStr}",
            mimeType: 'text/html',
            cc: "${env.mailCC}",
            from: 'jenkins_mail',
            replyTo: '',
            subject: "$JOB_NAME - Build # $BUILD_NUMBER - $currentBuild.result!",
            to: "${env.mailTo}"
        ])
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

        echo "title: ${env.DEPLOY_RESULT_TITLE}"
        echo "description: ${env.DEPLOY_RESULT_DESCRIPTION}"
        withCredentials([usernamePassword(credentialsId: 'a5eedd9f-332d-4575-9756-c358bbd808eb', usernameVariable: 'user',
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
    withCredentials([usernamePassword(credentialsId: 'a6299eee-80ab-41bc-992a-1745f51a264b', usernameVariable: 'username',
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
    withCredentials([usernamePassword(credentialsId: 'a6299eee-80ab-41bc-992a-1745f51a264b', usernameVariable: 'username',
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
    withCredentials([
        usernamePassword(credentialsId: 'a6299eee-80ab-41bc-992a-1745f51a264b', usernameVariable: 'username', passwordVariable: 'password'),
        usernamePassword(credentialsId: 'jenkins_api_token_new', usernameVariable: 'usernamejenkins', passwordVariable: 'token')
    ]) {
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
    withCredentials([
        usernamePassword(credentialsId: 'a6299eee-80ab-41bc-992a-1745f51a264b', usernameVariable: 'username', passwordVariable: 'password'),
        usernamePassword(credentialsId: 'jenkins_api_token_new', usernameVariable: 'usernamejenkins', passwordVariable: 'token')
    ]) {
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

@SuppressWarnings("GroovyAssignabilityCheck")
def checkIfBuildIsRunning(buildURL) {
    withCredentials([usernamePassword(credentialsId: 'jenkins_api_token_new', usernameVariable: 'usernamejenkins', passwordVariable: 'token')]) {
        def buildInfoResp = httpRequest([
            acceptType: 'APPLICATION_JSON',
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            authentication: 'jenkins_api_token_new',
            url: "${buildURL}/api/json"
        ])
        return jenkinsfile_utils.jsonParse(buildInfoResp.content)["building"] == true
    }
}

/**
 * Check if other builds is running in commit which this build refer to
 * And close these builds when match below requirements:
 * Accept and Close MR build only stop OPEN MR build, not stop Push commit build
 * Open MR Build close both other Open MR build and Push commit build
 * @param buildType type of current build
 * @param gitlabMergeRequestIid GitLab merge request id of this build
 * @return nothing
 */
def cancelOldMrBuild(gitlabMergeRequestIid, currentBuildType) {
    env.CANCEL_BUILD_WARNING = ""
    withCredentials([
        usernamePassword(credentialsId: 'a6299eee-80ab-41bc-992a-1745f51a264b', usernameVariable: 'username', passwordVariable: 'password'),
        usernamePassword(credentialsId: 'jenkins_api_token_new', usernameVariable: 'usernamejenkins', passwordVariable: 'token')
    ]) {
        def pipelines = httpRequest([
            acceptType: 'APPLICATION_JSON',
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            customHeaders: [
                [name: 'Private-Token', value: password]
            ],
            url: "${env.gitProjectApiUrl}/merge_requests/${gitlabMergeRequestIid}/pipelines"
        ])

        for (pipeline in jenkinsfile_utils.jsonParse(pipelines.content)) {
            //noinspection GroovyAssignabilityCheck
            def checkCommitID = pipeline['sha']
            echo "check commit id: ${checkCommitID}"
            def commitJobs = httpRequest([
                acceptType: 'APPLICATION_JSON',
                httpMode: 'GET',
                contentType: 'APPLICATION_JSON',
                customHeaders: [
                    [name: 'Private-Token', value: password]
                ],
                url: "${env.gitProjectApiUrl}/repository/commits/${checkCommitID}/statuses?all=yes"
            ])

            for (commitJob in jenkinsfile_utils.jsonParse(commitJobs.content)) {
                //noinspection GroovyAssignabilityCheck
                if (currentBuildType == "merge_request_build" || currentBuildType == "rebuild_merge_request" ||
                    ((currentBuildType == "accept_mr_build" || currentBuildType == "close_mr_build") &&
                        (commitJob["name"].contains(env.mrBuildPrefix) ||
                            commitJob["name"].contains(env.acceptCloseMRBuildPrefix)))
                ) {
                    if (commitJob["status"] == "pending" || commitJob["status"] == "running") {
                        def buildURL = commitJob["target_url"].substring(0, commitJob["target_url"].length() - 17)
                        echo "Check buildURL: ${buildURL}"
                        echo "Current buildURL: ${env.BUILD_URL}"
                        if (!env.BUILD_URL.contains(buildURL)) {
                            def retry = 0
                            while (checkIfBuildIsRunning(buildURL) && retry < 3) {
                                echo "Old build: ${commitJob["target_url"]} is running!. Stop this job!"
                                httpRequest([
                                    acceptType: 'APPLICATION_JSON',
                                    httpMode: 'POST',
                                    contentType: 'APPLICATION_JSON',
                                    authentication: 'jenkins_api_token_new',
                                    url: "${buildURL}/stop"
                                ])
                                sleep 10
                                retry += 1
                            }
                            if (checkIfBuildIsRunning(buildURL)) {
                                env.CANCEL_BUILD_WARNING += "<h2> Build ${buildURL} is still running after cancel build 3 times. Re check it!</h2>"
                            }
                        }
                    }
                }
            }
        }
        echo "pipelines: ${pipelines}"
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
    withCredentials([usernamePassword(credentialsId: ${env.gitUserPassSecret}, usernameVariable: 'username',
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
    env.gitProjectApiUrl= "${gitlabUrl}/api/v4/projects/${project.id}"

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
        echo 'Environments:'
        sh 'env'
    } catch (Exception e) {
        echo 'Load local environment: Error'
    }
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
