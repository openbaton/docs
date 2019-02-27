# VNF Package

This page describes essential components of a VNF Package, how to create them and how to use them after onboarding.
Therefore, you can find a practical tutorial at the end with all the steps starting from the creation over onboarding and finally referencing it in an NSD.

The NFVO supports two different formats for VNF Packages:  

* TAR archive following the ETSI NFV specification for VNF Descriptors and Packages
* CSAR archive following the [Tosca simple profile for NFV][tosca-nfv] specification.

This page provides more information about the first option, while more information about the second option are given in this [tutorial][csar-onboarding].

> ***Note:*** In case your scripts are available publicly on GitHub, you may not need the creation of a specific VNF package, but you can just refer to them in the Metadata.yaml as part of the
*scripts_link* parameter. In this case *VnfPackageLocation* in the VNFD must be null (not defined at all).

> ***Note:*** in case you are using the Docker VIM Driver and Docker VNFM the scripts folder is not considered, as the docker approach relies on docker images ready to be launched.

# Overview

A VNF Package is a tar-archive containing all the information required for managing the lifecycle of a VNF. First step is to build the archive which then can be onboarded to the NFVO.
A typical VNF Package includes

* VNF Descriptor: containing all the information required by the NFVO for deploying the VNF (more information available at the [VNF Descriptor page][vnfd-link]).
* Images: You can define images that shall be uploaded to the NFVO's [image repository] when onboarding the VNF Package. Images can be included as files inside the package or you can point to a URL from where they can be downloaded.
* Metadata file providing additional information to the NFVO for understanding what's the content of the package.
* scripts: containing all the scripts which could be used for lifecycle management.

A typical VNF Package has the following structure:

```bash
- Metadata.yaml
- vnfd.json
- scripts/
    - 1_script.sh
    - 2_script.sh
- images/
    - image_file1
    - image_file2
```

## Metadata.yaml
The Metadata.yaml defines essential properties for the VNF. This file is based on the YAML syntax where information are stored in simple <key\> : <value\> associations.

The example of the Metadata file below shows a basic definition of a VNF Package.

```yaml
name: VNF_package_name
description: description_of_VNF
provider: provider_of_package
vim_types: list_of_vim_types
nfvo_version: target_NFVO_version
scripts-link: scripts_link
images:
    xenial:
        url: https://cloud-images.ubuntu.com/xenial/current/xenial-server-cloudimg-amd64-disk1.img
        diskFormat: qcow2
        containerFormat: bare
        minCPU: 2
        minDisk: 2
        minRam: 2048
        isPublic: true
    bionic:
        diskFormat: qcow2
        containerFormat: bare
        minCPU: 2
        minDisk: 2
        minRam: 2048
```

In the following each property is explained in more detail. Please consider also the notes since some properties are optional (or even not implemented) and if they are defined, they may have more priority than others and override them therefore.

* ***name***: The name defines the name of the VNF Package itself used to store it in the database
* ***description***: Human readable description of the VNF
* ***provider***: The creator and maintainer of the VNF
* ***vim_types***: The list of the vim types that the VNF Package supports. VIM types are related to the plugin types installed on the NFVO. More info can be found [here][vim-driver].
* ***nfvo_version***: The version of the NFVO which supports this package in the format (X.Y.Z). First two digits (X.Y) will be used for checking whether the VNF Package is supported by the NFVO on top of which is going to be on-boarded
* ***scripts-link***: This link points to a public git repository where scripts are stored and could be used instead of passing all scripts inside the VNF Package
    * **Note** Either you can define the scripts-link or put the scripts into the folder scripts/.
        The scripts-link has a higher priority than the scripts located in the folder scripts/.
        So if you set the scripts-link, the scripts in folder scripts/ are completely ignored.
    * **Note** In most of the cases using script-link means that any component should be able to fetch files from that link.
        So you need to take care about ensuring that the URL defined is publicly available.
    * **Note** Scripts are executed during different lifecycle-events, and need to be referenced inside the VNF Descriptor
