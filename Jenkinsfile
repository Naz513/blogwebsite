pipeline {
    agent any
    tools {
        nodejs 'Node' // Ensure this matches the NodeJS installation name in Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git-credentials', url: 'https://github.com/Naz513/blogwebsite.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'ls -la'
                sh 'npm install'
            }
        }

        stage('Install jq') {
            steps {
                sh '''
                if ! command -v jq &> /dev/null
                then
                    echo "jq not found, installing..."
                    apt-get update && apt-get install -y jq
                fi
                '''
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

        stage('Delete Existing Local Tag') {
            steps {
                script {
                    def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()

                    // Check if the tag exists locally and delete it if found
                    def tagExists = sh(script: "git tag -l v${version}", returnStdout: true).trim()
                    
                    if (tagExists) {
                        echo "Deleting local tag v${version}..."
                        sh "git tag -d v${version}"
                    }
                }
            }
        }

        stage('Push Version and Tag to Git') {
            steps {
                script {
                    def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()

                    sh '''
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
