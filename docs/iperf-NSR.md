# Tutorial: iPerf Network Service

This tutorial explains how to deploy a network service that uses iPerf.  
[iPerf][iperf-website] is a tool for active measurements of the maximum achievable bandwidth between two or more machines where an iPerf client connects to an iPerf server.

You can execute also the same tutorial using the [TOSCA] definitions.

This tutorial makes use of:

* [NFVO][nfvo-github]
* [Generic VNFM][generic-vnfm]
* Generic [EMS][ems-github]
* [OpenStack vim driver][openstack-plugin]

## Requirements

In order to execute this scenario, you need to have the following components up and running:

 * The [NFVO][nfvo-github]
 * the [OpenStack vim driver][openstack-plugin]
 * the [Generic VNFM][generic-vnfm]
 * Configured and running OpenStack environment

Start the NFVO and Generic VNFM depending on how you [installed][installation] it.  
If you used the bootstrap script for installing you do not have to care about the OpenStack vim driver as it will be installed already.


### Run it with Docker

You can find a [docker-compose] file ready to launch the required components for this tutorial. Assuming that you have installed the latest version of Docker and Docker Compose, download the [docker-compose] file and execute the following command: 

```bash
HOST_IP=192.168.42.42 docker-compose -p ob -f min-compose.yml up -d
```

Where the HOST_IP parameter is the IP of your host where you are executing the docker containers. Please note that the IP must be reachable from the OpenStack environment (in particular from the VMs created)
for allowing the EMS agent to reach back the Generic VNFM. 

Feel free to adapt the min-compose.yml file as you wish including other components you may need.

**important note** the NFVO uses the in memory database, thus anything stored in the NFVO won't be persisted after restart of the container. 

## Store the Vim Instance

For registering the Point of Presence of type OpenStack to the NFVO you have to upload a Vim Instance. You can use the following [json descriptor][vim] by changing the values to your needs.

### Using the dashboard

If you want to use the Dashboard (checkout the [dashboard documentation][dashboard] for more information on how to use it), open it at the URL http://ip-where-nfvo-runs:8080 (change port and protocol if you use SSL) and log in (default username and password are *admin* and *openbaton*).  
Go to `Manage PoPs -> PoP Instances` and choose the Vim Instance of your choice by clicking on `Register a new PoP` and selecting the Vim Instance's json file.

![Onboarding-Vim][vim-onboarding]

### Using the CLI

If you want to use the CLI (checkout the [Open Baton Client documentation][cli] for more information on how to install and use it), you need to execute the following command in order to onboard the Vim Instance where *vim-instance.json* is the path to the Vim Instance file:

```bash
$./openbaton.sh VimInstance-create vim-instance.json
```

## Store the Network Service Descriptor

Download the [iPerf NSD using private IPs][iperf-nsd-privateIPs] or [iPerf NSD using floating IPs][iperf-nsd-floatingIPs], and upload it in the catalogue either using the dashboard or the CLI.  
The difference is that the first NSD will deploy Virtual Machines without floating IPs on OpenStack whereas the second one will use floating IPs.

### Using the dashboard

If you want to use the Dashboard go to `Catalogue -> NS Descriptors` and choose the NSD of your choice by clicking on `On Board NSD -> Upload JSON` and selecting the Descriptor's json file.

![Onboarding-NSD][nsd-onboarding]

### Using the CLI

If you want to use the CLI you need to execute the following command in order to onboard the NSD:

```bash
$./openbaton.sh NetworkServiceDescriptor-create tutorial-iperf-NSD.json
```

Once this request is processed successfully, it returns the following:

```bash
+------------------ +------------------------------------------------------------------ +
| PROPERTY          | VALUE                                                             |
+------------------ +------------------------------------------------------------------ +
| VNFD              |                                                                   |
|                   | id: 2dd6a30d-0eee-4f88-aa45-9f3a420f341b - name:  iperf-server    |
|                   | id: 55ac1b21-fdf0-4fe3-861e-5b1f6b5079e3 - name:  iperf-client    |
|                   |                                                                   |
| VNF_DEPENDENCY    |                                                                   |
|                   | id: 123b3dc1-4310-405c-8c50-17dbb1becd2d                          |
|                   |                                                                   |
| id                | f2086f71-4ecf-4ed8-a692-36775ebdfc68                              |
|                   |                                                                   |
| hb_version        | 1                                                                 |
|                   |                                                                   |
| name              | NSD iperf + privateIPs                                            |
|                   |                                                                   |
| projectId         | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                              |
|                   |                                                                   |
| vendor            | FOKUS                                                             |
|                   |                                                                   |
| version           | 1.0                                                               |
|                   |                                                                   |
| VLD               |                                                                   |
|                   | id: bd65ee00-ce56-42f4-9d31-5cd220ee64a6 - name:  private         |
|                   |                                                                   |
+------------------ +------------------------------------------------------------------ +
```

## Deploy the Network Service Descriptor
As soon as you onboarded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.  
This will create a Network Service Record (NSR) and actually launch the Virtual Machines on OpenStack.

### Using the dashboard

This part shows you how to deploy an onboarded NSD via the dashboard. You need to go to the GUI again and navigate to `Catalogue -> NS Descriptors`. Open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button and a window with launching options will appear. Just click on `Launch` again in order to start the deployment of this NSD.

![nsr-deploy][nsr-deploy]

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the created NSR.

### Using the CLI

You can also use the CLI for deploying existing NSDs. The command needs the ID of the NSD to deploy as an argument. It can be found either by using the dashboard or getting it from the output when onboarding a new NSD as done in the previous step. The command to deploy the previously onboarded NSD looks like shown below:

```bash
$./openbaton.sh NetworkServiceRecord-create f2086f71-4ecf-4ed8-a692-36775ebdfc68 vimmap.json keypair.json conf.json
```

The first argument is the ID of the NSD from which the NSR will be created. The following arguments are files that can contain additional configuration while deploying.
You have to pass these files even if you do not want to pass any configuration like in our case. So just create the three files and fill them with empty json objects/arrays (i.e. *{}* and *[]*).  
The *vimmap.json* and the *conf.json* files should contain this:
```json
{}
```
And the *keypair.json* file this:
```json
[]
```

The execution of this command produces the following output:

```bash
+------------------------ +------------------------------------------------------------- +
| PROPERTY                | VALUE                                                        |
+------------------------ +------------------------------------------------------------- +
| id                      | af12b18b-9aa2-4fed-9b07-bbe1dcad9c98                         |
|                         |                                                              |
| vendor                  | FOKUS                                                        |
|                         |                                                              |
| projectId               | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                         |
|                         |                                                              |
| task                    | Onboarding                                                   |
|                         |                                                              |
| version                 | 1.0                                                          |
|                         |                                                              |
| VLR                     |                                                              |
|                         | id: 7c9996a4-eac8-4862-872b-dfccc4ab1790 - name:  private    |
|                         |                                                              |
| VNF_DEPENDENCY          |                                                              |
|                         | id: 4b0d291e-883b-40e0-b64e-faeb196d2aaf                     |
|                         |                                                              |
| descriptor_reference    | f2086f71-4ecf-4ed8-a692-36775ebdfc68                         |
|                         |                                                              |
| status                  | NULL                                                         |
|                         |                                                              |
| createdAt               | 2016.10.25 at 11:52:04 CEST                                  |
|                         |                                                              |
| name                    | NSD iperf + privateIPs                                       |
|                         |                                                              |
+------------------------ +------------------------------------------------------------- +
```

In order to follow the deployment process you can retrieve information by passing the ID of the deploying NSR to this command:

