@Library('jenkins-shared-lib')_
import groovy.transform.Field


@Field def useImage = true
@Field def useArtifact = false
@Field def isBackend = true


load 'cicd/jenkinsfile/environment.groovy'

// WARNING! DO NOT MODIFY NAME/PARAMS OF ORIGINAL FUNCTIONS
def getServiceList(){
    def listService = []
    return listService
}
//
//server test prefix is: test_
def getImageName() {
    def version = "test_${BUILD_NUMBER}"
	def imageName = "${env.harborServer}/${env.harborProject}/${env.appName}:${version}"
	return imageName

}

def buildService() {
     stage('Build service') {
        env.buildWorkspace = sh(returnStdout: true, script: 'pwd').trim()
        try {
            sh """
		        sh cicd/scripts/dev-build-script.sh ${env.harborProject} ${env.appName}
            """
        } catch (err) {
            error 'Build Failure'
        }
    }
}

def unitTestAndCodeCoverage(buildType){
    stage("Checkout source code"){
        jenkinsfile_utils.checkoutSourceCode(buildType)
    }
    stage("Unit Test & Code Coverage") {

    }

}

def deployDevTest(version){
    echo  'Run deploy script'
	env.imageName = getImageName()
	withCredentials([file(credentialsId: "${env.devKubeConfigFileSecret}", variable: 'kubeconfig')]){
		sh """
			sh cicd/scripts/dev-deploy-script.sh $kubeconfig
		"""
	}

}

def deployProduct(service,version){
    echo "Deploy to server production"
    echo "Version to deploy: $version"
    sh """
        echo "Run deploy script here"
    """
}

def fortifyScan(){
    jenkinsfile_utils.fortifyScanStage(
        [
            serviceName : "${env.appName}",
            sourcePathRegex : '\\libs\\*'
        ]
    )
}


def pushImage(){
    jenkinsfile_utils.pushImageToHarbor(
        [
            repo_name : "${env.harborProject}",
            image_name : "${env.appName}"
        ]
    )
}

def pushArtifact(){
    jenkinsfile_utils.pushArtifactToNexus(
        [
            groupID     : "com.viettel",
            artifactId  : "process",
            filepath    : "/"
        ]
    )
}

def selfCheckService(){
    return true
}

def rollback(){
    echo "Define rollback plan here"
    return true
}

def autotestProduct(){
    return true
}



// ------------------------------------ Self-defined functions ------------------------------------
//def checkoutDeployment(){
//    checkout changelog: true, poll: true, scm: [
//        $class                           :  'GitSCM',
//        branches                         : [[name: "master"]],
//        doGenerateSubmoduleConfigurations: false,
//        extensions                       : [[$class: 'UserIdentity',
//                                            email : 'vtsjenkinsadmin@viettel.com.vn', name: 'cicdBot'],
//                                            [$class: 'CleanBeforeCheckout']],
//        submoduleCfg                     : [],
//        userRemoteConfigs                : [[credentialsId: "${env.gitUserPassSecret}",
//                                             name         : 'origin',
//                                             url          : "${env.gitlabSourceRepoHomepage}" + ".git"]]
//    ]
//}

return this
