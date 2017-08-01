# VNF Package

This page describes essential components of a VNF Package, how to create them and how to use them after onboarding.
Therefore, you can find a practical tutorial at the end with all the steps starting from the creation over onboarding and finally referencing it in an NSD.

The NFVO supports two different formats for VNF Packages:  

* TAR archive following the ETSI NFV specification for VNF Descriptors and Packages
* CSAR archive following the [Tosca simple profile for NFV][tosca-nfv] specification.

This page provides more information about the first option, while more information about the second option are given in this [tutorial][csar-onboarding].

# Overview

A VNF Package is a tar-archive containing all the information required for managing the lifecycle of a VNF. First step is to build the archive which then can be onboarded to the NFVO.
A typical VNF Package includes

* VNF Descriptor: containing all the information required by the NFVO for deploying the VNF (more information available at the [VNF Descriptor page][vnfd-link]).
* Image: passed using a link to an image file (typically QCOW) available for being dowloaded via HTTP. At the moment, passing an image file inside the VNF Package is not supported: there is some work in progress to allow it.
* Metadata file providing additional information to the NFVO for understanding what's the content of the package.
* scripts: containing all the scripts which could be used for lifecycle management.

A typical VNF Package has the following structure:

```bash
- Metadata.yaml
- vnfd.json
- scripts/
    - 1_script.sh
    - 2_script.sh
```

## Metadata.yaml
The Metadata.yaml defines essential properties for the VNF. This file is based on the YAML syntax where information are stored in simple <key\> : <value\> associations.

The example of the Metadata file below shows a basic definition of a VNF Package.

```yaml
name: VNF_package_name
scripts-link: scripts_link
vim_types: list_of_vim_types
description: description_of_VNF
provider: provider_of_package
nfvo_version: target_NFVO_version
image:
    upload: option
    ids: list_of_ids
    names: list_of_names
    link: image_link
image-config:
    name: image_name
    diskFormat: disk_format
    containerFormat: container_format
    minCPU: min_cpu
    minDisk: min_disk
    minRam: min_ram
    isPublic: is_public
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
* ***image***:
    * ***upload***: Here you can choose between different options (true, false, check).
        * true: choosing this option means to upload the defined image on all the VimInstances. It does not matter if an image with the defined name exists or not.
        * false: choosing this option means that you assume that the image is already present on the VimInstaces and should be re-uploaded.
        If the image does not exist, the VNF Package onboarding will throw an exception.
        In this case the image (if defined) will be ignored.
        * check: this option means that the VNF PackageManagement checks first if the image is available (defined in ids or names).
        If the image does not exist, a new one with the image defined in the VNF Package will be created.
        * **Note** Please use quotation marks for this option since the values are handled as strings internally.
        Otherwise true and false will be handled as a boolean that would lead to a faulty behavior when onboarding a new VNF Package.
    * ***ids***: The list of image IDs is used to fetch the image from the corresponding VimInstance.
        To do it, the specific VIM driver iterates over all IDs and checks if an image with that ID exists on the VimInstance.
        The defined IDs have a higher priority than the list of names.
        We distinguish between the following cases:
        * If it finds no image with these IDs, it continues with the list of image names.
        * If it finds one image with these IDs, this image will be used.
        * If it finds multiple images with the same ID (should never happen) or multiple IDs matching to multiple images, an exception will be thrown because it is not clear which image to use.
    * ***names***: The list of image names is used to fetch the image from the corresponding VimInstance.
        To do it, manager iterates over all names and checks if an image with that name exists on the VimInstance.
        The list of names have a lower priority than the list of IDs.
        We distinguish between the following cases:
        * If it finds no image with that name, an exception will be thrown except you defined the upload option check.
        Then it will create a new image defined in the VNF Package.
        * If it finds one image, this image will be used.
        * If it finds multiple images with the same name or multiple names matching to multiple images, an exception will be thrown because it is not clear which image to use.
    * ***link***: This link points to a URL providing the image file available for being uploaded on the VIM.
        * **Note** If you want to upload a new Image to the VIM you need to specify `true` or `check` in the `upload` option.
            Otherwise a NotFoundException will be thrown and the VNF Package will not be onboarded.
* ***image-config***: All the properties explained below are required to upload the image to the VIM properly.
    In case of creating a new image this configuration will be used and is obviously mandatory.
    * ***name***: This defines the name for the image to upload either located directly in the VNF Package or available via the URL defined in image-link.
    * ***diskFormat***: The diskFormat defines the format in which disk type the image is stored.
    * ***containerFormat***: The containerFormat defines the format in which container type the image is stored .
    * ***minCPU***: The minCPU defines the minimum amount of CPU cores for using this image properly.
    * ***minDisk***: The minDisk defines the minimum amount of disk space for using this image properly.
    * ***minRam***: The minRam defines the minimum amount of RAM for using this image properly.
    * ***isPublic***: The isPublic defines whether the image will be available publicly to all tenants on VIM or not.

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

# Sample tutorial

This section provides an example about how to create, upload and make use of VNF Packages.
The chosen scenario is a Network Service for testing the network connectivity by using [iPerf][iperf-link].
iPerf is a tool for active measurements of the maximum achievable bandwidth on IP networks.
Therefore, we need a server and a client installing the iPerf server/client and configuring them for communication between.

## Creation of VNF Packages
For doing so, we need to create two VNF Packages and reference them in the NSD.
So we need a VNF Package for the iperf server (called iperf-server) and for the iperf client (called iperf-client).
First we will start with the creation of the iperf-server VNF Package and then we will create the iperf-client VNF Package.

First of all we should create a directory for each VNF Package where we put all the files related to the VNF Package because in the end we need to pack them into a tar archive for onboarding it on the NFVO.

### VNF Package [iperf-server]
This iperf-server VNF Package has to install the iperf server and needs to provide its ip to the iperf client.

#### Metadata [iperf-server]
In the Metadata.yaml we define the name of the VNF Package, the scripts location and also the properties for the image to use or upload.
Since passing an image is not supported in the current release we will use the image link inside the `Metadata.yaml`.
Finally, it looks as shown below.
```yaml
name: iperf-server
description: iPerf server
provider: FOKUS
scripts-link: https://script-link-to-git.git
nfvo_version: 4.0.0
vim_types:
 - openstack
