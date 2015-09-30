# OpenBaton Dashboard
The Dashboard of OpenBaton helps you for the the management of lifecycle of different objects like 
VimInstaces, Network Service Descriptors/Records and Virtual Network Function Descriptos/Records in the OpenBaton environment.


## Overview
The index page is an overview of the state of NFVO 
 
 1. Number of Network Service Records
 2. Number of Virtual Network Functions
 3. Number of Virtual Deployment Units
 4. Number of Network Service Descriptors

![index.html](/img/gui/overview.png "Overview")


## Manage PoPs
In this page you can see the list of Vim Instances registered

![List of Vim Instances](/img/gui/vimpage.png "Vim List")

For registering a new Vim Instance you should click the button on the top-right side **Register Vim** of this page and choose your json to register a Vim Instance

![Register a new Vim Instances](/img/gui/registeraNewVim.png "Register Vim")

If you want to delete one Vim Instance you can click the button **Action** and than **Delete** in the menu

## Network Service Descriptors
In the menu on the left side under the voice Catalogue you can find **NS Decriptors**
In this page you can see the list of NS Descriptors stored into OpenBaton

![List of NS Descriptors](/img/gui/NSDlist.png "NS Descriptors List")


For storing a NS Descriptor you have 2 options:

1. Create NSD Form
2. Create NSD File


Create a NSD using a File

![NSD create by File](/img/gui/NSDcreateFile.png "NSD create by File")


Create a NSD using Form

![NSD create by Form](/img/gui/NSDcreateForm.png "NSD create by Form")

### Network Service Descriptor Information
In the list of Network Service Descriptors if you click on the id in the table you can see the information
 into Network Service Descriptor selected by id and will be shown this page

![Network Service Descriptor Information](/img/gui/VNFDlistintoNSD.png "Network Service Descriptor Information")

In the list of VNFD if you click the *Action* button you can delete the VNFD from NSD
and the information about the *Dependencies* into Network Service Descriptor

![Network Service Descriptor Dependencies Information](/img/gui/VNFDlistintoNSD1.png "Network Service Descriptor Dependencies Information ")

In the list of VNFDependencies if you click the *Action* button you can delete the VNFDependency from NSD

### Network Service Descriptor Information
In the list of Network Service Descriptors if you click on the id in the table you can see the information
 into Network Service Descriptor selected by id and will be shown this page

![VNF Descriptor Information](/img/gui/VNFDescriptorInformation.png "VNF Descriptor Information")

In this page you can see the JSON file of the NSD just clicking on the link **Show JSON**

![JSON of Network Service Descriptor](/img/gui/JSONofNSR.png "JSON of Network Service Descriptor")

In the page **Network Service Descriptor Information** you can see the **Graphical view** of Network Service Descriptor 
just clicking the link *Show Graph*

![NSD Graph](/img/gui/NSDgraph.png "NSD graph.png")


#### Virtual Network Function Descriptor Information
In the list of Virtual Network Function Descriptor into NSD if you click on the id of Virtual Network Function Descriptor will be shown this page

![VNF Descriptor Information](/img/gui/VNFDescriptorInformation.png "VNF Descriptor Information")

In the bottom side of the page you can see the Virtual Deployment Unit (VDU) tab and if you click the **id** of the 
VDU you can see the details of VDU like in this page

![VDU Information](/img/gui/VDUInformation.png "VDU Information")

## Network Service Records 

  In the menu of the left side if you click on the **Orchestrator NS** and than **NS Records** you will see the list of *Network Service Records*
  Like in this screenshot 

![Network Service Records List ](/img/gui/NetworkServiceRecordsList.png "Network Service Records List ")

In this page you can see the details of a Network Service Record just click the id and will be show this page

![Network Service Records Info ](/img/gui/NSRinfo.png "Network Service Records Info ")

In this page you can see the JSON file of the NSR just clicking on the link **Show JSON** and also the **Graphical view** 
of Network Service Record just clicking the link **Show Graph**
In the table of VNF Records you can delete one VNFR just clicking **Delete** in the menu **Action**
For seeing the details of VNFR just click on the **id** of a VNFR and will be shown this page

![VNF Record Information](/img/gui/VNFRecordInformation.png "VNF Record Information")


