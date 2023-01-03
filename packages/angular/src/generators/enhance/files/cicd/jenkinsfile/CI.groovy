import org.jenkinsci.plugins.workflow.steps.FlowInterruptedException
import java.text.DecimalFormat
import hudson.tasks.test.AbstractTestResultAction
import groovy.json.*

/**
 * Get Sonar Analysis result
 */
def getSonarQubeAnalysisResult(sonarQubeURL, projectKey) {
    def metricKeys = "bugs,vulnerabilities,code_smells"
    def measureResp = httpRequest([
        acceptType : 'APPLICATION_JSON',
        httpMode   : 'GET',
        contentType: 'APPLICATION_JSON',
        url        : "${sonarQubeURL}/api/measures/component?metricKeys=${metricKeys}&component=${projectKey}"
    ])
    def measureInfo = jenkinsfile_utils.jsonParse(measureResp.content)
    def metricResultList = measureInfo['component']['measures']
    echo "${metricResultList}"
    int bugsEntry = getMetricEntryByKey(metricResultList, "bugs")['value'] as Integer
    int vulnerabilitiesEntry = getMetricEntryByKey(metricResultList, "vulnerabilities")['value'] as Integer
    int codeSmellEntry = getMetricEntryByKey(metricResultList, "code_smells")['value'] as Integer
    return ["bugs": bugsEntry, "vulnerabilities": vulnerabilitiesEntry, "code_smells" : codeSmellEntry ]
}

/**
 * Get Sonar Analysis metric entry
 */
def getMetricEntryByKey(metricResultList, metricKey) {
    for (metricEntry in metricResultList) {
        if (metricEntry["metric"] == metricKey) {
            echo "${metricEntry}"
            return metricEntry
        }
    }
    return null
}

/**
 * Get Sonar Analysis Project key
 */
@NonCPS
def genSonarQubeProjectKey() {
    def sonarqubeProjectKey = ""
    if ("${env.gitlabActionType}".toString() == "PUSH" || "${env.gitlabActionType}".toString() == "TAG_PUSH") {
        sonarqubeProjectKey = "${env.gitlabSourceRepoName}:${env.gitlabSourceBranch}"
    } else if ("${env.gitlabActionType}".toString() == "MERGE" || "${env.gitlabActionType}".toString() == "NOTE") {
        sonarqubeProjectKey = "MR-${env.gitlabSourceRepoName}:${env.gitlabSourceBranch}-to-" +
            "${env.gitlabTargetBranch}"
    }
    return sonarqubeProjectKey.replace('/', '-')
}

/**
 * Run Sonar Analysis
 */