image:
    upload: "check"
    names:
        - iperf_server_image
    link: "http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img"
image-config:
    name: iperf_server_image
    diskFormat: QCOW2
    containerFormat: BARE
    minCPU: 2
    minDisk: 5
    minRam: 2048
    isPublic: false
vim_types:
    - openstack
```

#### VNFD [iperf-server]
This is how the [VNFD](vnf-descriptor) looks like for the iperf-server VNF Package.
Important to notice here is that the vm_image defined in the Metadata.yaml is filled automatically during the onboarding process of the VNF Package.

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
      "vm_image":[
      ],
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
  "endpoint":"generic",
  "vnfPackageLocation":"https://github.com/openbaton/vnf-scripts.git"
}
```
#### Image

The image we have to choose must be a debian 64bit image (e.g. ubuntu amd64) for satisfying the EMS and scripts which are designed for that kind of image.
We have chosen this one [trusty-server-cloudimg-amd64-disk1.img][image-link].

### VNF Package [iperf-client]

This iperf-client VNF Package has to install the iPerf client and needs to be configured in order to know the iPerf servers' IP.

#### Metadata [iperf-client]
In the Metadata.yaml we define the name of the VNF Package, the scripts location and also the properties for the image to upload.
Since passing an image is not supported in the current release we will use the image link inside the `Metadata.yaml`.
Finally, it looks as shown below.

```yaml
name: iperf-client
description: iPerf client
provider: FOKUS
nfvo_version: 4.0.0
vim_types:
 - openstack
scripts-link: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
image:
    upload: "check"
    names:
        - iperf_client_image
    link: "http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img"
image-config:
    name: iperf_client_image
    diskFormat: QCOW2
    containerFormat: BARE
    minCPU: 2
    minDisk: 5
    minRam: 2048
    isPublic: false
vim_types:
    - openstack
```

#### VNFD [iperf-client]

This is how the [VNFD](vnf-descriptor) looks like for the iperf-client VNF Package.
Important to notice here is that the vm_image defined in the Metadata.yaml is filled automatically during the onboarding process of the VNF Package.

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
      "vm_image":[
        ""
      ],
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
  "type":"client",
  "endpoint":"generic",
  "vnfPackageLocation":"https://github.com/openbaton/vnf-scripts.git"
}
```

#### Image

The image we have to choose must be a debian 64bit image (e.g. ubuntu amd64) for satisfying the EMS and scripts which are designed for that kind of architecture.
We have chosen this one [trusty-server-cloudimg-amd64-disk1.img][image-link].

## Onboarding VNF Packages

Once we have finalized the creation of VNF Packages and packed them into a tar we can onboard them to the NFVO. Make sure that you also uploaded a VimInstance before onboarding the package. Onboarding can be done easily via the [Dashboard][dashboard-link] or the [Command Line Interface][cli].


## NSD [iperf]
In this section we will create a [NSD](ns-descriptor) and reference the previously created VNF Packages by their IDs.
For doing that we just need to define the **id** for each VNFPackges' VNFD in the list of VNFDs.
To provide also the iperf-servers' IP to the iperf-client we need to define dependencies you can find under the key **vnf_dependency** setting the source to **iperf-server** and the target to **iperf-client** by providing the parameter **private** that indicates the private IP address of the iPerf server in the network "private".

**Note** When creating the NSD the VNFD is fetched by the ID defined. Other properties we would set in the VNFD in this NSD will be ignored.

```json
{
	"name":"iperf",
    "vendor":"fokus",
    "version":"0.1-ALPHA",
    "vnfd":[
        {
            "id":"29d918b9-6245-4dc4-abc6-b7dd6e84f2c1"
        },
        {
            "id":"87820607-4048-4fad-b02b-dbcab8bb5c1c"
        }
    ],
    "vld":[
        {
            "name":"private"
        }
    ],
    "vnf_dependency":[
        {
            "source" : {
                "name": "iperf-server"
            },
            "target":{
                "name": "iperf-client"
            },
            "parameters":[
                "private"
            ]
        }
    ]
}
```

Finally you can onboard this NSD and deploy an NSR that bases on both VNF Packages created before.

### Onboarding and deploying NSD

You could also use the [Dashboard][dashboard-link] or the [Command Line Interface][cli] as well for onboarding and deploying the NSD.


[iperf-link]:https://iperf.fr/
[dashboard-link]:nfvo-how-to-use-gui
[vnfd-link]:vnf-descriptor
[image-link]:http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img
[tosca-nfv]:https://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[csar-onboarding]:tosca-CSAR-onboarding
[cli]:nfvo-how-to-use-cli
[vim-driver]:vim-driver

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
