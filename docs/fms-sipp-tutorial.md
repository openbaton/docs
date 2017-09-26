# Tutorial: Fault Management System

This tutorial explain how to use the Fault Management System in a simple network service. The network service is composed by a SIPp client and a SIPp server. 
The Fault Management System will create a standby SIPp server in order to protect the active SIPp server from failures.

## Requirements

In order to execute this scenario, you need to have the following components up and running:

 * [NFVO][nfvo-github]
 * [OpenStack vim driver][openstack-plugin]
 * [Zabbix plugin][zabbix-plugin] + Zabbix Server (2.2 or 3.0 version)
 * [Generic VNFM][generic-vnfm]
 * [Fault Management System][fms]
 * OpenStack

Start the NFVO and Generic VNFM depending on how you [installed][installation] it.  
If you used the bootstrap script for installing you do not have to care about the OpenStack vim driver as it will be installed already, as well as Zabbix Plugin. 

## Store the Vim Instance

For registering the Point of Presence of type OpenStack to the NFVO you have to upload a Vim Instance. You can use the following [json descriptor][vim-instance-json] by changing the values to your needs. 

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

Download the [sipp-fms-nsd.json][sipp-fms-nsd] file, make sure that all the parameters fit with your environment and then upload it in the catalogue either using the dashboard or the CLI.  
The main parameters you should check before uploading the NSD are: vm_image (make sure you have and Ubuntu image in OpenStack and its name matches the one in this parameter), vimInstanceName (if you only have one vim instance you can leave it empty otherwise you must specify the vim instance name in this parameter or when you will launch the NSD) and flavour_key (make sure you have a flavour in OpenStack matching the one in this parameter).

### Using the dashboard

If you want to use the Dashboard go to `Catalogue -> NS Descriptors`, copy the text of NSD "sipp-fms-nsd.json", click `Add NSD -> Upload NSD`, paste the NSD and click `Store NSD`.

### Using the CLI

If you want to use the CLI you need to execute the following command in order to onboard the NSD:

```bash
$./openbaton.sh NetworkServiceDescriptor-create sipp-fms-nsd.json
```

## Deploy the Network Service Descriptor
As soon as you uploaded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.  
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
However after 1/2 minutes the FMS will execute the switch to standby. After this action, the standby SIPp server will be activated and the client will connect to the new one, so that the network service recovers from the failure.

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
[nsr-deploy]: images/tutorials/tutorial-sipp-fms/nsr-deploy-rel-4.png
[vnfc-active-standby]:images/tutorials/tutorial-sipp-fms/vnfc-active-standby-rel-4.png
[vim-instance-json]:descriptors/vim-instance/openstack-vim-instance.json
[vim-onboarding]: images/tutorials/tutorial-sipp-fms/vim-onboarding-rel-4.png