def sonarQubeScan(buildType) {
	echo  'Checkout source code'
	jenkinsfile_utils.checkoutSourceCode(buildType)
	def packageJSON = readJSON file: 'package.json'
    def version = packageJSON.version
	echo  'SonarQube analysis'
	    env.SONAR_QUBE_PROJECT_KEY = genSonarQubeProjectKey()
        withSonarQubeEnv('SONARQ_V6') {
            sh(returnStatus: true, script:
                "/home/app/server/sonar-scanner/bin/sonar-scanner " +
                "-Dsonar.projectName=${env.SONAR_QUBE_PROJECT_KEY} " +
                "-Dsonar.projectKey=${env.SONAR_QUBE_PROJECT_KEY} " +
				"-Dsonar.projectVersion=${version} " +
                "-Dsonar.java.binaries=. " +
                "-Dsonar.sources=. " +
                "-Dsonar.inclusions=**/*.java " +
                "-Dsonar.exclusions=**/*.zip,**/*.jar,**/*.html,**/R.java,**/build/**,**/target/**,**/.settings/**,**/.mvn/**,**/src/main/resources/static/bower_components/**,**/src/main/resources/static/jquery-validation/**,**/src/main/resources/static/cicd/scripts/material/**,**/src/main/resources/static/cicd/scripts/multiselect/**,**/src/main/resources/static/cicd/scripts/nanobar/**,**/src/main/resources/static/cicd/scripts/plugins/**,**/src/main/resources/static/cicd/scripts/utils/**"
            )
			sh 'ls -al'
			sh 'cat .scannerwork/report-task.txt'
			def props = readProperties file: '.scannerwork/report-task.txt'
			env.SONAR_CE_TASK_ID = props['ceTaskId']
			env.SONAR_PROJECT_KEY = props['projectKey']
			env.SONAR_SERVER_URL = props['serverUrl']
			env.SONAR_DASHBOARD_URL = props['dashboardUrl']

			echo "SONAR_SERVER_URL: ${env.SONAR_SERVER_URL}"
			echo "SONAR_PROJECT_KEY: ${env.SONAR_PROJECT_KEY}"
			echo "SONAR_DASHBOARD_URL: ${env.SONAR_DASHBOARD_URL}"
    }
	echo  'Quality Gate'
	def qg = null
	try {
		def sonarQubeRetry = 0
		def sonarScanCompleted = false
		while (!sonarScanCompleted) {
			try {
				sleep 10
				timeout(time: 1, unit: 'MINUTES') {
					script {
						qg = waitForQualityGate()
						sonarScanCompleted = true
						if (qg.status != 'OK') {
							if (env.errorBypass == 'true') {
								echo "Sonar contain error"
							}else {
								error "Pipeline failed due to quality gate failure: ${qg.status}"
							}
						}
					}
				}
			} catch (FlowInterruptedException interruptEx) {
				// check if exception is system timeout
				if (interruptEx.getCauses()[0] instanceof org.jenkinsci.plugins.workflow.steps.TimeoutStepExecution.ExceededTimeout) {
					if (sonarQubeRetry <= 10) {
						sonarQubeRetry += 1
					} else {
						if (env.errorBypass == 'true') {
							echo "Sonar contain error"
						} else {
							error "Cannot get result from Sonarqube server. Build Failed."
						}
					}
				} else {
					throw interruptEx
				}
			}
			catch (err) {
				throw err
			}
		}
	}
	catch (err) {
		throw err
	} finally {
		def codeAnalysisResult = getSonarQubeAnalysisResult(env.SONAR_SERVER_URL, env.SONAR_PROJECT_KEY)
		def sonarQubeAnalysisStr = "- Vulnerabilities: <b>${codeAnalysisResult["vulnerabilities"]}</b> <br/>" +
			"- Bugs: <b>${codeAnalysisResult["bugs"]}</b> <br/>" +
			"- Code Smell: <b>${codeAnalysisResult["code_smells"]}</b> <br/>"
		def sonarQubeAnalysisComment = "<b>SonarQube Code Analysis Result: ${qg.status}</b> <br/><br/>${sonarQubeAnalysisStr} " +
			"<i><a href='${SONAR_DASHBOARD_URL}'>" +
			"Details SonarQube Code Analysis Report...</a></i><br/><br/>"
		env.SONAR_QUBE_SCAN_RESULT_STR = sonarQubeAnalysisComment
		if ("${env.gitlabActionType}".toString() == "MERGE" || "${env.gitlabActionType}".toString() == "NOTE") {
			echo "Check vulnerabilities, code smell and bugs"
			int maximumAllowedVulnerabilities = env.maximumAllowedVunerabilities as Integer
			int maximumAllowedBugs = env.maximumAllowedBugs as Integer
			int maximumAllowedCodeSmell = env.maximumAllowedCodeSmell as Integer
			echo "Maximum allow vulnerabilities:  ${maximumAllowedVulnerabilities} "
			echo "Maximum allow bugs:  ${maximumAllowedBugs}"
			echo "Maximum allow code smell:  ${maximumAllowedCodeSmell}"
			if (codeAnalysisResult["vulnerabilities"] > maximumAllowedVulnerabilities ||
				codeAnalysisResult["bugs"] > maximumAllowedBugs || codeAnalysisResult["code_smells"] > maximumAllowedCodeSmell) {
				if (env.errorBypass == 'true') {
					echo "Vulnerability, code smell or bug number overs allowed limits!"
				} else {
					error "Vulnerability, code smell or bug number overs allowed limits!"
				}

			}
		}
	}
}

/**
 * Get Unit test and Code coverage results from output file
 */
@NonCPS
def getProjectCodeCoverageInfo(coverageInfoXmlStr) {
    def coverageInfoXml = jenkinsfile_utils.parseXml(coverageInfoXmlStr)
    def coverageInfoStr = ""
    coverageInfoXml.counter.each {
        def coverageType = it.@type as String
        int missed = (it.@missed as String) as Integer
        int covered = (it.@covered as String) as Integer
        int total = missed + covered

        def coveragePercent = 0.00
        if (total > 0) {
            coveragePercent = Double.parseDouble(
                new DecimalFormat("###.##").format(covered * 100.0 / total))
        }
        coverageInfoStr += "- <b>${coverageType}</b>: <i>${covered}</i>/<i>${total}</i> (<b>${coveragePercent}%</b>)<br/>"
    }
    return coverageInfoStr
}

