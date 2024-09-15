pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/Naz513/blogwebsite.git', branch: 'main')
      }
    }

    stage('Build Astro Code') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Save Artifacts') {
      steps {
        sh 'cp -r ./dist /Documents/blog'
      }
    }

  }
}