# Tutorial: iPerf Network Service
-----------------------------------------

This tutorial explains how to deploy a network service that uses iPerf. [iPerf][iperf-website] is a tool for active measurements of the maximum achievable bandwidth between two or more machines.

You can execute also the same tutorial using the [TOSCA] definitions. 

This tutorial makes use of:

* Generic VNFM ([generic-vnfm][generic-vnfm])
* Generic EMS ([generic ems][ems-github])
* OpenStack plugin ([openstack-plugin][openstack-plugin])

## Requirements

In order to execute this scenario, you need to have the following components up and running:

 * The NFVO
 * the OpenStack plugin
 * the Generic VNFM (includes already generic EMS)
 * a PoP (of type openstack) registered. You can use the following [json descriptor][vim] by changing the values to your needs.

## Store the Network Service Descriptor

Download the following [iPerf NSD using private IPs][iperf-nsd-privateIPs] or [iPerf NSD using floating IPs][iperf-nsd-floatingIPs], and upload it in the catalogue either using the dashboard or the cli.

### Using dashboard

If you want to use the Dashboard (checkout the [dashboard documentation][dashboard] for more information on how to use it), open it at the URL http://your-ip-here:8080 and log in (default username and password are *admin* and *openbaton*). Go to `Catalogue -> NS Descriptors` and choose the NSD of your choice by clicking on `Upload NSD` and selecting the Descriptor's json file.

![Onboarding-NSD][nsd-onboarding]

### Using CLI

If you want to use the CLI (checkout the [openbaton-client documentation][cli] for more information on how to install it), you need to execute the following command in order to onboard the iPerf's NSD by using private IPs:

```bash
$./openbaton.sh NetworkServiceDescriptor-create tutorial-iperf-NSR-privateIPs.json
```

Once this request is processed successfully, it returns the following:

```bash
+------------------ +------------------------------------------------------------------ +
| PROPERTY          | VALUE                                                             |
+------------------ +------------------------------------------------------------------ +
| VNFD              |                                                                   |
|                   | id: 4625f79d-8d02-44bf-a97b-d93c991d8bef - name:  iperf-server    |
|                   | id: 703f09db-0b05-4260-bbf0-89ee4d976ae3 - name:  iperf-client    |
|                   |                                                                   |
| VNF_DEPENDENCY    |                                                                   |
|                   | id: b1e850b7-0194-4062-9bdb-75ee356e1dce                          |
|                   |                                                                   |
| id                | 658c2b21-4af6-4489-84f7-ee864159404c                              |
|                   |                                                                   |
| hb_version        | 1                                                                 |
|                   |                                                                   |
| name              | NSD iperf + privateIPs                                            |
|                   |                                                                   |
| vendor            | FOKUS                                                             |
|                   |                                                                   |
| version           | 1.0                                                               |
|                   |                                                                   |
| VLD               |                                                                   |
|                   | id: 53ab8671-126c-4918-b3e1-34aaa449558a - name:  private         |
|                   |                                                                   |
+------------------ +------------------------------------------------------------------ +

```

## Deploy the Network Service Descriptor
As soon as you onboarded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.

### Using dashboard

This part shows you how to deploy an onboarded NSD via the dashboard. You need to go again to the GUI, go to `Catalogue -> NS Descriptors`, and open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button in order to start the deployment of this NSD.

![nsr-deployment][nsd-deployment]

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the deploying NSD.

### Using CLI

You can also use the CLI for deploying existing NSDs. Therefore, you need to execute the following command in order to start the deployment. The ID of the NSD to deploy can be found either by using the dashboard or getting it from the output when onboarding a new NSD as done in the previous step. The command to deploy the previously onboarded NSD looks like shown below:

```bash
$./openbaton.sh NetworkServiceRecord-create 658c2b21-4af6-4489-84f7-ee864159404c {} []
```

The execution of this command produces the following output:

