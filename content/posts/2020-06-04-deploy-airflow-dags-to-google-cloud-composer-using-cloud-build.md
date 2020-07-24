---
title: Deploy Airflow DAGs to Cloud Composer using Cloud Build
date: '2020-06-04T22:14:53.183Z'
category: Cloud Build
type: post
path: /wiki/deploy-airflow-dags-to-composer
email: wikiexplainllc@gmail.com
author: Wington Brito
draft: false
hero:
  image: ../images/cloudbuildboat.jpg
  large: false
  overlay: false
tags:
  - Airflow
  - Cloud Build
  - Cloud Composer
  - cloud-build-local
  - data engineering
---
Deploy [Airflow DAGs](https://airflow.apache.org/docs/stable/concepts.html) to [Google Cloud Composer](https://cloud.google.com/composer) using [Cloud Build](https://cloud.google.com/cloud-build)

![](/images/png.png)

*Note:* *[Cloud Build](https://cloud.google.com/cloud-build)* *allows you to use available images from* *[Docker Hub](https://hub.docker.com/explore/)* to *run your tasks*

**Requirements:**

* **Make sure you have build a** **[container registry image](https://cloud.google.com/cloud-build/docs/building/build-containers)**
* **Install gcloud inside your container. Check this simple sample** **[Dockerfile](https://gist.github.com/neybapps/ddbf4e9c44e69190107717d42ddb508b)** **or a** **[full repo](https://github.com/GoogleCloudPlatform/cloud-sdk-docker/blob/master/Dockerfile)**
* **Configure gcloud inside your Docker container**
* **Configure your** **[Google Cloud Composer environment](https://cloud.google.com/composer/docs/how-to/managing/creating)**
* Create a [yaml](https://yaml.org/) file typically same path of the folder you plan to run your tasks against
* Specify the image URL in the name field in your yml file. Ex: 

`gcr.io/cloud-builders/docker`

* Use the args field to specify commands that you want to run within the image. Example

```
#cloudbuild.yml
steps:
- name:
'ubuntu'
args: ['echo', 'hello world']
```

* [Test it locally](https://cloud.google.com/cloud-build/docs/build-debug-locally) in your machine this way you short the development circle and [dry run](https://cloud.google.com/cloud-build/docs/build-debug-locally#verify_the_build_with_a_dry_run) to lint yml file. Install  \[Google Cloud SDK] (gcloud components install cloud-build-local) Docker
  Make sure you have Docker credentials :
  `gcloud components install docker-credential-gcr` `gcloud auth configure-docker` Run test
  `cloud-build-local --config=path-to-cloudbuild.yaml --dryrun=false .`
* Add a step to run your deploy commands from within your container. We can use gcloud

```steps:
steps
  - name: 'gcr.io/cloud-builders/docker'
  entrypoint: 'bash'
  args:
  - '-c'
  - >
  docker run -i
  -v "$(pwd)"/src/DAGS:/DAGS
  gcr.io/$PROJECT_ID/airflow-composer:latest
  gcloud composer environments storage dags import
  --environment YOUR-ENVIRONMENT_NAME
  --location YOUR-REGION-LOCATION
  --source YOUR-DAG-LOCAL_FILE_TO_UPLOAD
substitutions:
 _ENV: local
images:
- 'gcr.io/$PROJECT_ID/airflow-composer'
```

Note: Use your [substitute variables](https://cloud.google.com/cloud-build/docs/configuring-builds/substitute-variable-values#using_default_substitutions) as needed. $PROJECT_ID here is just going to be replaced at runtime for your ID of your Cloud project.

The -c argument is:

[Read commands from the command_string operand instead of from the standard input. Special parameter 0 will be set from the command_name operand and the positional parameters ($1, $2, etc.) set from the remaining argument operands. EX: $ sh -c "echo This is a test string"](https://askubuntu.com/questions/831847/what-is-the-sh-c-command)