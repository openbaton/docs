# VNFPackage

**Note**: This is the initial version of the VNFPackage and might change most probably in the next releases to improve and simplify the creation, usability and power.

This doc describes essential components of a VNFPackage, how to create them and how to use them after onboarding.
Therefore, you can find a practical tutorial at the end with all the steps starting from the creation over onboarding and finally referencing it by a NSD.

A VNFPackage is a tar-archive that contains all the information required for creating a VNF for the openbaton NFVO.
After onboarding the VNFPackage on the NFVO you can use the VNF directly in the NSD by referencing the VNFD by its id.
A VNFPackage includes the VNFD, the image, scripts and a Metadata file structured as shown in the next part.

# Package structure
The VNFPackage has the following structure:

```bash
- Metadata.yaml
- vnfd.json
- scripts/
    - 1_script.sh
    - 2_script.sh
- image.img
```
## Metadata.yaml
The Metadata.yaml defines essential properties for the VNF. This file bases on the YAML syntax where information are stored in simple <key\> : <value\> associations.

The example of a Metadata.yaml file below shows a basic definition of a VNFPackage.

```yaml
name: vnfPackage_name
scripts-link: scripts_link
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

* ***name***: The name defines the name of the VNFPackage itself used to store it on the database.
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
        If the image does not exist, the VNFPackage onboarding will throw an exception.
        In this case the image (if defined) will be ignored.
        * check: this option means that the VNFPackageManagement checks first if the image is available (defined in ids or names).
        If the image does not exist, a new one with the image defined in the VNFPackage will be created.
        * **Note** Please use quotation marks for this option since the values are handled as strings internally.
        Otherwise true and false will be handled as a boolean that would lead to a faulty behavior when onboarding a new VNFPackage.
    * ***ids***: The list of image ids is used to fetch the image from the corresponding VimInstance.
        To do it, the manager iterates over all ids and checks if an image with that id exists on the VimInstance.
        The defined ids have a higher priority than the list of names.
        We distinguish between the following cases:
        * If it finds no image with these ids, it continues with the list of image names.
        * If it finds one image with these ids, this image will be used.
        * If it finds multiple images with the same id (should never happen) or multiple ids matching to multiple images, an exception will be thrown because it is not clear which image to use.
    * ***names***: The list of image names is used to fetch the image from the corresponding VimInstance.
        To do it, manager iterates over all names and checks if an image with that name exists on the VimInstance.
        The list of names have a lower priority than the list of ids.
        We distinguish between the following cases:
        * If it finds no image with that name, an exception will be thrown except you defined the upload option check.
        Then it will create a new image defined in the VNFPackage.
        * If it finds one image, this image will be used.
        * If it finds multiple images with the same name or multiple names matching to multiple images, an exception will be thrown because it is not clear which image to use.
    * ***link***: This link points to an image available at this URL used to upload the image to the cloud environment.
        * **Note** Either you have to define the image-link or put the image directly into the VNFPackage if you want to upload a new Image to the VIM by using image upload option `true` or `check`.
            Otherwise a NotFoundException will be thrown and the VNFPackage will not onboard.
            The image-link has a higher priority than the image stored in the VNFPackage directly.
        * ****Note**** At the moment it is only supported to upload an image by using the `link`. Image uploading from an image inside the package is disabled.
* ***image-config***: All the properties explained below are required to upload the image to the cloud environment properly.
    In case of creating a new image this configuration will be used.
    * ***name***: This defines the name for the image to upload either located directly in the VNFPackage or available via the URL defined in image-link.
    * ***diskFormat***: The diskFormat defines the format in which disk type the image is stored.
    * ***containerFormat***: The containerFormat defines the format in which container type the image is stored .
    * ***minCPU***: The minCPU defines the minimum amount of CPU cores for using this image properly.
    * ***minDisk***: The minDisk defines the minimum amount of disk space for using this image properly.
    * ***minRam***: The minRam defines the minimum amount of RAM for using this image properly.
    * ***isPublic***: The isPublic defines whether the image is available public or not.

## <VNFD\>.json

The <vnfd\>.json contains the VirtualNetworkFunctionDescriptor (VNFD) onboarded on the Orchestrator.
This VNFD can later be referenced in a NSD by its id to make use of it.
A more detailed explanation of the VNFD can be found [here][vnfd-link].

**Note** The name of the file is not important but the file extension .json is, since the VNFPackageManagement is looking for this kind of file format.

## scripts

The scripts folder contains all the scripts required for starting, configuring or whatever you want to do on the running instance.
The execution order is defined by the lifecycle_events inside the VNFD.
This lifecycle_events are triggered by the NFVO in the meaning of: if the event "INSTANTIATE" contains a script in the lifecycle_events, this script is executed when the NFVO calls the instantiate method for the specific VNFR.

**Note** The scripts in the folder ***scripts*** are fetched only if the ***scripts-link*** is not defined in the ***Metadata.yaml***.
    This means that the scripts in that folder have less priority than the scripts located under ***scripts-link***.

**Note** Scripts are executed when a specific Event is fired and this Event references to specific scripts.

## <image\>.img

**Note** At the moment it is only supported to upload an image by using the `link` defined in **Metadata.yaml**. Image uploading from an image inside the package is disabled.

This image is used to upload it to all the cloud environments which are addressed inside the VNFD with that image.
It doesn't matter whether an image already exists on the considered cloud environment or not.

**Note** This image has lower priority than the ***image-links*** defined in ***Metadata.yaml***.
    This means that the image will be ignored if the ***image-links*** is defined.

**Note** The name of the image doesn't matter but the suffix .img since the VNFPackageManagement is looking for a file with this suffix.
    However, the name and all the properties for storing it on the cloud environment are defined in ***Metadata.yaml*** under the key ***image***.

# Tutorial

This section explains how to create, upload and make use of VNFPackages.
The chosen scenario is a NetworkService for testing the network connectivity by using [iPerf][iperf-link].
iPerf is a tool for active measurements of the maximum achievable bandwidth on IP networks.
Therefore, we need a server and a client installing the iPerf server/client and configuring them for communication between.

## Creation of VNFPackages
For doing so, we need to create two VNFPackages and reference them in the NSD.
So we need one VNFPackage for the iperf server (called iperf-server) and one for the iperf client (called iperf-client).
First we will start with the creation of the iperf-server VNFPackage and then we will create the iperf-client VNFPackage.

First of all we should create a directory for each VNFPackage where we put all the files related to the VNFPackage because in the end we need to pack them into a tar archive for onboarding it on the NFVO.

### VNFPackage [iperf-server]
This iperf-server VNFPackage has to install the iperf server and needs to provide its ip to the iperf client.

#### Metadata [iperf-server]
In the Metadata.yaml we define the name of the VNFPackage, the scripts location and also the properties for the image to upload.
Since the image-link is not implemented in the current release we will put the image directly into the VNFPackage.
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
This is how the [VNFD](vnf-descriptor) looks like for the iperf-server VNFPackage.
Important to notice here is the vm_image that points to the image we have defined in the Metadata.yaml

```json
{
    "vendor":"fokus",
    "version":"0.2",
    "name":"iperf-server",
    "type":"server",
    "endpoint":"generic",
    "vdu":[
        {
            "vm_image":[
                "iperf_server_image"
            ],
            "vimInstanceName":"vim-instance",
            "scale_in_out":2,
            "vnfc":[
                {
                    "connection_point":[
                        {
                            "floatingIp":"random",
                            "virtual_link_reference":"private"
                        }
                    ]
                }
            ]
        }
    ],
    "virtual_link":[
        {
            "name":"private"
        }
    ],
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
                "install.sh",
                "install-srv.sh"
            ]
        }
    ],
    "deployment_flavour":[
        {
            "df_constraint":[
                "constraint1",
                "constraint2"
            ],
            "costituent_vdu":[
            ],
            "flavour_key":"m1.small"
        }
    ]
}
```
#### Image

The image we have to choose must be a debian 64bit image (e.g. ubuntu amd64) for satisfying the EMS and scripts which are designed for that kind of image.
We have chosen this one [ubuntu-14.04.3-server-amd64.iso][image-link].

### VNFPackage [iperf-client]

This iperf-server VNFPackage has to install the iperf client and needs to configure it to set the iperf servers' IP.

#### Metadata [iperf-client]
In the Metadata.yaml we define the name of the VNFPackage, the scripts location and also the properties for the image to upload.
Since the image-link is not implemented in the current release we will put the image directly into the VNFPackage.
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

This is how the [VNFD](vnf-descriptor) looks like for the iperf-client VNFPackage.
Important to notice here is the vm_image that points to the image we have defined in the Metadata.yaml

```json
{
    "vendor":"fokus",
    "version":"0.1",
    "name":"iperf-client",
    "type":"client",
    "endpoint":"generic",
    "vdu":[
        {
            "vm_image":[
                "iperf_client_image"
            ],
            "virtual_memory_resource_element":"1024",
            "virtual_network_bandwidth_resource":"1000000",
            "vimInstanceName":"vim-instance",
            "vdu_constraint":"",
            "scale_in_out":2,
            "vnfc":[
                {
                    "connection_point":[
                        {
                            "virtual_link_reference":"private"
                        }
                    ]
                }
            ]
        }
    ],
    "virtual_link":[
        {
            "name":"private"
        }
    ],
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
                "install.sh"
            ]
        },
        {
            "event":"CONFIGURE",
            "lifecycle_events":[
                "server_configure.sh"
            ]
        }
    ],
    "deployment_flavour":[
        {
            "df_constraint":[
                "constraint1",
                "constraint2"
            ],
            "costituent_vdu":[
            ],
            "flavour_key":"m1.small"
        }
    ]
}
```

#### Image

The image we have to choose must be a debian 64bit image (e.g. ubuntu amd64) for satisfying the EMS and scripts which are designed for that kind of architecture.
We have chosen this one [ubuntu-14.04.3-server-amd64.iso][image-link].

## Onboarding VNFPackages

Once we have finalized the creation of VNFPackages and packed them into a tar we can onboard them on the NFVO. Make sure that you also uploaded a VimInstance before onboarding the package. Onboarding can be done as shown in the following:

```bash
$ curl -X POST -v -F file=@vnf-package.tar "http://localhost:8080/api/v1/vnf-packages"
```

This must be done for both VNFPackages expecting that the NFVO is running locally and the tar archive is called vnf-package.tar.
Otherwise you need to adapt the path to the package and also the URL where the NFVO is located.
Now where we onboarded the VNFPackages they are available on the NFVO and we can make use of it by referencing them in the NSD by their ids'.

**Note** You could use the [Dashboard][dashboard-link] as well for onboarding the VNFPackages.

To get the ids of the newly created VNFDs you need to fetch the VNFDs by invoking the following command:

```bash
$ curl -X GET "http://localhost:8080/api/v1/vnf-descriptors"
```

This request will return a list of already existing VNFDs.
Just looking for the VNFDs we created before and use the id to reference them in the NSD.
The following list of VNFDs is an example of this request.
To make it more readable only the interesting parts are shown.
```json
[
  [...]
  {
    [...]
    "id": "29d918b9-6245-4dc4-abc6-b7dd6e84f2c1",
    "name": "iperf-server",
    [...]
  },
  {
    [...]
    "id": "87820607-4048-4fad-b02b-dbcab8bb5c1c",
    "name": "iperf-client",
    [...]
  }
  [...]
]
```

## NSD [iperf]
In this section we will create a [NSD](ns-descriptor) and reference the previously created VNFPackages by their ids'.
For doing that we just need to define the **id** for each VNFPackges' VNFD in the list of VNFDs.
To provide also the iperf-servers' IP to the iperf-client we need to define dependencies you can find under the key **vnf_dependency** setting the source to **iperf-server** and the target to **iperf-client** by providing the parameter **private1**.

**Note** When creating the NSD the VNFD is fetched by the id defined. Other properties we would set in the VNFD in this NSD will be ignored.

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
                "private1"
            ]
        }
    ]
}
```

Finally you can onboard this NSD and create a NSR that bases on both VNFPackages created before.

### Onboard NSD
The following command will onboard the NSD on the NFVO:
```bash
$ curl -X POST -v -F file=@nsd.json "http://localhost:8080/api/v1/ns-descriptors"
```

This will return the NSD with the id we need to create NSR.
Afterwards, we can deploy the NSD.

**Note** You could use the [Dashboard][dashboard-link] as well for onboarding the NSD.

### Create NSR (Deployment)
To deploy the NSD we create a NSR with the following command:

```bash
$ curl -X POST -v -F file=@vnf-package.tar "http://localhost:8080/api/v1/ns-records/<NSD_ID>"
```

Installation and configuration is done automatically and provides you with a configured iperf server/client infrastructure.

**Note** You could use the [Dashboard][dashboard-link] as well for creating the NSR of this NSD.

[iperf-link]:https://iperf.fr/
[dashboard-link]:nfvo-how-to-use-gui
[vnfd-link]:vnf-descriptor
[image-link]:http://uec-images.ubuntu.com/releases/14.04/release/ubuntu-14.04-server-cloudimg-amd64-disk1.img

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