```bash
+------------------------ +------------------------------------------------------------- +
| PROPERTY                | VALUE                                                        |
+------------------------ +------------------------------------------------------------- +
| id                      | 8c6cca05-9042-4a9b-8736-4178c75f5c54                         |
|                         |                                                              |
| vendor                  | FOKUS                                                        |
|                         |                                                              |
| version                 | 1.0                                                          |
|                         |                                                              |
| VLR                     |                                                              |
|                         | id: 09dfce1d-12ee-450c-8ca8-eb3c68ecf768 - name:  private    |
|                         |                                                              |
| VNF_DEPENDENCY          |                                                              |
|                         | id: e88b2593-d339-4ec8-9606-f9300cf6163e                     |
|                         |                                                              |
| descriptor_reference    | 658c2b21-4af6-4489-84f7-ee864159404c                         |
|                         |                                                              |
| status                  | NULL                                                         |
|                         |                                                              |
| name                    | NSD iperf + privateIPs                                       |
|                         |                                                              |
+------------------------ +------------------------------------------------------------- +
```

In order to follow the deployment process you can retrieve information by passing the ID of the deploying NSR:
```bash
$./openbaton.sh NetworkServiceRecord-findById 8c6cca05-9042-4a9b-8736-4178c75f5c54
+------------------------ +------------------------------------------------------------------ +
| PROPERTY                | VALUE                                                             |
+------------------------ +------------------------------------------------------------------ +
| id                      | 8c6cca05-9042-4a9b-8736-4178c75f5c54                              |
|                         |                                                                   |
| vendor                  | FOKUS                                                             |
|                         |                                                                   |
| version                 | 1.0                                                               |
|                         |                                                                   |
| VLR                     |                                                                   |
|                         | id: 09dfce1d-12ee-450c-8ca8-eb3c68ecf768 - name:  private         |
|                         |                                                                   |
| VNFR                    |                                                                   |
|                         | id: f1ed92eb-8b41-4113-a4c0-958e629dd425 - name:  iperf-client    |
|                         | id: d11c93ff-c7b2-4ad2-8e7e-32571a5cd3b0 - name:  iperf-server    |
|                         |                                                                   |
| VNF_DEPENDENCY          |                                                                   |
|                         | id: e88b2593-d339-4ec8-9606-f9300cf6163e                          |
|                         |                                                                   |
| descriptor_reference    | 658c2b21-4af6-4489-84f7-ee864159404c                              |
|                         |                                                                   |
| status                  | ACTIVE                                                            |
|                         |                                                                   |
| name                    | NSD iperf + privateIPs                                            |
|                         |                                                                   |
+------------------------ +------------------------------------------------------------------ +
```

## Conclusions

When all the VNF Records are done with all of the scripts defined in the lifecycle events, the NFVO will put the state of the VNF Record to ACTIVE and when all the VNF Records are in state ACTIVE, also the Network Service Record will be in state ACTIVE. This means that the service was correctly run.

# Addtional information about this scenario

In this page there is a full use case example explaining how the deployment process works, step-by-step. We assume that the NFVO and the Generic VNFM are ready to receive invocations.

The following pictures shows what is going to be deployed, an [Iperf][iperf] client and an Iperf server.

![iperf-deployment][iperf-client-server]

As shown in the picture, the iperf server is the source of the dependency and the client is the target. In this case the client needs the IP of the server. The semantics of the vnf dependency is: the source provides some parameters to the target.

Before starting we need to send the VimInstance to the NFVO and the Network Service Descriptor. For doing this please have a look into the [Vim instance documentation][vim-doc], [VNF Package documentation][vnf-package] and [Network Service Descriptor documentation][nsd-doc]. In fact, for creating a Network Service Record, we need to have a Network Service Descriptor loaded into the catalogue with two Virtual Network Functions (iperf client and server) created from a VNF Package. A Virtual Network Function Descriptor Json-File for Iperf client looks like this:

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
        "ubuntu-14.04-server-cloudimg-amd64-disk1"
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

This is a perfect example of a dependency. The VNFManager Generic, after creation of the client VNF described, will run the `install.sh` script during the instantiate method. The install.sh script is:

```bash
#!/bin/bash

sudo apt-get update && sudo apt-get install -y iperf screen
```

As said before in the documentation [VNFManager Generic][vnfm-generic], _the scripts in the CONFIGURE lifecycle event need to start with the type of the source VNF followed by \_ and the name of the script_, so the `server_configure.sh is:

```bash
#!/bin/bash

