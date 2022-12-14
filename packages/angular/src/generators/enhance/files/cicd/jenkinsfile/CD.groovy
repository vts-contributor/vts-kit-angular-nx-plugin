def getAppVersion(deployVersion) {
	def packageJSON = readJSON file: 'package.json'
	def version = "${deployVersion}.stable"
	def imageName = "${env.harborServer}/${env.harborFolder}/${env.appName}:${version}"
	return imageName
}

/**
 * Wait for confirmation and deploy to production
 */
def deployToProduction() {
    def gitlabBranch = env.gitlabBranch
    echo "Branch : ${gitlabBranch}"
    def semantic_version = gitlabBranch.split("/")[2]
    env.config_git_branch = semantic_version
    echo "Config git branch: ${env.config_git_branch}"
    env.DEPLOY_RESULT_DESCRIPTION += "<h4>Test & Verify Phase Result</h4>"
    updateGitlabCommitStatus name: "deploy to production", state: 'running'
    stage("Checkout Source Code") {
        jenkinsfile_utils.checkoutSourceCode("PUSH")
        def commitIdStdOut = sh(script: 'git rev-parse HEAD', returnStdout: true)
        env.DEPLOY_GIT_COMMIT_ID = commitIdStdOut.trim()
    }
    env.DEPLOY_RESULT_DESCRIPTION += "<h4>Deploy Phase Result</h4>"
    updateGitlabCommitStatus name: "deploy to production", state: 'running'
    def deployInput = ""
    def deployer = ""
    stage("Wait for maintainer accept or reject to deploy to production") {
        try {
            deployer = env.projectMaintainerList
            echo "projectMaintainerList: ${env.projectMaintainerList}"

            timeout(time: 24, unit: 'HOURS') {
                deployInput = input(
                    submitter: "${deployer}",
                    submitterParameter: 'submitter',
                    message: 'Pause for wait maintainer selection', ok: "Deploy", parameters: [
                        string(defaultValue: '',
                            description: 'Version to Deploy',
                            name: 'Deploy')
                    ])
            }
        } catch (err) { // timeout reached or input false
            echo "Exception"
            def user = err.getCauses()[0].getUser()
            if ('SYSTEM' == user.toString()) { // SYSTEM means timeout.
                echo "Timeout is exceeded!"
            } else {
                echo "Aborted by: [${user}]"
            }
            deployInput = "Abort"
        }
        echo "Input value: $deployInput"
    }

    if (deployInput == "Abort") {
        stage("Cancel deploy process") {
            echo "Deploy process is aborted."
            currentBuild.result = "ABORTED"
            throw new Exception("Aborted");
        }
    }
    env.projectVersion = deployInput['Deploy']
    echo "Deploy Version: $env.projectVersion"

    try {
        stage('Deploy to Production') {
            echo "Deploying Version: ${env.projectVersion}"
            env.imageName = getAppVersion(env.projectVersion)
            withCredentials([file(credentialsId: "${env.prodKubeConfigFileSecret}", variable: 'kubeconfig')]){
                sh """
                    sh cicd/scripts/prod-deploy-script.sh $kubeconfig
                """
            }
        }
        currentBuild.result = "SUCCESS"
    } catch (Exception e) {
            stage("Cancel deploy process") {
            echo "Deploy process is canceled."
            currentBuild.result = "FAILURE"
            throw e;
        }
    }
}

return [
    deployToProduction: this.&deployToProduction
]