---
title: "Implementing Semantic Versioning on my Website with Jenkins"
description: "Learn how I automated semantic versioning for my website using a Jenkins pipeline."
date: "Sep 19 2024"
demoURL: "https://www.mohdsaquib.com"
repoURL: "https://github.com/Naz513/blogwebsite/blob/main/Jenkinsfile"
tags: ["Semantic Versioning", "Jenkins"]
---

## Overview

In this post, I explain how I implemented **semantic versioning** for my website using Jenkins. Semantic Versioning, often referred to as SemVer, is a versioning system used to communicate changes in software in a clear and predictable way. It helps manage and track changes in a consistent and predictable manner, allowing for more organized releases and easier collaboration. I wanted to do the same for this website and track its versioning overtime. And to do that, I built a Jenkins pipeline that automates version bumping based on commit messages, streamlining the deployment process of my site.

## Pipeline Overview

The Jenkinsfile that can be accessed using the git repo, automates the versioning and deployment process of the website. Below is a breakdown of how the pipeline stages work:

### 1. Checkout Code

The pipeline starts by checking out the latest code from the main branch of my GitHub repository using configured Git credentials. This step ensures that Jenkins works with the most up-to-date codebase.

```groovy
stage('Checkout Code') {
    steps {
        git branch: 'main', credentialsId: 'git-credentials', url: 'https://github.com/Naz513/blogwebsite.git'
    }
}
```

### 2. Install Dependencies

This stage verifies the contents of the workspace and installs the required dependencies using npm install, preparing the environment for further stages.

```groovy
stage('Install Dependencies') {
    steps {
        sh 'ls -la'
        sh 'npm install'
    }
}
```

### 3. Configure Git Identity

Configuring the Git user details ensures that any automated commits and tags are attributed correctly within the repositor using my credentials.

```groovy
stage('Configure Git Identity') {
    steps {
        sh 'git config user.name "Mohd Saquib"'
        sh 'git config user.email "nsaquib96@gmail.com"'
    }
}
```

### 4. Determine Version Bump

This critical stage automates the semantic versioning process by examining the most recent commit message. Based on the content of the message, the pipeline determines whether to bump the major, minor, or patch version.

- <ins>Major Version</ins>: Triggered by messages containing "**BREAKING CHANG**E**". Example: Revamping the entire website.
- <ins>Minor Version</ins>: Triggered by messages starting with "**feat**". Example: Adding a new project, adding a new component, adding a new page.
- <ins>Patch Version</ins>: Triggered by messages starting with "**fix**". Example: Word fixes, color styling, updating dependencies for vulnerbalities.

```groovy
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
            } else {
                echo 'No version bump required.'
            }
        }
    }
}
```

### 5. Push Version and Tag to Git

Finally, the updated version is pushed to the main branch, and a new Git tag is created and pushed, marking the release. The credentials are securely managed within Jenkins.

```groovy
stage('Push Version and Tag to Git') {
    steps {
        script {
            def version = sh(script: "cat package.json | jq -r .version", returnStdout: true).trim()
            withCredentials([usernamePassword(credentialsId: 'git-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                sh """
                    git add package.json
                    git commit -m "chore(release): bump version to v${version}" || true
                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Naz513/blogwebsite.git main
                    git tag -a v${version} -m "Release v${version}"
                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Naz513/blogwebsite.git v${version}
                """
            }
        }
    }
}
```

## Why Semantic Versioning?

Semantic versioning (MAJOR.MINOR.PATCH) is crucial for conveying the impact of changes in a project. It helps manage expectations and aligns release cycles with the nature of changes, providing clear communication about the project's state.

- Major updates indicate breaking changes.
- Minor updates add features without breaking existing functionality.
- Patch updates fix bugs and make minor improvements.

By integrating semantic versioning into my CI/CD pipeline, I’ve automated version management, making deployments more predictable and organized.

## Conclusion

Integrating semantic versioning into my CI/CD pipeline was a significant step toward enhancing the reliability and maintainability of my website. With the Jenkins pipeline handling version management, I can focus on building features, knowing that my deployments are organized and clearly communicated. This setup not only boosts confidence in my release process but also aligns with best practices in software development.
