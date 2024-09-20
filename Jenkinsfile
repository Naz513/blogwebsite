pipeline {
    agent any
    tools {
        nodejs 'Node'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code using the correct Git credentials
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Naz513/blogwebsite.git',
                        credentialsId: 'git-credentials'
                    ]],
                    extensions: [[$class: 'CleanBeforeCheckout']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                // Use npm ci for clean install and faster builds
                sh 'npm ci'
            }
        }

        stage('Configure Git Identity') {
            steps {
                // Configure the Git user name and email for Jenkins commits
                sh '''
                    git config user.name "Mohd Saquib"
                    git config user.email "nsaquib96@gmail.com"
                '''
            }
        }

        stage('Determine Version Bump') {
            steps {
                script {
                    def commitMsg = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()

                    if (!commitMsg) {
                        echo 'No commit message found. Skipping version bump.'
                    } else {
                        // Use regex for more accurate matching
                        if (commitMsg =~ /BREAKING CHANGE/) {
                            echo 'Bumping Major version...'
                            sh 'npm version major -m "chore(release): %s"'
                        } else if (commitMsg =~ /^feat(\(.*\))?:/) {
                            echo 'Bumping Minor version...'
                            sh 'npm version minor -m "chore(release): %s"'
                        } else if (commitMsg =~ /^fix(\(.*\))?:/) {
                            echo 'Bumping Patch version...'
                            sh 'npm version patch -m "chore(release): %s"'
                        } else {
                            echo 'No version bump required.'
                        }
                    }
                }
            }
        }

        stage('Push Version and Tag to Git') {
            steps {
                script {
                    // Use SSH credentials for secure Git operations
                    sshagent(['git-credentials']) {
                        sh 'git push origin main --follow-tags'
                    }
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
