node {
       echo 'This is a pipeline that performs deployment of application to SIT and UAT environment'
   
   stage('Code Checkout') {
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github_userid', url: 'https://github.com/DeepakYadav17/kubesampleapp']]])
    sh '''pwd
    ls'''
//    withCredentials([usernamePassword(credentialsId: 'github_userid', passwordVariable: 'gitloginPwd', usernameVariable: 'gitloginUser')]){
//      sh '''
//        git clone https://$gitloginUser:$gitloginPwd@repo.hclets.com/narayanan.ko/sgx-demo-app.git
//        ''' 
//   }
    
}
    
   stage('CodeBuild'){
       echo " Successfully the code has been build"
   }

      stage('Build and Push the Docker Image to the Docker Registry'){
          
      sh '''
        docker logout registry.hub.docker.com
        '''
        def dockerloginUser = params.dockerloginuser
        def dockerloginPwd = params.dockerloginpwd
      sh "docker login registry.hub.docker.com  -u $dockerloginUser -p $dockerloginPwd" }
     docker.withRegistry('https://registry.hub.docker.com') {
            def  docker_Image = docker.build("registry.hub.docker.com/naru014/kubernetessampleapp:${env.BUILD_ID}")
            docker_Image.push()
            
     }

     
     stage('Deploy Application to SIT'){
         //withCredentials([string(credentialsId: 'oclogintoken', variable: 'TOKEN')]) {
    def sitToken = params.sittoken
    sh '''
    #wget https://github.com/openshift/origin/releases/download/v1.5.1/openshift-origin-client-tools-v1.5.1-7b451fc-linux-64bit.tar.gz
    #tar -xvf openshift-origin-client-tools-v1.5.1-7b451fc-linux-64bit.tar.gz
    #mv openshift-origin-client-tools-v1.5.1-7b451fc-linux-64bit oc-tool
    cd oc-tool
    pwd
    '''
    sh "/var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc login https://masterocp.southindia.cloudapp.azure.com:8443 --token=$sitToken --insecure-skip-tls-verify"
 //}
     sh '''/var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc project sit
        /var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc apply -f /var/jenkins_home/workspace/SGX-Demo-Pipeline/sgx_demo_app.yml  
        echo " Application Successfully Deployed in SIT"
      '''
   }
    stage('Smoke Test'){
       echo "Smoke test completed successfully"
   }
     stage ('Approval for Deployment to UAT'){
        mail bcc: '', body: '''Hi,

        SGX Demo App deployment to UAT is waiting for your approval. 
        Kindly login to Jenkins and take action to proceed.
        Click on this link to go to Jenkins Build URL : https://jenkins40.devcap2.hclets.com/job/SGX-Demo-Pipeline/

        Regards
        SGX Jenkins''', cc: '', from: '', replyTo: '', subject: 'SGX Demo App Deployment to UAT Awaiting your approval', to: 'narayanan.ko@hcl.com,deepakpandhari.y@hcl.com'
        
        input 'Proceed or Abort'
         
     }
     
     stage ('Deploy to UAT'){
    //     withCredentials([string(credentialsId: 'oclogintokenuat', variable: 'TOKEN')]) {
    def uatToken = params.uattoken
    sh "/var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc login https://masterocp.southindia.cloudapp.azure.com:8443 --token=$uatToken --insecure-skip-tls-verify"
  }
     sh '''
        /var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc project uat
        /var/jenkins_home/workspace/SGX-Demo-Pipeline/oc-tool/oc apply -f /var/jenkins_home/workspace/SGX-Demo-Pipeline/sgx_demo_app.yml 
        echo " Application Successfully Deployed in UAT"
      '''
    // }
}
