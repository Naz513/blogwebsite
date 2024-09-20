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
                sh 'npm install'
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

                    if (commitMsg.contains('BREAKING CHANGE')) {
                        sh 'npm version major'
                    } else if (commitMsg.startsWith('feat')) {
                        sh 'npm version minor'
                    } else if (commitMsg.startsWith('fix')) {
                        sh 'npm version patch'
                    }
                }
            }
        }

        stage('Delete Existing Local Tag') {
            steps {
                script {
                    def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()

                    def tagExists = sh(script: "git tag -l v${version}", returnStdout: true).trim()
                    
                    if (tagExists) {
                        sh "git tag -d v${version}"
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                // // Debug step to check node_modules and PATH
                // sh 'ls -la node_modules/.bin'
                // sh 'echo $PATH'
                
                // Run Astro using npx to ensure it uses the local node_modules version
                sh 'npx --no-install astro check && npx --no-install astro build'
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

        stage('Create GitHub Release and Upload Build Artifacts') {
            steps {
                script {
                    def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()

                    withCredentials([usernamePassword(credentialsId: 'git-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        // Create a GitHub release
                        sh """
                            curl -H "Authorization: token ${GIT_PASSWORD}" \
                                 -d '{"tag_name": "v${version}", "name": "v${version}", "body": "Release v${version}", "draft": false, "prerelease": false}' \
                                 https://api.github.com/repos/Naz513/blogwebsite/releases
                        """

                        // Upload the built artifact (adjust the path to your build output)
                        sh """
                            upload_url=\$(curl -H "Authorization: token ${GIT_PASSWORD}" \
                                                https://api.github.com/repos/Naz513/blogwebsite/releases/tags/v${version} \
                                                | jq -r '.upload_url' | sed -e "s/{?name,label}//")
                            curl -H "Authorization: token ${GIT_PASSWORD}" \
                                 -H "Content-Type: application/zip" \
                                 --data-binary @path/to/your/built/artifact.zip \
                                 "\${upload_url}?name=artifact.zip"
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
