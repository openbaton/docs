# OpenBaton Command Line Interface (CLI)

The Openbaton Client project provides a command-line interface, which enables you to use the NFVO's API and send commands to it. 

## Install the Openbaton Client
Git clone the project. Navigate into the root directory of the project and execute *./gradlew build*.

```sh
git clone https://github.com/openbaton/openbaton-client.git
cd openbaton-client
./gradlew build
```

### Set the required environment variables
Navigate into the project's root directory and execute *source nfvo.properties*. A dialog appears and will ask you for some properties. 

```sh
cd openbaton-client
source nfvo.properties
```


## Openbaton Client usage

After you typed in all the required properties you can start using the cli for sending commands to the NFVO. 
    
### Run a command: 
```sh
### openbaton.sh command-name [arg-1] [arg-2] [arg-3]
```

### Show the configuration: 
```sh
openbaton.sh -c
```

### Activate debug mode: 
```sh
openbaton.sh -d command-name [arg-1] [arg-2] [arg-3]
``` 

### Print help: 
```sh
openbaton.sh -h
```

### Print help for a command: 
```sh
openbaton.sh command-name help
```
    
### List the available commands: 
```sh
openbaton.sh -l
```

### For help on a specific openbaton command, enter:
```sh
 $ openbaton.sh COMMAND help
```

## Available commands

In the following section we list all the currently avalilable commands for the cli grouped by the components they work with. 

### **Vim Instance Subcommands**
**create**

  * Create a Vim Instance 
```sh
 $ openbaton.sh VimInstance-create file.json
```

**delete**

  * Delete the Vim Instance with the specified id
```sh
 $ openbaton.sh VimInstance-delete id-vim-instance
```

**update**

  * Update a Vim Instance by passing a file containing the new one and the id of the old one
```sh
 $ openbaton.sh VimInstance-update file.json id-vim-instance
```

**findAll**
 
  * Find all Vim Instances
```sh
 $ openbaton.sh VimInstance-findAll
```

**findById**
 
  * Find a Vim Instance specified by the id
```sh
 $ openbaton.sh VimInstance-findById id-vim-instance
```

### **Network Service Descriptor Subcommands**
**create**
 
  * Create a Network Service Descriptor
```sh
 $ openbaton.sh NetworkServiceDescriptor-create file.json
```

**delete**
 
  * Delete a Network Service Descriptor passing its id
```sh
 $ openbaton.sh NetworkServiceDescriptor-delete id-network-service-descriptor
```

**findAll**
 
  * Find all Network Service Descriptors
```sh
 $ openbaton.sh NetworkServiceDescriptor-findAll
```

**findById**
 
  * Find a Network Service Descriptor by passing its id
```sh
 $ openbaton.sh NetworkServiceDescriptor-findById id-network-service-descriptor
```

**createVNFDependency**

  * Create a Virtual Network Function Descriptor dependency for a Network Service Descriptor with a specific id
```sh
 $ openbaton.sh NetworkServiceDescriptor-createVNFDependency id-network-service-descriptor file.json
```

The file should look similar to this:

```json
{
 "parameters":["theParameter"], 
 "version":1, 
 "source":{"id":"950811b6-ebb6-4a17-bf4e-ab61974acbc8"}, 
 "target": {"id":"9873ad54-2963-424d-ab5d-39403a5dd544"}
}
```

The ids belong to the particular VirtualNettworkFunctionDescriptor.

**deleteVNFDependency**

  * Delete the Virtual Network Function Descriptor dependency of a Network Service Descriptor with a specific id
```sh
   $ openbaton.sh NetworkServiceDescriptor-deleteVNFDependency id-network-service-descriptor id-vnfdependency
```

**getVNFDependencies**

  * Get all the Virtual Network Function Descriptor Dependencies of a Network Service Descriptor with a specific id
```sh
 $ openbaton.sh NetworkServiceDescriptor-getVNFDependencies id-network-service-descriptor
```

**getVNFDependency**

  * Get the VirtualNetwork Function Descriptor Dependency with a specific id of a Network Service Descriptor with a specific id
```sh
 $ openbaton.sh NetworkServiceDescriptor-getVNFDependency id-network-service-descriptor id-vnfdependency
```

  
**getVirtualNetworkFunctionDescriptors**
 
  * Find all Virtual Network Function Descriptors
```sh
 $ openbaton.sh NetworkServiceDescriptor-getVirtualNetworkFunctionDescriptors id-network-service-descriptor
```

**getVirtualNetworkFunctionDescriptor**
 
  * Find a Virtual Network Function Descriptor specified by its id
```sh
$ openbaton.sh NetworkServiceDescriptor-getVirtualNetworkFunctionDescriptor id-network-service-descriptor id-vnfd
```

### **Virtual Network Function Descriptor Subcommands**
* **create**
  * Create a Virtual Network Function Descriptor
```sh
 $ openbaton.sh VirtualNetworkFunctionDescriptor-create file.json
```

* **delete**
  * Delete a Virtual Network Function Descriptor passing its id
```sh
 $ openbaton.sh VirtualNetworkFunctionDescriptor-delete id-virtual-network-function-descriptor
```

* **findAll**
  * Find all Virtual Network Function Descriptors
```sh
 $ openbaton.sh VirtualNetworkFunctionDescriptor-findAll
```

* **findById**
  * Find a Virtual Network Function Descriptor by passing its id
```sh
 $ openbaton.sh VirtualNetworkFunctionDescriptor-findById id-virtual-network-function-descriptor
```

### **Network Service Record Subcommands**
**create**
 
  * Create a Network Service Record from a file
```sh
 $ openbaton.sh NetworkServiceRecord-create file.json
```