screen -d -m -S client iperf -c $server_private -t 300
```

These scripts shown above, are contained in the VNF Package or in a git repository accessible from the VM. Be aware that all the scripts will be executed with root permissions. Once all these steps are done we are ready to create a Network Service Record from the id of the Network Service Descriptor. 

Let's again have a look at the sequence diagram of a create Network Service Record operation.

![CreateNSR Sequence Diagram][sequence-diagram-os-vnfm-ems]

When the Network Service Record create is called with the Iperf Network Service Descriptor's id, the steps defined in the sequence diagram above happen.

##### INSTANTIATE Method

The first message sent to the Generic VNFM is the INSTANTIATE message **(1)**. This message contains the VNF Descriptor and some other parameters needed to create the VNF Record, for instance the list of Virtual Link Records. The Generic VNFM  is called and then the create Virtual Network Function Record and the Virtual Network Function Record is created **(2)** and sent back to the NFVO into a GrantOperation message **(3)**. This message will trigger the NFVO to check if there are enough resources to create that VNF Record. If so, then a GrantOperation message with the updated VNF Record is sent back to the Generic VNFManager. Then the Generic VNFManager creates an AllocateResources message with the received VNF Record and sends it to the NFVO **(4)**. The NFVO after creating the Resources (VMs) sends back the AllocateResources message to the VNFManager. Here the instantiate method is called **(5)**. Inside this method, the scripts (or the link to the git repository containing the scripts) contained in the VNF Package is sent to the EMS, the scripts are saved locally to the VM and then the Generic VNFManager will call the execution of each script defined in the VNF Descriptor **(6)**. Once all of the scripts are executed and there wasn't any error, the VNFManager sends the Instantiate message back to the NFVO **(7)**. 

##### MODIFY Method

If the VNF is target for some dependencies, like the iperf client, the MODIFY message is sent to the VNFManager by the NFVO **(8)**. Then the VNFManager executes the scripts contained in the CONFIGURE lifecycle event defined in the VNF Descriptor **(9)**, and sends back the modify message to the NFVO **(10)**, if no errors occurred. In this case, the scripts environment will contain the variables defined in the related VNF dependency.

##### START Method

Here exactly as before, the NFVO sends the START message to the Generic VNFManager **(11)**, and the VNFManager calls the EMS for execution of the scripts defined in the START lifecycle (none for this example) **(12)**. And the start message is then sent back to the NFVO meaning that no errors occurred **(13)**.

## Conclusions

When all the VNF Records are done with all of the scripts defined in the lifecycle events, the NFVO will put the state of the VNF Record to ACTIVE and when all the VNF Records are in state ACTIVE, also the Network Service Record will be in state ACTIVE. This means that the service was correctly run. For knowing more about the states of a VNF Record please refer to [VNF Record state documentation][vnfr-states]

<!---
References
-->
[cli]: nfvo-how-to-use-cli
[dashboard]: nfvo-how-to-use-gui
[iperf-client-server]:images/use-case-example-iperf-client-server.png
[sequence-diagram-os-vnfm-ems]:images/use-case-example-sequence-diagram-os-vnfm-ems.png
[vnfr-states]:vnfr-states
[vnfm-generic]: vnfm-generic
[nsd-doc]:ns-descriptor
[vnf-package]:vnfpackage
[vim-doc]:vim-instance
[iperf]:https://iperf.fr
[generic-vnfm]:https://github.com/openbaton/generic-vnfm
[openstack-plugin]:https://github.com/openbaton/openstack-plugin
[vim]: descriptors/vim-instance/openstack-vim-instance.json
[iperf-nsd-privateIPs]: descriptors/tutorial-iperf-NSR/tutorial-iperf-NSR-privateIPs.json
[iperf-nsd-floatingIPs]: descriptors/tutorial-iperf-NSR/tutorial-iperf-NSR-floatingIPs.json
[nsd-deployment]: images/tutorials/tutorial-iperf-NSR/nsd-deploy.png
[nsd-onboarding]: images/tutorials/tutorial-iperf-NSR/nsd-onboarding.png
[ems-github]: https://github.com/openbaton/ems/tree/master
[iperf-website]:https://iperf.fr
[TOSCA]: tosca-iperf-scenario.md

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