```bash
$./openbaton.sh NetworkServiceRecord-findById af12b18b-9aa2-4fed-9b07-bbe1dcad9c98


+------------------------ +------------------------------------------------------------------ +
| PROPERTY                | VALUE                                                             |
+------------------------ +------------------------------------------------------------------ +
| id                      | af12b18b-9aa2-4fed-9b07-bbe1dcad9c98                              |
|                         |                                                                   |
| vendor                  | FOKUS                                                             |
|                         |                                                                   |
| projectId               | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                              |
|                         |                                                                   |
| task                    | Onboarded                                                         |
|                         |                                                                   |
| version                 | 1.0                                                               |
|                         |                                                                   |
| VLR                     |                                                                   |
|                         | id: 7c9996a4-eac8-4862-872b-dfccc4ab1790 - name:  private         |
|                         |                                                                   |
| VNFR                    |                                                                   |
|                         | id: ecd372b4-b170-46de-93a4-06b8f03a6436 - name:  iperf-server    |
|                         | id: 20011a5c-73a5-46d6-a7c8-19bfa47de0e6 - name:  iperf-client    |
|                         |                                                                   |
| VNF_DEPENDENCY          |                                                                   |
|                         | id: 4b0d291e-883b-40e0-b64e-faeb196d2aaf                          |
|                         |                                                                   |
| descriptor_reference    | f2086f71-4ecf-4ed8-a692-36775ebdfc68                              |
|                         |                                                                   |
| status                  | ACTIVE                                                            |
|                         |                                                                   |
| createdAt               | 2016.10.25 at 11:52:04 CEST                                       |
|                         |                                                                   |
| name                    | NSD iperf + privateIPs                                            |
|                         |                                                                   |
+------------------------ +------------------------------------------------------------------ +
```

## Conclusions

When all the VNF Records are done with all of the scripts defined in the lifecycle events, the NFVO will put the state of the VNF Record to ACTIVE and when all the VNF Records are in state ACTIVE, also the Network Service Record will be in state ACTIVE. This means that the service is deployed correctly. For learning more about the states of a VNF Record please refer to the [VNF Record state documentation][vnfr-states].


# Additional information about this scenario

When you access your OpenStack dashboard you should be able to see the deployed Virtual Machines. One of them will act as an iPerf server and the other one as an iPerf client that connects to the server.

The following pictures shows the deployment.

![iperf-deployment][iperf-client-server]

As indicated by the blue arrow the iperf server is the source of a dependency and the client is the target. In this case the client needs the IP of the server in order to connect.
Let's have a look at the NSD we used to deploy this scenario in order to see how the dependencies are described.  
You will see that the NSD contains a field called *vnf_dependency*.

```json
"vnf_dependency":[
    {
      "source":{
        "name":"iperf-server"
      },
      "target":{
        "name":"iperf-client"
      },
      "parameters":[
        "private_floatingIp"
      ]
    }
  ]
```

The json array *vnf_dependency* may contain multiple dependencies. In our case it is just one, which describes that the VNFD named *iperf-client* needs a parameter called *private_floaingIp* from the VNFD *iperf-server*. This parameter can be used by the iperf-client as a variable in its lifecycle scripts.

Also the lifecycle scripts are specified in the NSD. For example the VNFD *iperf-client* has the following lifecycle events:

```json
"lifecycle_event":[
        {
          "event":"CONFIGURE",
          "lifecycle_events":[
            "server_configure_floatingIp.sh"
          ]
        },
        {
          "event":"INSTANTIATE",
          "lifecycle_events":[
            "install.sh"
          ]
        }
      ]
```

You can see that there is one lifecycle event called *INSTANTIATE* and one called *CONFIGURE*. Actually there exist also other lifecycle events, read about them [here][vnf-descriptor].  
Each one will be executed at a different point in time. By execution we mean that the scripts that are listed in the *lifecycle_events* field will run with root permissions on the Virtual Machine.  
The scripts are located in a public git repository. The url is specified in the *vnfPackageLocation* field in the VNFDs.  
In our example the *INSTANTIATE* event will run first after the Virtual Machine was initialized. It will run the *install.sh* script which installs iPerf and screen on the Virtual Machine.  
The *CONFIGURE* lifecycle event starts after the *INSTANTIATE* lifecycle event. The *CONFIGURE* lifecycle event has a special role. In the lifecycle scripts of this event the dependency parameters are available.  
That is why we use this event to tell iPerf to connect to the server ip. In the example NSD that uses floating IPs the dependency parameter is called *private_floatingIp*.
In the *CONFIGURE* lifecycle script we will therefore run
```bash
screen -d -m -S client iperf -c $server_private_floatingIp -t 300
```
You wonder why the variable in the script has another name than the dependency parameter? Well, you have to prepend the type of the source VNFD and an underscore to the variable. This is why *private_floatingIp* becomes *server_private_floatingIp*.  
And there is another restriction. In order to use the dependency parameter in the *CONFIGURE* script its name has to start with the source VNFD type followed by an underscore.  
If you want to learn more about dependencies, lifecycle events and variables read [this][vnfm-generic] section.