* ***images***: A list of images that are defined inside the package. Each image will be uploaded to the NFVO's [image repository] if it does not yet contain an image with the given name. Currently the images can only be used for OpenStack. The image names in the given example are *xenial* and *bionic*. The xenial image is specified via a public URL from which the image can be downloaded while the bionic image lacks a URL. If there is no URL then you have to include the image file in the package's *images* directory. The file name has to be aligned with the image name, in this case for instance the file name has to be *bionic* (not *bionic.img* etc.). Do not create subdirectories in the *images* directory.
    * ***url***: A URL from which the image file can be downloaded. If specified, possible matching image files inside the VNF Package are not considered anymore.
    * ***diskFormat***: The format of the disk image (e.g. qcow2, iso, raw, etc.).
    * ***containerFormat***: Indicates whether the file format contains metadata about the actual virtual machine (use *bare* if you are unsure about this).
    * ***minCPU***: Defines the minimum amount of CPU cores required for using this image properly.
    * ***minDisk***: Defines the minimum amount of disk space (in GB) required for using this image properly.
    * ***minRam***: Defines the minimum amount of RAM (in MB) required for using this image properly.
    * ***isPublic***: Defines whether the image will be available publicly to all tenants on the OpenStack VIM or not (default is false).


## <VNFD\>.json

The <vnfd\>.json contains the VirtualNetworkFunctionDescriptor (VNFD) onboarded to the Orchestrator.
This VNFD can later be referenced in a NSD by its ID to make use of it.
A more detailed explanation of the VNFD can be found [here][vnfd-link].

**Note** You can specify any names for the file, but its extension must be `.json`.

## scripts

The scripts folder contains all the scripts required for instatiating, configuring, and starting a VNF on the Virtual Machines or containers instantiated during the lifecycle.
The execution order is defined by the lifecycle_events inside the VNFD. Please refer to the [VNF Description page][vnfd-link] for more information about this.

**Note** The scripts in the folder ***scripts*** are fetched only if the ***scripts-link*** is not defined in the ***Metadata.yaml***.
    This means that the scripts in that folder have less priority than the scripts located under ***scripts-link***.

**Note** Scripts are executed when a specific lifecycle event is fired and this event references to specific scripts.

**Note** At the moment the *scripts* folder cannot contain subfolder. All scripts must be under the _scripts_ folder.

**Note** The scripts inside the *scripts* folder can be either shell scripts or python scripts. Runtime parameters could be passed to those scritps in different ways, depending on the VNF Manager used for managing your VNFs. We suggest you get familiar with the requirements of the VNF Manager you would like to use, before starting implementing any scripts for lifecycle management.

## More on images
As you have seen in the example Metadata.yaml file above, it is possible to define images in the metadata of a VNF Package. You can specify the image via a URL or you can provide the image file directly inside the VNF Package. The images are uploaded to the NFVO's [image repository] when the VNF Package is onboarded. The images inside this image repository can be uploaded to an OpenStack VIM automatically if the image is not yet present on the VIM while launching a Network Service that requires the image. This feature makes it more convenient to write VNF Packages because you do not have to take care that the images used by a VNF Package are available in OpenStack, instead you simply include them in the package itself. If an image with the specified name is already existing inside the NFVO's image repository, then this image is **not** overwritten if you upload the VNF Package.

Of course you do not have to make use of this feature and you can upload VNF Packages without any image specified. But then you have to make sure that the image is present on the VIM when launching a Network Service that relies on that image.


# Sample tutorial

This section provides an example about how to create, upload and make use of VNF Packages.
The chosen scenario is a simple network service using [iPerf][iperf-link] in a server/client scenario. 
iPerf is a tool for active measurements of the maximum achievable bandwidth on IP networks. 
This tutorial is similar to the one already described in the [iperf tutorial][iperf], however making use of VNF packages instead of just the network service descriptor. 


## Creation of VNF Packages
For doing so, we need to create two VNF Packages and reference them in the NSD.
So we need a VNF Package for the iperf server (called iperf-server) and for the iperf client (called iperf-client).
First we will start with the creation of the iperf-server VNF Package and then we will create the iperf-client VNF Package.

First of all we should create a directory for each VNF Package where we put all the files related to the VNF Package because in the end we need to pack them into a tar archive for onboarding it on the NFVO. Each package will contain a *Metadata.yaml* and a *vnfd.json* file.

### VNF Package [iperf-server]
This iperf-server VNF Package has to install the iperf server and needs to provide its IP address to the iperf client.


