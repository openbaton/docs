# OpenBaton Dashboard
The Dashboard of OpenBaton helps you managing the lifecycle of different objects like 
VimInstaces, Network Service Descriptors/Records and Virtual Network Function Descriptors/Records in the OpenBaton environment.


## Overview
The index page shows an overview of the state of the NFVO 
 
 1. Number of Network Service Records
 2. Number of Virtual Network Functions
 3. Number of Virtual Deployment Units
 4. Number of Network Service Descriptors

![Overview][overview]


## Manage PoPs
On this page you can see the list of Vim Instances registered

![List of Vim Instances][vimpage]

For registering a new Vim Instance you should click on the button in the top-right corner **Register Vim** of this page and select your json to register a Vim Instance

![Register a new Vim Instances][registeraNewVim]

If you want to delete a Vim Instance you can click on the button **Action** and then **Delete** in the menu

## Catalogue
In the menu on the left side under the template _Catalogue_ you can manage 

1. NS Descriptors
2. VNF Packages

### Network Service Descriptors
In the menu on the left side under the template Catalogue you can find the **NS Decriptors** button.
On this page you can see the list of NS Descriptors stored in OpenBaton

![List of NS Descriptors][NSDlist]


You have two options for storing a NS Descriptor:

1. Create a NSD by filling in a form
2. Create a NSD by using a json file


Create a NSD by using a json file

![NSD create by File][NSDcreateFile]


Create a NSD by filling in a form

![NSD create by Form][NSDcreateForm]

### Network Service Descriptor Information
If you click on the id of a NSD shown in the list of NSDs you can see the information
stored in this Network Service Descriptor.

![Network Service Descriptor Information][VNFDescriptorInformation]

You can observe the NSD in json format by clicking on the **Show JSON** button

![JSON of Network Service Descriptor][JSONofNSR]

On the page **Network Service Descriptor Information** you can also look at the **Graphical view** of the Network Service Descriptor 
by clicking on *Show Graph*

![NSD Graph][NSDgraph]

If you click on the *Action* button in the list of VNFDs you can delete the VNFD from the NSD
and the information about the *Dependencies* stored in the Network Service Descriptor

![Network Service Descriptor Dependencies Information][VNFDlistintoNSD1]

If you click on the *Action* button in the list of VNFDependencies you can delete the VNFDependency from the NSD


#### Virtual Network Function Descriptor Information
In the list of Virtual Network Function Descriptors in NSD template you can click on the id of a Virtual Network Function Descriptor to get to this page

![VNF Descriptor Information][VNFDescriptorInformation]

At the bottom of the page you can see the Virtual Deployment Unit (VDU) tab and if you click on the **id** of the 
VDU you can see the details of it

![VDU Information][VDUInformation]

### VNF Packages
On this page you can upload the **VNF Package**. For more information about the VNF Package please read the [VNF Package documentation] 
For uploading a _.tar_ you can click on the button **Upload VNFPackage** and this window will be shown where you can drag & drop the file or just click on the white area and choose your file using your file manager

![Drag&Drop modal][drag_drop]

After you click on the button **Start** the package will be sent to the _NFVO_ and once the process is finished you will see the package appearing in the list

![Drag&Drop modal start][drag_drop1]

![Drag&Drop list][drag_drop2]

## Network Service Records 

In the menu on the left side if you click on the **Orchestrator NS** and then **NS Records** you will see the list of *Network Service Records*
Like in this screenshot 

![Network Service Records List ][NetworkServiceRecordsList]

On this page you can see the details of a Network Service Record by clicking on the id

![Network Service Records Info][NSRinfo]

On this page you can look at the JSON file of the NSR by clicking on the link **Show JSON** and also the **Graphical view**. 
of Network Service Record by clicking on the link **Show Graph**. 
In the table of VNF Records you can delete a VNFR by clicking on **Action** and then **Delete**. 
To look at the details of a VNFR just click on the **id** of it.

![VNF Record Information][VNFRecordInformation]


[overview]:images/nfvo-how-to-use-gui-overview.png
[vimpage]:images/nfvo-how-to-use-gui-vim-page.png
[registeraNewVim]:images/vim-instance-register-new-pop.png
[NSDlist]:images/nfvo-how-to-use-gui-NSDlist.png
[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[drag_drop1]:images/nfvo-how-to-use-gui-drag-drop1.png
[drag_drop2]:images/nfvo-how-to-use-gui-drag-drop2.png
[NSDcreateFile]:images/nfvo-how-to-use-gui-NSD-create-file.png
[NSDcreateForm]:images/nfvo-how-to-use-gui-NSD-create-form.png
[VNFDlistintoNSD]:images/nfvo-how-to-use-gui-VNFD-list-into-NSD.png
[VNFDlistintoNSD1]:images/nfvo-how-to-use-gui-VNFD-list-into-NSD1.png
[VNFDescriptorInformation]:images/nfvo-how-to-use-gui-VNFD-information.png
[JSONofNSR]:images/nfvo-how-to-use-gui-JSON-of-NSR.png
[NSDgraph]:images/nfvo-how-to-use-gui-NSD-graph.png
[VNFDescriptorInformation]:images/nfvo-how-to-use-gui-VNFD-information.png
[VDUInformation]:images/nfvo-how-to-use-gui-VDU-information.png
[NetworkServiceRecordsList]:images/nfvo-how-to-use-gui-NSR-list.png
[NSRinfo]:images/nfvo-how-to-use-gui-NSR-info.png
[VNFRecordInformation]:images/nfvo-how-to-use-gui-VNFR-information.png
[VNF Package documentation]: vnfpackage.md
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
