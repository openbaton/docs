# OpenBaton Dashboard
The Dashboard of OpenBaton helps you managing the lifecycle of different objects like 
Vim Instaces, Network Service Descriptors/Records and Virtual Network Function Descriptors/Records in the OpenBaton environment.


## Login

The first page that you will see after typing *http://url-to-nfvo:8080* or *https://url-to-nfvo:8443* (depends whether SSL is enabled or not) into your browser is the following login form.

![Login][login]

The default user is called *admin* and has the password *openbaton*. 

## Overview
The index page shows an overview of the state of the NFVO 
 
 1. Number of Network Service Records
 2. Number of Virtual Network Functions
 3. Number of Network Service Descriptors
 4. Number of SSH Keys
 
 It also shows the summary of the available resources, like floating ips, instances, RAM and CPU cores. The data is collected from the available PoPs if possible and then the summary is displayed. Test POPs do not grant any resources. The quota information is backed up in cache to avoid unnecessary traffic. You can refresh the data by going into the drop down menu (upper right corner) and choosing refresh quota option. You can now also see the NFVO version on the header panel. 

![Overview][overview]

## Security
The NFVO uses projects and users with assigned roles so that multiple selected users can work in the same project environment.  
The parts of the GUI to manage users and projects are marked red in the following screenshot. 

![Security overview][SecurityOverview]

In the upper right corner you can see the current project in which you are working next to the folder label.  
Click on it to switch to other projects you have access to.  
Next to this you can see your user name. Click on it to extend a menu with the logout button. 
You can also change the password by choosing the command in this menu or use the *Help* button to open the documentation. 

If you select *Identity* tab, you can add and change projects and users. *Identity tab* is available only to the users with admin privileges. 

The following screenshot shows the creation of a new user named *new user* who is assigned to the project *default* as a *USER*. This means that he can modify the resources in this project. The role *GUEST* would basically grant the read-only privilege to the user. If you would like the user to have access to all the projects and resources of the NFVO, you can put a mark to on the *Make Admin* marker, if the marker is turned on the individual roles you choose will not matter any more and the user will be saved as an *ADMIN*. 

![Add user][AddUser]

The NFVO also supports SSL. If SSL is enabled you have to use *https://url-to-nfvo:8443* to access the GUI. 

## Vim Driver Installation
If you are admin you call also use vim-drivers menu to download the drivers from marketplace and install and start them. You also have an access to the information about the drivers that are already installed. 

## Manage PoPs
On this page you can see the list of PoPs registered

![List of Vim Instances][vimpage]

For registering a new Point-of-Presence you can click on the button in the top-right corner **Register a new PoP** of this page. In the new window you have two ways to register a new PoP. First is to fill out the form with all the data needed to register the PoP. You can choose the type of PoP from the drivers that you currently have installed (test, openstack, etc).
![Register a new Vim Instances][registeraNewVim]

You can copy json with the data or provide a file.

![Register PoP form][registeraNewVimfile]

If you want to delete a Vim Instance you can click on the button **Action** and then **Delete** in the menu

## Catalogue

In the menu on the left side under the template _Catalogue_ you can manage 

1. NS Descriptors
2. VNF Descriptors
3. VNF Managers
4. VNF Packages
5. Key Pairs
6. Marketplace

### Marketplace

With the opening of the Openbaton Marketplace, it became possbile to download VNFPackages and NSDs directly into the NFVO, for this, 
go to Marketplace tab and browse the available packages. You can click download button to download and onboard it. If you download NSD, the packages will be downloaded and onboarded automatically. You can find more about marketplace  out at the pages dedicated to it. 

### Key Pairs
You can add a key pairs to use for ssh access to the VMs via *Key Pairs* menu. You have two options in terms of adding the keys. 
 You can promt NFVO to create a key for you with a given name:
![Create key][createkey]
*IMPORTANT*: You will be promted to download the private key after you press *Generate*. Currently there is no option to regenerate a key. If you do not download the key, you will have to generate a new one. 

 You can import key for your host user via providing your public key to the NFVO:
![Import key][importkey]


### Network Service Descriptors
In the menu on the left side under the template Catalogue you can find the **NS Decriptors** button.
On this page you can see the list of NS Descriptors stored in OpenBaton

![List of NS Descriptors][NSDlist]
#### Launching the NSD

In order to launch NSD press the *Action* near the NSD you want to lauch and press *launch*. You will be promted with a dialogue that will let you choose the key name for the NSR. You have 2 options in this case:

 1. Pick key that you have added to the NFVO or created with it, you can pick multiple keys too, and press *Launch* to use these keys later to access the VMs. You can also create or import key from here if you want 
 
 2. You can now also pick PoP for VNFDs that you have in your NSD. 

![NSD Launch][launchNSD1]
![NSD Launch][launchNSD2]
#### Storing NSD
You have three options for storing a NS Descriptor:

1. Create a NSD by using the VNFDs from the Packages
2. Create a NSD by using a json file
3. If you are using TOSCA NSD you can choose  "upload CSAR" and upload it via drag and drop.


Upload a json-file that contains the NSD

![NSD create by File][NSDcreateFile]


Create a NSD by using the VNFD from the Packages, just click on the button "Create NSD".
This is the form which allows you to choose the VNFDs to be used in the NSD come from the Catalogue (and contained inside the VNFPackages)