/**
 * Get Unit test and Code coverage results from jenkin
 */
@NonCPS
def getTestResultFromJenkins() {
    def testResult = [:]
    AbstractTestResultAction testResultAction = currentBuild.rawBuild.getAction(AbstractTestResultAction.class)
    testResult["total"] = testResultAction.totalCount
    testResult["failed"] = testResultAction.failCount
    testResult["skipped"] = testResultAction.skipCount
    testResult["passed"] = testResultAction.totalCount - testResultAction.failCount - testResultAction.skipCount
    return testResult
}

/**
 * Run Unit test and Code coverage
 */
def unitTestAndCodeCoverage(buildType){
	// Not implemented
}

def getAppVersion() {
	def packageJSON = readJSON file: 'package.json'
    def packageVersion = packageJSON.version
	def version = "${packageVersion}_${BUILD_NUMBER}"
	def imageName = "${env.harborServer}/${env.harborFolder}/${env.appName}:${version}"
	return imageName
}

/**
 * Build project into docker image
 */
def buildProject(buildType) {
	echo  'Checkout source code'
	jenkinsfile_utils.checkoutSourceCode(buildType)

	echo  'Login to Docker Repository'
	withCredentials([usernamePassword(credentialsId: "${env.harborUserPassSecret}", usernameVariable: 'username',
			passwordVariable: 'password')]){
		sh """
			docker --config ~/.docker/.${username} login -u ${username} -p ${password} ${env.harborServer}
		"""
	}

	echo  'Run build script'
	env.imageName = getAppVersion()
	sh """
		sh cicd/scripts/dev-build-script.sh
	"""
}

/**
 * Deploy project image into kubernetes
 */
def deployProject(buildType){
	echo  'Run deploy script'
	env.imageName = getAppVersion()
	withCredentials([file(credentialsId: "${env.devKubeConfigFileSecret}", variable: 'kubeconfig')]){
		sh """
			sh cicd/scripts/dev-deploy-script.sh $kubeconfig
		"""
	}
}

/**
 * Push Commit Pipeline
 */
def buildPushCommit() {
    echo "Run Push Commit pipeline"
	echo "Gitlab branch: $env.gitlabBranch"

	if (env.skipSonar != 'true') {
		stage("SonarQubeScan") {
			node("${env.node_slave}") {
				sonarQubeScan("PUSH")
			}
		}
	}

	if (env.skipTest != 'true') {
		stage("Unittest And Code Coverage") {
			node("${env.node_slave}") {
				unitTestAndCodeCoverage("PUSH")
			}
		}
	}

	stage("Package and build docker image") {
		node("${env.node_slave}") {
			buildProject("PUSH")
		}
	}

	stage("Deploy to Server Test") {
		node("${env.node_slave}") {
			deployProject("PUSH")
		}
    }

    currentBuild.result = "SUCCESS"
}

/**
 * Merge Commit Pipeline
 */
def buildMergeRequest() {
    echo "Run Merge Commit pipeline"
	echo "Gitlab source branch: $env.gitlabBranch"
	echo "Gitlab target branch: $env.gitlabTargetBranch"

	if (env.skipSonar != 'true') {
		stage("SonarQubeScan") {
			node("${env.node_slave}") {
				sonarQubeScan("MERGE")
			}
		}
	}

	if (env.skipTest != 'true') {
		stage("Unittest And Code Coverage") {
			node("${env.node_slave}") {
				unitTestAndCodeCoverage("MERGE")
			}
		}
	}

	if (env.gitlabTargetBranch == env.stagingBranch) {
		stage("Package and build docker image") {
			node("${env.node_slave}") {
				echo "Skip build staging"
			}
		}

		stage("Deploy to Server Staging") {
			echo "Skip deploy to staging"
		}
	} else {
		stage("Package and build docker image") {
			node("${env.node_slave}") {
				buildProject("MERGE")
			}
		}

		stage("Deploy to Server Test") {
			node("${env.node_slave}") {
				deployProject("MERGE")
			}
		}
	}

    currentBuild.result = "SUCCESS"
}

return [
    buildPushCommit         : this.&buildPushCommit,
    buildMergeRequest       : this.&buildMergeRequest
]
