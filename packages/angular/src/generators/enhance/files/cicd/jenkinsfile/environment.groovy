/** Pipeline options **/
env.errorBypass = 'false'                           // OPTIONAL, Continue on error
env.skipTest = 'false'                              // OPTIONAL, Skip test phase
env.skipSonar = 'false'                             // OPTIONAL, Skip sonar scan phase


/** Application information **/
env.appName = "<%= name %>"<%= ''.padStart(36 - name.length) %>// REQUIRED
                                                    // Determine docker image name (<harborServer>/<harborFolder>/<appName>:<version>_<buildNumber>) 
                                                    // and deployment/service name


/** Kubernetes profile **/

// Development profile
env.devKubeConfigFileSecret = "dev-k8s-config"      // REQUIRED, Secret file credential stored on Jenkin, give in fileID
env.devNamespace = ""                               // REQUIRED, Kubernetes namespace to deploy
env.devPort = "80"                                  // REQUIRED, Should be nginx port
env.devTargetPort = "80"                            // REQUIRED, Container port, should be nginx port
env.devNodePort = ""                                // REQUIRED, Exposal port for external access
env.devImagePullSecrets = "default"                 // REQUIRED, Docker secret to pull image

// Production profile
env.prodKubeConfigFileSecret = "prod-k8s-config"    // REQUIRED, Secret file credential stored on Jenkin, give in fileID
env.prodNamespace = ""                              // REQUIRED, Kubernetes namespace to deploy
env.prodPort = "80"                                 // REQUIRED, Should be nginx port
env.prodTargetPort = "80"                           // REQUIRED, Container port, should be nginx port
env.prodNodePort = ""                               // REQUIRED, Exposal port for external access
env.prodImagePullSecrets = "default"                // REQUIRED, Docker secret to pull image


/** Docker harbor configuration **/
env.harborUserPassSecret = ""                       // REQUIRED, Secret user/pass credential stored on Jenkin, give in secretID
env.harborServer = ""                               // REQUIRED, Harbor server to push built image
env.harborFolder = ""                               // REQUIRED, Harbor folder to store image


/** Git information **/
env.gitUserPassSecret = ""                          // REQUIRED, Secret user/pass credential stored on Jenkin, give in secretID
env.stagingBranch = ""                              // OPTIONAL, Staging branch won't trigger merge build pipeline


/** Report config **/
env.mailTo = ""                                     // OPTIONAL, Email to receive CICD results
env.mailCC = ""                                     // OPTIONAL, Email to receive CICD results, CC


/** Sonar config **/
env.maximumAllowedBugs = 0
env.maximumAllowedVunerabilities = 0
env.maximumAllowedCodeSmell = 0

/** Build prefix for building report **/
env.pushBuildPrefix = "JENKINS-PUSH"
env.mrBuildPrefix = "JENKINS-MERGE"
env.acceptCloseMRBuildPrefix = "JENKINS-ACCEPT-CLOSE"