![NSD create by VNFDs][NSDcreateSelect]

In the picture below you can see how to add a VNF Dependency to the NSD and possible parameters by clicking on *Add new dependency*

![Add VNF Dependency NSD][NSDcreateDependency]

### Network Service Descriptor Information
If you click on the id of a NSD shown in the list of NSDs you can see the information
stored in this Network Service Descriptor.

![Network Service Descriptor Information][VNFDescriptorInformation]

You can observe the NSD in json format by clicking on the **Show JSON** button

![JSON of Network Service Descriptor][JSONofNSR]

If you click on the *Action* button in the list of VNFDs you can delete the VNFD from the NSD
and the information about the *Dependencies* stored in the Network Service Descriptor

![Network Service Descriptor Dependencies Information][VNFDlistintoNSD1]

If you click on the **Action** button in the list of VNFDependencies you can delete the VNFDependency from the NSD

#### Edit a Network Service Descriptor

If you want to Edit the NSD just click on the **Edit** button under the button **Action** in the list of NSD

![NSD Edit][editNSD1]

The same for the VNF inside the NSD

![NSD Graph][editNSD2]



And the same for the VDU inside the VNF




#### Virtual Network Function Descriptor Information
In the list of Virtual Network Function Descriptors in NSD template you can click on the id of a Virtual Network Function Descriptor to get to this page

![VNF Descriptor Information][VNFDescriptorInformation]

At the bottom of the page you can see the Virtual Deployment Unit (VDU) tab and if you click on the **id** of the 
VDU you can see the details of it. Here you can also start stop VNFC Instances with button. 

![VDU Information][VDUInformation]

### VNF Packages
On this page you can upload the **VNF Package**. For more information about the VNF Package please read the [VNF Package documentation] 
For uploading a _.tar_ you can click on the button **Upload VNFPackage** and this window will be shown where you can drag & drop the file or just click on the white area and choose your file using your file manager. You can also upload csar package instead of usual tar one, for this, just click on "Use CSAR parser" before sending the packages. 

![Drag&Drop modal][drag_drop]

After you click on the button **Upload All** the packages will be sent to the _NFVO_ and once the process is finished you will see the package appearing in the list




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

## Event
The Events are sent by the Orchestrator to the specific **EndPoint** where an external component is listening to be aware when the Orchestrator 
changes the STATE of a particular **virtualNetworkFunctionId** or **networkServiceId**

To add a new Event just click the button "Create event" and will be shown the form as follow:

![Event Form][EventForm]

For getting the information click on the id link of the Event

![Event List][EventList]

This are the information of the Event selected

![Event Info][EvenInfo]


[overview]:images/nfvo-how-to-use-gui-overview.png
[vimpage]:images/nfvo-how-to-use-gui-vim-page.png
[registeraNewVim]:images/vim-instance-register-new-pop.png
[registeraNewVimfile]:images/vim-instance-register-new-pop-file.png
[NSDlist]:images/nfvo-how-to-use-gui-NSDlist.png
[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[drag_drop1]:images/nfvo-how-to-use-gui-drag-drop1.png
[drag_drop2]:images/nfvo-how-to-use-gui-drag-drop2.png
[NSDcreateFile]:images/nfvo-how-to-use-gui-NSD-create-file.png
[NSDcreateForm]:images/nfvo-how-to-use-gui-NSD-create-form.png
[NSDcreateSelect]:images/form-create-NSD.png
[NSDcreateDependency]:images/form-add-dependecy-pkg.png
[EventForm]:images/event-form.png
[EventList]:images/event-list.png
[EvenInfo]:images/event-info.png
[editNSD1]:images/edit-NSD1.png
[editNSD2]:images/edit-NSD2.png
[editNSD3]:images/edit-NSD3.png
[editNSD4]:images/edit-NSD4.png
[editNSD5]:images/edit-NSD5.png
[SecurityOverview]:images/nfvo-how-to-use-gui-security-overview.png
[AddUser]:images/nfvo-how-to-use-gui-add-user.png
[Login]:images/login.png

[VNFDlistintoNSD]:images/nfvo-how-to-use-gui-VNFD-list-into-NSD.png
[VNFDlistintoNSD1]:images/nfvo-how-to-use-gui-VNFD-list-into-NSD.png
[VNFDescriptorInformation]:images/nfvo-how-to-use-gui-VNFD-information.png
[JSONofNSR]:images/nfvo-how-to-use-gui-JSON-of-NSR.png
[NSDgraph]:images/nfvo-how-to-use-gui-NSD-graph.png
[VNFDescriptorInformation]:images/nfvo-how-to-use-gui-VNFD-information.png
[VDUInformation]:images/nfvo-how-to-use-gui-VDU-information.png
[NetworkServiceRecordsList]:images/nfvo-how-to-use-gui-NSR-list.png
[NSRinfo]:images/nfvo-how-to-use-gui-NSR-info.png
[VNFRecordInformation]:images/nfvo-how-to-use-gui-VNFR-information.png
[createkey]:images/nfvo-how-to-use-gui-generate-key.png
[importkey]:images/nfvo-how-to-use-gui-import-key.png
[launchNSD1]:images/gui-launch-pop.png

[launchNSD2]:images/gui-launch-key.png
[VNF Package documentation]: vnf-package.md
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