**create**
 
  * Create a Network Service Record from a Network Service Descriptor stored in the orchestrator
```sh
 $ openbaton.sh NetworkServiceRecord-create id-network-service-descriptor
```

**delete**

  * Delete a Network Service Record passing its id
```sh
 $ openbaton.sh NetworkServiceRecord-delete id-network-service-record
```

**update**

  * Update the Network Service Record by passing a file with the new version of it and the id of the Network Service Record to update
```sh
$ openbaton.sh NetworkServiceRecord-update file.json id-network-service-record 
```

**findAll**

  * Find all Network Service Records
```sh
 $ openbaton.sh NetworkServiceRecord-findAll 
```

**findById**

  * Find a Network Service Record by passing its id
```sh
 $ openbaton.sh NetworkServiceRecord-findById id-network-service-record
```

**getVirtualNetworkFunctionRecords**

  * Get all the Virtual Network Function Records of a Network Service Record with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-getVirtualNetworkFunctionRecords id-network-service-record
```

**getVirtualNetworkFunctionRecord**

  * Get the Virtual Network Function Record by providing its id of a Network Service Record with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-getVirtualNetworkFunctionRecord id-network-service-record id-vnfr
```

**deleteVirtualNetworkFunctionRecord**

  * Delete the Virtual Network Function Record of a Network Service Record with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-deleteVirtualNetworkFunctionRecord id-network-service-record id-vnfr
```

* **createVNFDependency**

  * Create a Virtual Network Function Record Dependency of a NetworkServiceRecord with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-createVNFDependency id-network-service-record file.json
```
  
* **deleteVNFDependency**

  * Delete the Virtual Network Function Record Dependency of a NetworkServiceRecord with a specific id
  ```sh
   $ openbaton.sh NetworkServiceRecord-deleteVNFDependency id-network-service-record id-vnfdependency
  ```
  
* **getVNFDependencies**

  * Get all the Virtual Network Function Record Dependencies of a Network Service Record with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-getVNFDependencies id-network-service-record
```
  
* **getVNFDependency**

  * Get the Virtual Network Function Record Dependency of a Network Service Record with a specific id
```sh
 $ openbaton.sh NetworkServiceRecord-getVNFDependency id-network-service-record id-vnfdependency
```

**createVNFCInstance**

  * Perform a SCALE_OUT operation on a Virtual Network Function by adding a VNFCInstance to its Virtual Network Function Record
```sh
$ openbaton.sh NetworkServiceRecord-createVNFCInstance id-network-service-record id-virtual-network-function-record file.json
```

**deleteVNFCInstance**

  * Perform a SCALE_IN operation on a Virtual Network Function by deleting a VNFCInstance from the Virtual Network Function Record
```sh
$ openbaton.sh NetworkServiceRecord-deleteVNFCInstance id-network-service-record id-virtual-network-function-record
```


### **Event Subcommands**
**create**

  * Create an Event
```sh
 $ openbaton.sh Event-create file.json
```

**delete**

  * Delete an Event passing its id
```sh
$ openbaton.sh Event-delete id-event
```

**findAll**

  * Find all Events
```sh
$ openbaton.sh Event-findAll
```

**findById**

  * Find an Event by passing its id
```sh
$ openbaton.sh Event-findById id-event
```

### **Configuration Subcommands**
**create**

  * Create a Configuration
```sh
$ openbaton.sh Configuration-create file.json
```

**delete**

  * Delete a Configuration passing its id
```sh
 $ openbaton.sh Configuration-delete id-configuration
```

**findAll**

  * Find all Configurations
```sh
 $ openbaton.sh Configuration-findAll
```

**findById**

  * Find a Configuration by passint its id
```sh
 $ openbaton.sh Configuration-findById id-configuration
```

### **Image Subcommands**
**create**

  * Create an Image
```sh
 $ openbaton.sh Image-create file.json
```

**delete**

  * Delete an Image passing its id
```sh
$ openbaton.sh Image-delete id-image
```

**findAll**

  * Find all Images
```sh
 $ openbaton.sh Image-findAll
```

**findById**

  * Find an Image by passing its id
```sh
 $ openbaton.sh Image-findById id-image 
```

### **VirtualLink Subcommands**
**create**

  * Create a Virtual Link
```sh
 $ openbaton.sh VirtualLink-create file.json 
```

**delete**

  * Delete a Virtual Link by passing its id
```sh
 $ openbaton.sh VirtualLink-delete id-virtual-link 
```

**update**

  * Update a Virtual Link passing the new object and the id of the old Virtual Link
```sh
 $ openbaton.sh VirtualLink-update file.json id-virtual-link
```

**findAll**

  * Find all Virtual Links
```sh
 $ openbaton.sh VirtualLink-findAll
```

**findById**

  * Find a Virtual Link by passing its id
```sh
 $ openbaton.sh VirtualLink-findById id-virtual-link
```

### **VNFPackage Subcommands**
**create**

  * Create a VNFPackage by uploading a tar file to the NFVO
```sh
 $ openbaton.sh VNFPackage-upload file.tar 
```

**delete**

  * Delete a VNFPackage by passing its id
```sh
 $ openbaton.sh VNFPackage-delete id-vnfPackage 
```

**findAll**

  * Find all VNFPackages
```sh
 $ openbaton.sh VNFPackage-findAll
```

**findById**

  * Find a VNFPackage by passing its id
```sh
 $ openbaton.sh VNFPackage-findById id-vnfPackage
```
    
[overview]:images/nfvo-how-to-use-gui-overview.png
[vimpage]:images/nfvo-how-to-use-gui-vim-page.png
[registeraNewVim]:images/vim-instance-register-new-pop.png


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
