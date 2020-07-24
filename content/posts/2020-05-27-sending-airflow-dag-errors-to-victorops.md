---
title: Sending Airflow DAG Errors to VictorOps
date: '2020-05-26T14:08:39.672Z'
category: Airflow
type: post
path: /wiki/sending-airflow-dag-errors-to-victorops
email: wikiexplainllc@gmail.com
author: Wington Brito
draft: false
hero:
  image: ../images/airflow.png
  large: false
  overlay: false
tags:
  - Airflow
  - VictorOps
  - Composer
  - Slack
  - DevOps
---
If you are running your Airflow [DAGs](https://airflow.apache.org/docs/stable/concepts.html#dags)(**Directed Acyclic Graph**) in [Google Cloud Composer ](https://cloud.google.com/composer), you   would think you could use a [GCP Monitoring Metrics](https://cloud.google.com/composer/docs/how-to/managing/monitoring-environments#using_on_environments). However, at the time of this writing, there is not an existing default metric we could use for DAGs or Tasks errors. Don't worry there is an easy way around it, leveraging Airflow natural support for [email notification](https://airflow.apache.org/docs/1.10.3/_modules/airflow/utils/email.html). 

Setting up Airflow with VictorOps and Slack

![Airflow Email Notification System](/images/composer-email.png "Airflow Email Notification System")

As show in the image above, we need to set up an email notification system. Luckily for us, we  do not need to build anything only configure the different pieces of the puzzle. Follow the steps below to configure the corresponding service as needed.

**I. Integrate** **[Slack](https://slack.com/)** **to** **[VictorOps](https://victorops.com/)**

*Note*: [The official guide](https://help.victorops.com/knowledge-base/slack-integration-guide/) detailed requirements and helpful tools if you looking for a more in depth instructions

*Requirements:*

* [Slack Account with Administrative Privileges](https://slack.com/help/articles/201912948-Owners-and-Administrators)
* [VictorOps account with Administrative Privileges](https://help.victorops.com/knowledge-base/user-roles-and-permissions/)

*Steps:*

* Navigate to [VictorOps web portal](https://portal.victorops.com/membership/#/) 
* Select **Integrations**
* Select **3rd Party Integrations**
* Search for **Slack**
* Click **Enable Integration**
* Enter the desired workspace and log in
* Follow the instruction and authorize the application
* Select a default Slack channel
* II. Create VictorOps Alert Routing Key

Note: [Navigate to Settings >> Routing keys](https://help.victorops.com/knowledge-base/routing-keys/) and verify if you already have a Slack channel routing key

*Requirements:*

* [Slack Account with Administrative Privileges](https://slack.com/help/articles/201912948-Owners-and-Administrators)
* [VictorOps account with Administrative Privileges](https://help.victorops.com/knowledge-base/user-roles-and-permissions/)

*Steps:*

* Navigate to [VictorOps web portal](https://portal.victorops.com/membership/#/)
* Select **Settings***
* Select **Routing Keys***
* Click **Add Key** button
* Type the Routing Key name
* Assign the Routing Key to an Escalation Policy for your team

  III. [Enable Email Integration in VictorOps](https://help.victorops.com/knowledge-base/victorops-generic-email-endpoint/)

[VictorOps](https://victorops.com/) allows you to send emails from your monitoring service or email provider to a dedicated VictorOps address. This way you will be  creating, acknowledging, or resolving incidents in your [VictorOps](https://victorops.com/) wall, I mean **timeline** :)

Requirements:

* Able to modify the subject line of the source email. Plain and simple,  you need to be able to add any of the expected key words *critical, warning, info, acknowledgement, recovery. Otherwise, refer to* *[Legacy Email Systems](https://help.victorops.com/knowledge-base/victorops-generic-email-endpoint/)* *or reach out to VictorOps support team*
* [VictorOps account with Administrative Privileges](https://help.victorops.com/knowledge-base/user-roles-and-permissions/)

*Steps*:

* Log into [VictorOps web portal](https://portal.victorops.com/membership/#/)
* Select **Integrations**
* Search **Email Generic** 
* Click **Enable Integration** button
* Replace **$routing_key** with your Routing Key from the previous step

**IV. Configure Airflow in** **[Google Composer](https://cloud.google.com/composer)** **with** **[SendGrid](https://sendgrid.com/)**

* Log into your [Google Cloud console](https://console.cloud.google.com/) account
* Select **[START WITH THE FREE PLAN](https://console.cloud.google.com/marketplace/details/sendgrid-app/sendgrid-email?_ga=2.55505771.1510518423.1590684286-760962558.1581458473)**to create a SendGrid account
* Fill up the form in the popped up window
* Select **Go Back to Google**
* Select **[Manage API keys on SendGrid website](https://console.cloud.google.com/marketplace/details/sendgrid-app/sendgrid-email?project=trendtick-259316&folder&organizationId)**
* Type a name for the key
* Select Web API
* Select **Create API Key**
* Copy the generated key
* Go back to your [Cloud Composer](https://cloud.google.com/composer) environment
* Select ENVIRONMENT VARIABLES
* Select **Edit**
* Select **ADD ENVIRONMENT VARIABLES**
* Enter SENDGRID_API_KEY for the name
* Pasted the generated SendGrid key for the value
* Select **ADD ENVIRONMENT VARIABLES** to add another variable
* Enter SENDGRID_MAIL_FROM for the name and your email from for the value. It could be the same one you use to create the SendGrid account or something [such as noreply-composer@.](https://cloud.google.com/composer/docs/how-to/managing/creating#configuring_sendgrid_email_services)
* Select **Save** and grab a drink :)

Configure Airflow

* [Airflow configured](https://airflow.apache.org/docs/stable/start.html)
* [An Airflow DAG or workflow](https://airflow.apache.org/docs/stable/tutorial.html)

Steps

* Open your DAG file
* Create a function or a module for the [on_failure_callback](https://airflow.apache.org/docs/stable/howto/operator/dingding.html) property with the [email_operator](https://airflow.apache.org/docs/stable/_modules/airflow/operators/email_operator.html). Your function or module should look like this:

```
from airflow.operators.email_operator import EmailOperator
def report_failure(context):
   subject = 'Airflow critical: {{ti}}'
   html_content = (
      'Exception:<br>{{exception_html}}<br>')
   """Send custom email alerts."""
   return EmailOperator(
     task_id='task_id',
     to='your-destination-email@email.com',
     subject=subject,
     html_content=html_content
   ).execute(context)
```

* Configure the fall back property in the DAG arguments.

```
default_args = {
   ....
   'on_failure_callback': report_failure,
   'email_on_failure': False,
   'email_on_retry': False}
```

**Configure Airflow with AWS**

1. Enable [AWS SES service](https://aws.amazon.com/ses/)
2. Select **SMTP Settings** in the left side
3. Select **Create My SMTP Credentials**
4. Copy your credentials or click the &quot;Download Credentials&quot;
5. Go to your code base and open the file airflow.cfg and replace the following properties with your downloaded/copied AWS credentials and you are done :)

```
[smtp]
smtp_host = YOUR-EMAIL-HOST-SERVER-FROM-SES
smtp_starttls = True
smtp_ssl = False
smtp_user = SES-user-from-previous-step
smtp_password = SES-password-from-previous-step
smtp_port = 587
smtp_mail_from = @email.com
```

\
Note: Port will be provided by the SMTP provider typically is 25, 587

**Configure Airflow with SendGrid SMTP Relay**

* Sign in to [SendGrid](https://sendgrid.com/)
* Select under **Integrate using our Web API or SMTP relay**
* Select **Choose** under **SMTP Relay**
* Type your API key name
* Select **Create Key**
* Select **Next: Verify Integration**
* Verify the properties
* Open airflow.cfg in your code repo
* Replace properties with your smtp sendgrid generated values.
* Set smtp_host to **smtp.sendgrid.ne** t
* Set your smtp_user to **apikey**.
* Set smtp_password to the API key generated in your SMTP account.
* Set smtp_port to 587
* Set smtp_mail_from to your account email

**Configure Airflow with Gmail**

* Login to [Gmail](http://gmail.com/)
* Go to [App passwords](https://security.google.com/settings/security/apppasswords) in your account security section
* Select App
* Select your device
* Generate your password
* Make sure you copy the generated password in somewhere you won&#39;t be able to see it again
* Open airflow.cfg
* Set **smtp_host** to **smtp.gmail.com**
* Set **smtp_user** to your Gmail address
* Set **smtp_password** to the generated 16 digits [App passwords](https://security.google.com/settings/security/apppasswords)
* Set smtp_port to 587
* Set smtp_mail_from to your Gmail address

Show me the code!

```
[smtp]
smtp_host = smtp.gmail.com
smtp_starttls = True
smtp_ssl = False
smtp_user = Your-Gmail@gmail.com
smtp_password = Your-[App passwords](https://security.google.com/settings/security/apppasswords)
smtp_port = 587
smtp_mail_from = Your-Gmail@gmail.com
```

Another option can be to configure Airflow with [esuite Relay](https://support.google.com/a/answer/2956491?hl=en)