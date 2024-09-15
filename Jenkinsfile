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
        sh 'mkdir -p $WORKSPACE/blog'  // Create the target directory if it doesn't exist
        sh 'cp -r ./dist $WORKSPACE/blog' // Copy the dist folder to the blog directory in the workspace
      }
    }
  }
}