#### Metadata [iperf-server]
In the Metadata.yaml file we define the name of the VNF Package, the scripts location and also the images that we want to upload to the [image repository] when onboarding the VNF Package.
Finally, it looks as shown below.
```yaml
name: iperf-server
description: iPerf server
provider: FOKUS
scripts-link: https://github.com/openbaton/vnf-scripts.git
nfvo_version: 6.1.0
vim_types:
    - openstack
images:
    trusty:
        url: http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img
        diskFormat: qcow2
        containerFormat: bare
        minCPU: 1
        minDisk: 2
        minRam: 2048
        
```
As you can see, the image that we want to upload to the NFVO image repository is called trusty and points to the URL from where it can be downloaded. If you want to use an image which is not publicly available for downloading, you might want to remove the *url* field, create a directory called *images* inside the VNF Package and add the desired image file to it. Make sure that the image file has exactly the same name as specified in the *Metadata.yaml* file (here this would be *trusty*).

If you do not want to upload any image to the NFVO's image repository, then simply remove the *images* section from the *Metadata.yaml* file. But make sure that the image is present on the VIM before deploying your Network Service.

#### VNFD [iperf-server]
This is how the [VNFD](vnf-descriptor) looks like for the iperf-server VNF Package.
> ***Note:*** If a VDU of the VNFD does **not** specify any images in the field *vm_image*, then this field is filled automatically with the images listed under the *images* section in Metadata.yaml when uploading the VNF Package. This way you do not have to alter both the VNFD file and the Metadata.yaml file if you want to change the used image.

```json
{
  "name":"iperf-server",
  "vendor":"FOKUS",
  "version":"1.0",
  "lifecycle_event":[
    {
      "event":"INSTANTIATE",
      "lifecycle_events":[
        "install.sh",
        "install-srv.sh"
      ]
    }
  ],
  "virtual_link":[
    {
      "name":"private"
    }
  ],
  "vdu":[
    {
      "vm_image":["trusty"],
      "scale_in_out":1,
      "vnfc":[
        {
          "connection_point":[
            {
              "virtual_link_reference":"private"
            }
          ]
        }
      ],
      "vimInstanceName":[]
    }
  ],
  "deployment_flavour":[
    {
      "flavour_key":"m1.small"
    }
  ],
  "type":"server",
  "endpoint":"generic"
}
```

### VNF Package [iperf-client]

This iperf-client VNF Package has to install the iPerf client and needs to be configured in order to know the iPerf servers' IP address.

#### Metadata [iperf-client]
The *Metadata.yaml* file looks nearly identical to its iperf-server counterpart.

```yaml
name: iperf-client
description: iPerf client
provider: FOKUS
nfvo_version: 6.1.0
scripts-link: https://github.com/openbaton/vnf-scripts.git
vim_types:
    - openstack
images:
    trusty:
        url: http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img
        diskFormat: qcow2
        containerFormat: bare
        minCPU: 1
        minDisk: 2
        minRam: 2048
```

#### VNFD [iperf-client]

This is how the [VNFD](vnf-descriptor) looks like for the iperf-client VNF Package.

```json
{
  "name":"iperf-client",
  "vendor":"FOKUS",
  "version":"1.0",
  "lifecycle_event":[
    {
      "event":"CONFIGURE",
      "lifecycle_events":[
        "server_configure.sh"
      ]
    },
    {
      "event":"INSTANTIATE",
      "lifecycle_events":[
        "install.sh"
      ]
    }
  ],
  "vdu":[
    {
      "vm_image":["trusty"],
      "scale_in_out":1,
      "vnfc":[
        {
          "connection_point":[
            {
              "virtual_link_reference":"private"
            }
          ]
        }
      ],
      "vimInstanceName":[]
    }
  ],
  "virtual_link":[
    {
      "name":"private"
    }
  ],
  "deployment_flavour":[
    {
      "flavour_key":"m1.small"
    }
  ],
  "requires": {
      "iperf-server": {
          "parameters":["private","hostname"]
        }
  },
  "type":"client",
  "endpoint":"generic"
}
```



[iperf-link]:https://iperf.fr/
[iperf]: iperf-NSR.md
[dashboard-link]:nfvo-how-to-use-gui
[vnfd-link]:vnf-descriptor
[image-link]:http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img
[tosca-nfv]:https://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[csar-onboarding]:tosca-CSAR-onboarding
[cli]:nfvo-how-to-use-cli
[vim-driver]:vim-driver
[image repository]:image-repository

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
