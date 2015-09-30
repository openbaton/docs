# OpenBaton Dashboard
The Dashboard of OpenBaton helps you for the the management of lifecycle of different objects like 
VimInstaces, Network Service Descriptors/Records and Virtual Network Function Descriptos/Records in the OpenBaton environment.


## Overview
The index page is an overview of the state of NFVO 
 
 1. Number of Network Service Records
 2. Number of Virtual Network Functions
 3. Number of Virtual Deployment Units
 4. Number of Network Service Descriptors

![Overview][overview.png]


## Manage PoPs
In this page you can see the list of Vim Instances registered

![List of Vim Instances][vimpage.png]

For registering a new Vim Instance you should click the button on the top-right side **Register Vim** of this page and choose your json to register a Vim Instance

![Register a new Vim Instances][registeraNewVim.png]

If you want to delete one Vim Instance you can click the button **Action** and than **Delete** in the menu

## Network Service Descriptors
In the menu on the left side under the voice Catalogue you can find **NS Decriptors**
In this page you can see the list of NS Descriptors stored into OpenBaton

![List of NS Descriptors][NSDlist.png]


For storing a NS Descriptor you have 2 options:

1. Create NSD Form
2. Create NSD File


Create a NSD using a File

![NSD create by File][NSDcreateFile.png]


Create a NSD using Form

![NSD create by Form][NSDcreateForm.png]

### Network Service Descriptor Information
In the list of Network Service Descriptors if you click on the id in the table you can see the information
 into Network Service Descriptor selected by id and will be shown this page

![Network Service Descriptor Information][VNFDlistintoNSD.png]

In the list of VNFD if you click the *Action* button you can delete the VNFD from NSD
and the information about the *Dependencies* into Network Service Descriptor

![Network Service Descriptor Dependencies Information][VNFDlistintoNSD1.png ]

In the list of VNFDependencies if you click the *Action* button you can delete the VNFDependency from NSD

### Network Service Descriptor Information
In the list of Network Service Descriptors if you click on the id in the table you can see the information
 into Network Service Descriptor selected by id and will be shown this page

![VNF Descriptor Information][VNFDescriptorInformation.png ]

In this page you can see the JSON file of the NSD just clicking on the link **Show JSON**

![JSON of Network Service Descriptor][JSONofNSR.png]

In the page **Network Service Descriptor Information** you can see the **Graphical view** of Network Service Descriptor 
just clicking the link *Show Graph*

![NSD Graph][NSDgraph.png ]


#### Virtual Network Function Descriptor Information
In the list of Virtual Network Function Descriptor into NSD if you click on the id of Virtual Network Function Descriptor will be shown this page

![VNF Descriptor Information][VNFDescriptorInformation.png ]

In the bottom side of the page you can see the Virtual Deployment Unit (VDU) tab and if you click the **id** of the 
VDU you can see the details of VDU like in this page

![VDU Information][VDUInformation.png ]

## Network Service Records 

  In the menu of the left side if you click on the **Orchestrator NS** and than **NS Records** you will see the list of *Network Service Records*
  Like in this screenshot 

![Network Service Records List ][NetworkServiceRecordsList.png]

In this page you can see the details of a Network Service Record just click the id and will be show this page

![Network Service Records Info ][NSRinfo.png]

In this page you can see the JSON file of the NSR just clicking on the link **Show JSON** and also the **Graphical view** 
of Network Service Record just clicking the link **Show Graph**
In the table of VNF Records you can delete one VNFR just clicking **Delete** in the menu **Action**
For seeing the details of VNFR just click on the **id** of a VNFR and will be shown this page

![VNF Record Information][VNFRecordInformation.png]


[overview.png]:nfvo-how-to-use-gui-images/overview.png
[vimpage.png]:nfvo-how-to-use-gui-images/vimpage.png
[registeraNewVim.png]:nfvo-how-to-use-gui-images/registeraNewVim.png
[NSDlist.png]:nfvo-how-to-use-gui-images/NSDlist.png
[NSDcreateFile.png]:nfvo-how-to-use-gui-images/NSDcreateFile.png
[NSDcreateForm.png]:nfvo-how-to-use-gui-images/NSDcreateForm.png
[VNFDlistintoNSD.png]:nfvo-how-to-use-gui-images/VNFDlistintoNSD.png
[VNFDlistintoNSD1.png]:nfvo-how-to-use-gui-images/VNFDlistintoNSD1.png
[VNFDescriptorInformation.png]:nfvo-how-to-use-gui-images/VNFDescriptorInformation.png
[JSONofNSR.png]:nfvo-how-to-use-gui-images/JSONofNSR.png
[NSDgraph.png]:nfvo-how-to-use-gui-images/NSDgraph.png
[VNFDescriptorInformation.png]:nfvo-how-to-use-gui-images/VNFDescriptorInformation.png
[VDUInformation.png]:nfvo-how-to-use-gui-images/VDUInformation.png
[NetworkServiceRecordsList.png]:nfvo-how-to-use-gui-images/NetworkServiceRecordsList.png
[NSRinfo.png]:nfvo-how-to-use-gui-images/NSRinfo.png
[VNFRecordInformation.png]:nfvo-how-to-use-gui-images/VNFRecordInformation.png