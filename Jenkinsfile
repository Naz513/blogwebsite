pipeline {
  agent any
  tools {
    nodejs 'Node' // Ensure this matches the NodeJS installation name in Jenkins
  }

  stages {
    stage('Checkout Code') {
      steps {
        // Checkout the code using the correct Git credentials
        git branch: 'main', credentialsId: 'git-credentials', url: 'https://github.com/Naz513/blogwebsite.git'
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

    stage('Determine Version Bump') {
      steps {
        script {
          def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()

          // Check if commit message contains 'BREAKING CHANGE', 'feat', or 'fix'
          if (commitMsg.contains('BREAKING CHANGE')) {
            echo 'Bumping Major version...'
            sh 'npm version major'
          } else if (commitMsg.startsWith('feat')) {
            echo 'Bumping Minor version...'
            sh 'npm version minor'
          } else if (commitMsg.startsWith('fix')) {
            echo 'Bumping Patch version...'
            sh 'npm version patch'
          } else {
            echo 'No version bump required.'
          }
        }
      }
    }

    stage('Build Astro Code') {
      steps {
        // Run the Astro build process
        sh 'npm run build'
      }
    }

    stage('Push Version and Tag to Git') {
      steps {
        script {
          def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()

          sh '''
            git config user.name "Jenkins CI"
            git config user.email "jenkins@ci.com"
            
            git add package.json
            git commit -m "chore(release): bump version to v${version}"
            
            # Push changes and tag
            git push origin main
            git tag -a v${version} -m "Release v${version}"
            git push origin v${version}
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Release process completed successfully!'
    }
    failure {
      echo 'Release process failed!'
    }
  }
}
