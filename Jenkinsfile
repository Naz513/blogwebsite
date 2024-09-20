pipeline {
    agent any
    tools {
        nodejs 'Node'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git-credentials', url: 'https://github.com/Naz513/blogwebsite.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Check jq Installation') {
            steps {
                script {
                    // Check if jq is installed, if not install it
                    def isJqInstalled = sh(script: 'command -v jq', returnStatus: true)
                    if (isJqInstalled != 0) {
                        sh '''
                            if [ -x "$(command -v apt-get)" ]; then
                                apt-get update && apt-get install -y jq
                            else
                                echo "Please install jq manually."
                                exit 1
                            fi
                        '''
                    } else {
                        echo 'jq is already installed.'
                    }
                }
            }
        }

        stage('Clean Working Directory') {
            steps {
                sh 'git reset --hard'
                sh 'git clean -fdx'
            }
        }

        stage('Configure Git Identity') {
            steps {
                sh 'git config user.name "Mohd Saquib"'
                sh 'git config user.email "nsaquib96@gmail.com"'
            }
        }

        stage('Determine Version Bump') {
            steps {
                script {
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()

                    if (commitMsg == null || commitMsg.trim().isEmpty()) {
                        echo 'No commit message found. Skipping version bump.'
                    } else {
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
        }

        stage('Push Version and Tag to Git') {
            steps {
                script {
                    def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()
                    withCredentials([usernamePassword(credentialsId: 'git-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh """
                            git add .
                            git commit -m "chore(release): bump version to v${version}" || true
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Naz513/blogwebsite.git main
                            git tag -a v${version} -m "Release v${version}"
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Naz513/blogwebsite.git v${version}
                        """
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