## The process in details

Let's again have a look at the sequence diagram of a create Network Service Record operation.

![CreateNSR Sequence Diagram][sequence-diagram-os-vnfm-ems]

When the Network Service Record create is called with the Iperf Network Service Descriptor's id, the steps defined in the sequence diagram above happen.

##### INSTANTIATE Method

The first message sent to the Generic VNFM is the INSTANTIATE message **(1)**. This message contains the VNF Descriptor and some other parameters needed to create the VNF Record, for instance the list of Virtual Link Records. The Generic VNFM  is called and then the create Virtual Network Function Record and the Virtual Network Function Record is created **(2)** and sent back to the NFVO into a GrantOperation message **(3)**. This message will trigger the NFVO to check if there are enough resources to create that VNF Record. If so, then a GrantOperation message with the updated VNF Record is sent back to the Generic VNFManager. Then the Generic VNFManager creates an AllocateResources message with the received VNF Record and sends it to the NFVO **(4)**. After creating the resources (VMs) the NFVO sends back the AllocateResources message to the VNFManager. Here the instantiate method is called **(5)**. Inside this method, the scripts contained in the VNF Package (or the git repository containing the scripts) is sent to the EMS, the scripts are saved locally to the VM and then the Generic VNFManager will call the execution of each script defined in the VNF Descriptor **(6)**. Once all of the scripts are executed and there wasn't any error, the VNFManager sends the Instantiate message back to the NFVO **(7)**.

##### MODIFY Method

If the VNF is target for some dependencies, like the iperf client, the MODIFY message is sent to the VNFManager by the NFVO **(8)**. Then the VNFManager executes the scripts contained in the CONFIGURE lifecycle event defined in the VNF Descriptor **(9)**, and sends back the modify message to the NFVO **(10)**, if no errors occurred. In this case, the scripts environment will contain the variables defined in the related VNF dependency.

##### START Method

Here exactly as before, the NFVO sends the START message to the Generic VNFManager **(11)**, and the VNFManager calls the EMS for execution of the scripts defined in the START lifecycle (none for this example) **(12)**. And the start message is then sent back to the NFVO meaning that no errors occurred **(13)**.

<!---
References
-->
[cli]: nfvo-how-to-use-cli
[dashboard]: nfvo-how-to-use-gui
[docker-compose]: compose/min-compose.yml
[iperf-client-server]:images/use-case-example-iperf-client-server.png
[sequence-diagram-os-vnfm-ems]:images/use-case-example-sequence-diagram-os-vnfm-ems.png
[vnfr-states]:vnfr-states
[vnfm-generic]: vnfm-generic
[nsd-doc]:ns-descriptor
[vnf-package]:vnf-package
[vnf-descriptor]:vnf-descriptor
[vim-doc]:vim-instance
[iperf]:https://iperf.fr
[nfvo-github]:https://github.com/openbaton/NFVO
[generic-vnfm]:https://github.com/openbaton/generic-vnfm
[openstack-plugin]:https://github.com/openbaton/openstack-plugin
[vim]: descriptors/vim-instance/openstack-vim-instance.json
[installation]:nfvo-installation
[iperf-nsd-privateIPs]: descriptors/tutorial-iperf-NSR/tutorial-iperf-NSR-privateIPs.json
[iperf-nsd-floatingIPs]: descriptors/tutorial-iperf-NSR/tutorial-iperf-NSR-floatingIPs.json
[nsr-deploy]: images/tutorials/tutorial-iperf-NSR/nsr-deploy.png
[vim-onboarding]: images/tutorials/tutorial-iperf-NSR/vim-onboarding.png
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
