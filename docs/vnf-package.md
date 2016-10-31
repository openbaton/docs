# VNF Package

This doc describes essential components of a VNF Package, how to create them and how to use them after onboarding.
Therefore, you can find a practical tutorial at the end with all the steps starting from the creation over onboarding and finally referencing it by an NSD.

The NFVO can also work with CSAR as described in the [Tosca simple profile for NFV][tosca-nfv]. More information about building and deploying compliant CSARs in this [tutorial][csar-onboarding].

A VNF Package is a tar-archive that contains all the information required for creating a VNF for the Open Baton's NFVO.
After onboarding the VNF Package to the NFVO you can use the VNF directly in the NSD by referencing the VNFD by its ID.
A VNF Package includes the VNFD, the image, scripts and a Metadata file structured as shown in the next part.

# Package structure
The VNF Package has the following structure:

```bash
- Metadata.yaml
- vnfd.json
- scripts/
    - 1_script.sh
    - 2_script.sh
- image.img (not supported at the moment, use image-link!)
```
## Metadata.yaml
The Metadata.yaml defines essential properties for the VNF. This file is based on the YAML syntax where information are stored in simple <key\> : <value\> associations.

The example of the Metadata file below shows a basic definition of a VNF Package.

```yaml
name: VNF Package_name
scripts-link: scripts_link
vim_types: list_of_vim_types
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

In the following each property is explained in more detail. Please consider also the notes since some properties are optional (or even not implemented) and if they are defined, they may have more priority than other and override them therefore.

* ***name***: The name defines the name of the VNF Package itself used to store it in the database.
* ***vim_types***: The list of the vim types that the VNF Package supports.
* ***scripts-link***: This link points to a public git repository where scripts are stored that are needed to be executed for managing the lifecycle of the exposed VNF.
    * **Note** Either you can define the scripts-link or put the scripts into the folder scripts/.
        The scripts-link has a higher priority than the scripts located in the folder scripts/.
        So if you set the scripts-link, the scripts in folder scripts/ are ignored completely.
    * **Note** The scripts-link is processed by the Element Management System (EMS) in the meaning of fetching the files from that link.
        So you need to take care about ensuring that the URL defined is available.
    * **Note** Scripts are executed during different lifecycle-events.
* ***image***:
    * ***upload***: Here you can choose between different options (true, false, check).
        * true: choosing this option means to upload the defined image on all the VimInstances. It does not matter if an image with the defined name exists or not.
        * false: choosing this option means that you assume that the image (defined in the ids or names) is already present.
        If the image does not exist, the VNF Package onboarding will throw an exception.
        In this case the image (if defined) will be ignored.
        * check: this option means that the VNF PackageManagement checks first if the image is available (defined in ids or names).
        If the image does not exist, a new one with the image defined in the VNF Package will be created.
        * **Note** Please use quotation marks for this option since the values are handled as strings internally.
        Otherwise true and false will be handled as a boolean that would lead to a faulty behavior when onboarding a new VNF Package.
    * ***ids***: The list of image IDs is used to fetch the image from the corresponding VimInstance.
        To do it, the manager iterates over all IDs and checks if an image with that ID exists on the VimInstance.
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
    * ***link***: This link points to an image available at this URL used to upload the image to the cloud environment.
        * **Note** Either you have to define the image link or put the image directly into the VNF Package if you want to upload a new Image to the VIM by using image upload option `true` or `check`.
            Otherwise a NotFoundException will be thrown and the VNF Package will not be onboarded.
            The image-link has a higher priority than the image stored in the VNF Package directly.
        * ****Note**** At the moment it is only supported to upload an image by using the `link`. Image uploading from an image inside the package is disabled.
* ***image-config***: All the properties explained below are required to upload the image to the cloud environment properly.
    In case of creating a new image this configuration will be used and is obviously mandatory.
    * ***name***: This defines the name for the image to upload either located directly in the VNF Package or available via the URL defined in image-link.
    * ***diskFormat***: The diskFormat defines the format in which disk type the image is stored.
    * ***containerFormat***: The containerFormat defines the format in which container type the image is stored .
    * ***minCPU***: The minCPU defines the minimum amount of CPU cores for using this image properly.
    * ***minDisk***: The minDisk defines the minimum amount of disk space for using this image properly.
    * ***minRam***: The minRam defines the minimum amount of RAM for using this image properly.
    * ***isPublic***: The isPublic defines whether the image is available public or not.

## <VNFD\>.json

The <vnfd\>.json contains the VirtualNetworkFunctionDescriptor (VNFD) onboarded to the Orchestrator.
This VNFD can later be referenced in a NSD by its ID to make use of it.
A more detailed explanation of the VNFD can be found [here][vnfd-link].

**Note** The name of the file is not is up to you but the file extension .json is must be present since the VNFPackageManagement is looking for this kind of file.

## scripts

The scripts folder contains all the scripts required for starting, configuring or whatever you want to do on the running instance during specific lifecycles.
The execution order is defined by the lifecycle_events inside the VNFD.
This lifecycle_events are triggered by the NFVO in the meaning of: if the event "INSTANTIATE" contains a script in the lifecycle_events, this script is executed when the NFVO calls the instantiate method for the specific VNFR.

**Note** The scripts in the folder ***scripts*** are fetched only if the ***scripts-link*** is not defined in the ***Metadata.yaml***.
    This means that the scripts in that folder have less priority than the scripts located under ***scripts-link***.

**Note** Scripts are executed when a specific Event is fired and this Event references to specific scripts.
**Note** The *scripts* folder cannot contain subfolder. All scripts must be under the _scripts_ folder.
**Note** The scripts inside the *scripts* folder can be either shell scripts or python scripts. In both cases the parameters are passed as environment variables.

## <image\>.img

**Note** At the moment it is only supported to upload an image by using the `link` defined in **Metadata.yaml**. Image uploading from an image inside the package is disabled.

This image is used for uploading it to all the cloud environments which are addressed inside the VNFD with that image.
It doesn't matter whether an image already exists on the considered cloud environment or not.

**Note** This image has lower priority than the ***image-links*** defined in ***Metadata.yaml***.
    This means that the image will be ignored if the ***image-links*** is defined.

**Note** The name of the image doesn't matter but the suffix .img since the VNFPackageManagement is looking for a file with this suffix.
    However, the name and all the properties for storing it on the cloud environment are defined in ***Metadata.yaml*** under the key ***image***.

# Tutorial

This section explains how to create, upload and make use of VNF Packages.
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
scripts-link: https://script-link-to-git.git
image:
    upload: "check"
    names:
        - iperf_server_image
    link: "http://releases.ubuntu.com/14.04/ubuntu-14.04.3-server-amd64.iso"
image-config:
    name: iperf_server_image
    diskFormat: QCOW2
    containerFormat: BARE
    minCPU: 2
    minDisk: 5
    minRam: 2048
    isPublic: false
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
      "vimInstanceName":["vim-instance"]
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
We have chosen this one [ubuntu-14.04.3-server-amd64.iso][image-link].

### VNF Package [iperf-client]

This iperf-client VNF Package has to install the iPerf client and needs to be configured in order to know the iPerf servers' IP.

#### Metadata [iperf-client]
In the Metadata.yaml we define the name of the VNF Package, the scripts location and also the properties for the image to upload.
Since passing an image is not supported in the current release we will use the image link inside the `Metadata.yaml`.
Finally, it looks as shown below.

```yaml
name: iperf-client
scripts-link: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
image:
    upload: "check"
    names:
        - iperf_client_image
    link: "http://releases.ubuntu.com/14.04/ubuntu-14.04.3-server-amd64.iso"
image-config:
    name: iperf_client_image
    diskFormat: QCOW2
    containerFormat: BARE
    minCPU: 2
    minDisk: 5
    minRam: 2048
    isPublic: false
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
      "vimInstanceName":["vim-instance"]
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
We have chosen this one [ubuntu-14.04.3-server-amd64.iso][image-link].

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
[image-link]:http://uec-images.ubuntu.com/releases/14.04/release/ubuntu-14.04-server-cloudimg-amd64-disk1.img
[tosca-nfv]:https://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[csar-onboarding]:tosca-CSAR-onboarding
[cli]:nfvo-how-to-use-cli

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
