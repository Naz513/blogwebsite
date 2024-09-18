pipeline {
  agent any
  tools {
    nodejs 'Node' // This should match the NodeJS installation name
  }
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/Naz513/blogwebsite.git', branch: 'main')
      }
    }

    stage('Install Dependencies') {
      steps {
        // Verify the contents of the workspace
        sh 'ls -la'

        // Install the necessary dependencies
        sh 'npm install'
      }
    }

    stage('Build Astro Code') {
      steps {
        // Run the build process
        sh 'npm run build'
      }
    }

    stage('Save Artifacts') {
      steps {
        // SCP the artifacts to another computer
        sh '''
          scp -r ./dist naz@100.108.100.79:/blog
        '''
      }
    }
  }
}
