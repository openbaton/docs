# Tutorial: Dummy Network Service Record
-----------------------------------------

This tutorial explains how to deploy a Network Service Record composed of Dummy VNFs. It is typically used for testing that the installation of the NFVO went fine. 
It will not launch any Virtual Machines nor actually deploy a real Network Service.

You can execute also the same tutorial using the [TOSCA] definitions. 

## Requirements

In order to execute this scenario, you need to have the following components up and running: 
 
 * [NFVO]
 * [Test vim driver]
 * [Dummy-VNFM] 

## Preparation

If not yet running start the NFVO and the Dummy-VNFM (refer to it's [readme][Dummy-VNFM] file on how to start it).  
If you installed the NFVO using the bootstrap script, the Test vim driver will be installed already.  
Otherwise, you have to provide it manually by cloning the [git repository][test-plugin-github] and building the jar file with *./gradlew build*.
Now move the built jar into **{path-to-nfvo-source-code}/nfvo/plugins/vim-drivers** and restart the NFVO. 

## Store the VimInstance

Upload a VimInstance with the type *test* to the NFVO (e.g. this [VimInstance]). 
The type *test* will make sure that the NFVO uses the Test vim driver for deploying network services.  



For registering the Point of Presence of type *test* to the NFVO you have to upload a Vim Instance. You can use this [VimInstance]. 

### Using the dashboard

If you want to use the Dashboard (checkout the [dashboard documentation][dashboard] for more information on how to use it), open it at the URL http://ip-where-nfvo-runs:8080 (change port and protocol if you use SSL) and log in (default username and password are *admin* and *openbaton*).  
Go to `Manage PoPs -> PoP Instances` and choose the Vim Instance of your choice by clicking on `Register Vim` and selecting the Vim Instance's json file.

![Onboarding-Vim][vim-onboarding]

### Using the CLI

If you want to use the CLI (checkout the [Open Baton Client documentation][cli] for more information on how to install and use it), you need to execute the following command in order to onboard the Vim Instance where *vim-instance.json* is the path to the Vim Instance file:

```bash
$./openbaton.sh VimInstance-create vim-instance.json
```

## Store the Network Service Descriptor 

Download this [NSD] and upload it to the NFVO either using the dashboard or the cli. 

### Using the dashboard

If you want to use the Dashboard go to `Catalogue -> NS Descriptors` and choose the NSD of your choice by clicking on `Upload NSD` and selecting the Descriptor's json file.

![Onboarding-NSD][nsd-onboarding]

### Using the CLI

If you want to use the CLI you need to execute the following command in order to onboard the NSD:

```bash
$./openbaton.sh NetworkServiceDescriptor-create tutorial-iperf-NSD.json
```

Once this request is processed successfully, it returns the following:

```bash
+------------------ +------------------------------------------------------------------ + 
| PROPERTY          | VALUE                                                             | 
+------------------ +------------------------------------------------------------------ + 
| VNFD              |                                                                   | 
|                   | id: 50c89b6a-2c3e-40b0-8f85-a4ee00f93ea6 - name:  dummy-client    | 
|                   | id: 55c1bdc8-af49-48e1-a438-4f4758edb5c2 - name:  dummy-server    | 
|                   |                                                                   | 
| VNF_DEPENDENCY    |                                                                   | 
|                   | id: 863177bd-4c68-42b3-a982-fa350ace94b1                          | 
|                   |                                                                   | 
| id                | bef3c744-b02a-48f1-9d14-9ede7847bc57                              | 
|                   |                                                                   | 
| hb_version        | 1                                                                 | 
|                   |                                                                   | 
| name              | dummy-NS                                                          | 
|                   |                                                                   | 
| projectId         | 2feadcfd-87cd-404c-9f52-7d5e621d1f0c                              | 
|                   |                                                                   | 
| vendor            | Fokus                                                             | 
|                   |                                                                   | 
| version           | 0.1                                                               | 
|                   |                                                                   | 
| VLD               |                                                                   | 
|                   | id: 2cb51390-48e0-4dc6-bbd4-1fe10655a087 - name:  private         | 
|                   |                                                                   | 
+------------------ +------------------------------------------------------------------ + 
```

## Deploy the Network Service Descriptor 

As soon as you onboarded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.  
This will create a Network Service Record (NSR) but because it is a Dummy-VNFM no Virtual Machines will be launched. 

### Using the dashboard

This part shows you how to deploy an onboarded NSD via the dashboard. You need to go to the GUI again and navigate to `Catalogue -> NS Descriptors`. Open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button and a window with launching options will appear. Just click on `Launch` again in order to start the deployment of this NSD.

![nsr-deploy][nsr-deploy]

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the created NSR.

### Using the CLI

You can also use the CLI for deploying existing NSDs. The command needs the ID of the NSD to deploy as an argument. It can be found either by using the dashboard or getting it from the output when onboarding a new NSD as done in the previous step. The command to deploy the previously onboarded NSD looks like shown below:

```bash
$./openbaton.sh NetworkServiceRecord-create bef3c744-b02a-48f1-9d14-9ede7847bc57 vimmap.json keypair.json conf.json
```

The first argument is the ID of the NSD from which the NSR will be created. The following arguments are files that can contain additional configuration while deploying. 
You have to pass these files even if you do not want to pass any configuration like in our case. So just create the three files and fill them with empty json objects/arrays (i.e. *{}* and *[]*).  
The *vimmap.json* and the *conf.json* files should contain this:
```json
{}
```
And the *keypair.json* file this:
```json
[]
```

The execution of this command produces the following output:

```bash
+------------------------ +------------------------------------------------------------- + 
| PROPERTY                | VALUE                                                        | 
+------------------------ +------------------------------------------------------------- + 
| id                      | 50388d15-237c-40c0-9e71-357a0d9475db                         | 
|                         |                                                              | 
| vendor                  | Fokus                                                        | 
|                         |                                                              | 
| projectId               | 2feadcfd-87cd-404c-9f52-7d5e621d1f0c                         | 
|                         |                                                              | 
| task                    | Onboarding                                                   | 
|                         |                                                              | 
| version                 | 0.1                                                          | 
|                         |                                                              | 
| VLR                     |                                                              | 
|                         | id: 6fe543f9-da83-46f6-948a-10f55ad6dec1 - name:  private    | 
|                         |                                                              | 
| VNF_DEPENDENCY          |                                                              | 
|                         | id: 222ff41f-33b9-4f49-af56-a34d9265d510                     | 
|                         |                                                              | 
| descriptor_reference    | bef3c744-b02a-48f1-9d14-9ede7847bc57                         | 
|                         |                                                              | 
| status                  | NULL                                                         | 
|                         |                                                              | 
| createdAt               | 2016.10.26 at 12:30:30 CEST                                  | 
|                         |                                                              | 
| name                    | dummy-NS                                                     | 
|                         |                                                              | 
+------------------------ +------------------------------------------------------------- +  
```

In order to follow the deployment process you can retrieve information by passing the ID of the deploying NSR to this command:

```bash
$./openbaton.sh NetworkServiceRecord-findById 50388d15-237c-40c0-9e71-357a0d9475db


+------------------------ +------------------------------------------------------------------ + 
| PROPERTY                | VALUE                                                             | 
+------------------------ +------------------------------------------------------------------ + 
| id                      | 50388d15-237c-40c0-9e71-357a0d9475db                              | 
|                         |                                                                   | 
| vendor                  | Fokus                                                             | 
|                         |                                                                   | 
| projectId               | 2feadcfd-87cd-404c-9f52-7d5e621d1f0c                              | 
|                         |                                                                   | 
| task                    | Onboarded                                                         | 
|                         |                                                                   | 
| version                 | 0.1                                                               | 
|                         |                                                                   | 
| VLR                     |                                                                   | 
|                         | id: 6fe543f9-da83-46f6-948a-10f55ad6dec1 - name:  private         | 
|                         |                                                                   | 
| VNFR                    |                                                                   | 
|                         | id: bc75a14d-53b3-46b3-9f2d-ad061a843cbd - name:  dummy-client    | 
|                         | id: 59a12259-b229-4e81-89d4-e0bc3a02415c - name:  dummy-server    | 
|                         |                                                                   | 
| VNF_DEPENDENCY          |                                                                   | 
|                         | id: 222ff41f-33b9-4f49-af56-a34d9265d510                          | 
|                         |                                                                   | 
| descriptor_reference    | bef3c744-b02a-48f1-9d14-9ede7847bc57                              | 
|                         |                                                                   | 
| status                  | ACTIVE                                                            | 
|                         |                                                                   | 
| createdAt               | 2016.10.26 at 12:30:30 CEST                                       | 
|                         |                                                                   | 
| name                    | dummy-NS                                                          | 
|                         |                                                                   | 
+------------------------ +------------------------------------------------------------------ +
```

## Conclusions

After the Dummy-Vnfm and the NFVO finished their work the deployed NSR will change to *ACTIVE* state.  
No virtual machines were created and no real network service was deployed.  
The Test vim driver ensured that the NFVO thought that all the required resources were allocated and the Vim Instance created. 
The Dummy-VNFM lead the NFVO to believe that it created virtual machines and executed the lifecycle event scripts on them. 

<!---
References
-->
[nfvo-installation]:nfvo-installation.md
[dashboard]: nfvo-how-to-use-gui
[Dummy-VNFM]: https://github.com/openbaton/dummy-vnfm-amqp
[vim-doc]:vim-instance-documentation
[Test vim driver]: https://github.com/openbaton/test-plugin
[NSD]: descriptors/tutorial-dummy-NSR/tutorial-dummy-NSR.json
[VimInstance]: descriptors/vim-instance/test-vim-instance.json
[NFVO]: https://github.com/openbaton/NFVO
[TOSCA]: tosca-dummy-nsr.md
[test-plugin-github]:https://github.com/openbaton/test-plugin
[vim-onboarding]: images/tutorials/tutorial-dummy-NSR/vim-onboarding.png
[nsd-onboarding]: images/tutorials/tutorial-dummy-NSR/nsd-onboarding.png
[nsr-deploy]: images/tutorials/tutorial-dummy-NSR/nsr-deploy.png

<!---
Script for open external links in a new tab
-->
<script type="text/javascript" charset="utf-8">
      // Creating custom :external selector
      $.expr[':'].external = function(obj){
          return !obj.href.match(/^mailto\:/)
                  && (obj.hostname != location.hostname);
      };
      $(function(){
        $('a:external').addClass('external');
        $(".external").attr('target','_blank');
      })
</script>
