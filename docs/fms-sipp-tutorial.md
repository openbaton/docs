# Tutorial: Fault Management System
-----------------------------------------  

This tutorial explain how to use the Fault Management System in a simple network service. The network service is composed by a SIPp client and a SIPp server. 
The Fault Management System will create a standby SIPp server in order to protect the active SIPp server from failures.

## Requirements

In order to execute this scenario, you need to have the following components up and running:

 * [NFVO][nfvo-github]
 * [OpenStack vim driver][openstack-plugin]
 * [Zabbix plugin][zabbix-plugin] + Zabbix Server 2.2v
 * [Generic VNFM][generic-vnfm]
 * [Fault Management System][fms]
 * OpenStack

Start the NFVO and Generic VNFM depending on how you [installed][installation] it.  
If you used the bootstrap script for installing you do not have to care about the OpenStack vim driver as it will be installed already. 

## Store the Vim Instance

For registering the Point of Presence of type OpenStack to the NFVO you have to upload a Vim Instance. You can use the following [json descriptor][vim] by changing the values to your needs. 

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

Download the [sipp-fms-nsd.json][sipp-fms-nsd] file, and upload it in the catalogue either using the dashboard or the CLI.  

### Using the dashboard

If you want to use the Dashboard go to `Catalogue -> NS Descriptors` and choose the NSD of your choice by clicking on `Upload NSD` and selecting the Descriptor's json file.

![Onboarding-NSD][nsd-onboarding]

### Using the CLI

If you want to use the CLI you need to execute the following command in order to onboard the NSD:

```bash
$./openbaton.sh NetworkServiceDescriptor-create sipp-fms-nsd.json
```

Once this request is processed successfully, it returns the following:

```bash
+------------------ +------------------------------------------------------------------ + 
| PROPERTY          | VALUE                                                             | 
+------------------ +------------------------------------------------------------------ + 
| VNFD              |                                                                   | 
|                   | id: 2dd6a30d-0eee-4f88-aa45-9f3a420f341b - name:  sipp-server     | 
|                   | id: 55ac1b21-fdf0-4fe3-861e-5b1f6b5079e3 - name:  sipp-client     | 
|                   |                                                                   | 
| VNF_DEPENDENCY    |                                                                   | 
|                   | id: 123b3dc1-4310-405c-8c50-17dbb1becd2d                          | 
|                   |                                                                   | 
| id                | f2086f71-4ecf-4ed8-a692-36775ebdfc68                              | 
|                   |                                                                   | 
| hb_version        | 1                                                                 | 
|                   |                                                                   | 
| name              | SIPp with fms                                            | 
|                   |                                                                   | 
| projectId         | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                              | 
|                   |                                                                   | 
| vendor            | FOKUS                                                             | 
|                   |                                                                   | 
| version           | 1.0                                                               | 
|                   |                                                                   | 
| VLD               |                                                                   | 
|                   | id: bd65ee00-ce56-42f4-9d31-5cd220ee64a6 - name:  private         | 
|                   |                                                                   | 
+------------------ +------------------------------------------------------------------ + 
```

## Deploy the Network Service Descriptor
As soon as you onboarded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.  
This will create a Network Service Record (NSR) and actually launch the Virtual Machines on OpenStack. The network service is composed by two VNFC instances (virtual machines), however the Fault Management System creates a third virtual machine, which consists in the SIPp server in standby.

### Using the dashboard

This part shows you how to deploy an onboarded NSD via the dashboard. You need to go to the GUI again and navigate to `Catalogue -> NS Descriptors`. Open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button and a window with launching options will appear. Just click on `Launch` again in order to start the deployment of this NSD.

![nsr-deploy][nsr-deploy]

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the created NSR.  
Once the network service goes to ACTIVE there should be two SIPp server (one ACTIVE and one in STANDBY) and one SIPp client.
Regarding the SIPp server VNF you should see the following:

![vnfc-active-standby][vnfc-active-standby]

## Trigger the switch to standby

Now you can trigger the switch to standby simulating a failure.  
Go to Openstack dashboard and terminate the virtual machine which correspond to the ACTIVE SIPp server. As you can expect the SIPp client will loose the connection with the server.  
However after 1/2 minutes the FMS will execute the switch to standby. After this action, the standby SIPp server is activated and the client will connect to the new one, so that the network service recovers from the failure.

<!---
References
-->

[nfvo-github]:https://github.com/openbaton/NFVO
[openstack-plugin]:https://github.com/openbaton/openstack-plugin
[zabbix-plugin]:https://github.com/openbaton/zabbix-plugin
[generic-vnfm]:https://github.com/openbaton/generic-vnfm
[installation]:nfvo-installation
[fms]:https://github.com/openbaton/fm-system
[dashboard]: nfvo-how-to-use-gui
[cli]: nfvo-how-to-use-cli
[sipp-fms-nsd]:descriptors/tutorial-sipp-fms/sipp-fms-nsd.json
[nsd-onboarding]: images/tutorials/tutorial-iperf-NSR/nsd-onboarding.png
[nsr-deploy]: images/tutorials/tutorial-iperf-NSR/nsr-deploy.png
[vnfc-active-standby]:images/tutorials/tutorial-sipp-fms/vnfc-active-standby.png