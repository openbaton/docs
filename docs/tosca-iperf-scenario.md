# TOSCA definition

The definition follows the TOSCA Simple Profile for Network Functions Virtualization (NFV) [Version 1.0][tosca-nfv]
Regarding the objects defined from ETSI please see: [ETSI GS NFV-MAN 001][ETSI-MANO]

Premise: some of the objects are defined by OpenBaton

## Prerequisites

The prerequisites are:

* OpenBaton running
* Generic VNFM running
* [Vim Instance][vim-doc] stored in the Catalogue


##  Mapping between TOSCA and ETSI NFV


| TOSCA Type          			| ETSI Entity       													|
| -------------   				| -------------:													|
| openbaton.type.VNF.GENERIC  	| Virtual Network Function Descriptor (type: GENERIC) 
| openbaton.type.VDU 			| Virtual Deployment Unit (vnfd:vdu)     	|
| tosca.nodes.nfv.VL 			| Virtual Link Descriptor     	|
| tosca.nodes.nfv.CP 			| Connection Point      	|


## Deploy an Iperf TOSCA definition

We are going to create a NSD from TOSCA-definition that create a [iperf][iperf] scenario.

The components in the definition are these in the picture below:

![Iperf overview][iperf-TOSCA]


## Node Templates

The Node Templates are the description of the Objects which constitute the Network Service Descriptor.
Each Object is defined by ```Map<String , Object>```

### Node Template: VNF

You can see the definition of the VNF as described below:

```yaml
iperf-server: #VNF1
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version: 0.1
        configurations:
          name: server-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
        deployment_flavour:
          - flavour_key: m1.small
      requirements:
        - virtualLink: private
        - host:
            node: VDU2
            type: openbaton.relationships.HostedOn
      interfaces:
        Standard: # lifecycle
          create: install.sh
          start: install-srv.sh
```
This VNF is called ```iperf-server``` and below you can see the description of the fields:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | openbaton.type.VNF.GENERIC    | It is the type of the VNF and defines the type of the Virtual Network Function Manager (VNFG) which will handle the VNF |
| properties 			| See the Table below    	    | It is  a Object where are mapped some values for deploying the VNF    |
| requirements 			| See the Table below           | It describes the requirements for the VNF |
| interfaces			| See the Table below      	    | It is an Object which maps for each lifecycle interface  with the Script that will be executed for the lifecycle event specified |


The **Properties** for the VNF are:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| id  	                | String     | Identifier of the VNF |
| vendor  	            | String    | Name of the provider of the VNF |
| version  	            | String     | Version of the provider of the VNF  |
| configurations  	    | Object with two values **name**, **configurationParameters**  | **name**: is a String with the name of the Configuration, **configurationParameters**: the list of Parameters defined by a pair of < key, value > |
| vnfPackageLocation  	| URL    | It is URL where the Orchestrator will fetch the Scripts needed in the lifecycle events defined in the **interfaces** |
| deployment_flavour  	| List of flavour_key    | It is a list flavors each one refers to Virtual hardware templates called "flavors" in OpenStack  |

The **Requirements** for the VNF are:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| virtualLink  	        | List     | It is the List of *virtuaLink* where this VNF is connected |
| host  	            | List of VDU    | It is the List of VDU. Each *host* refers to a **node** VDU. This parameter follows the ETSI definition of VNF which should have the list of VDU. |

The **Interfaces** for the VNF cloud be of two types:
The TOSCA-Parser can handle both configurations.

#### 1. Standard

This interface follows the definition of **tosca.interfaces.node.lifecycle.Standard** described in the [TOSCA Simple YAML][TOSCA-simple-YAML] standard.
    
| Lifecycle event       | Value   	     | Description       											|
| -------------   		| -------------: | --------------:												|
| create  	            | Script file    | The Script will be called for this Lifecycle event |
| configure  	        | Script file    | The Script will be called for this Lifecycle event |
| start  	            | Script file    | The Script will be called for this Lifecycle event|
| stop  	            | Script file    | The Script will be called for this Lifecycle event|
| delete  	            | Script file    | The Script will be called for this Lifecycle event|
    
**NOTE** You can define the relationship between two VNFs in the *configuration* event like you can see in the example below:

```yaml
interfaces:
   Standard: # lifecycle
      create: install.sh
      configure:
         implementation: configure.sh
         inputs:
            server_ip: { get_attribute: [iperf-server, mgmt] }
      start: start.sh

```
The ```configure``` has two fields:

1. **implementation**: refers to the script which will be execute for this event
2. **inputs**: is the list of parameters that this VNF needs from the *source* VNF in the case above the source is **iperf-server** and the parameter is **mgmt**


#### 2. openbaton.interfaces.lifecycle 
 
This Interface has these events compared with the definition by TOSCA this one follows the ETSI Lifecycle Events. 

| Lifecycle event       | Value   	        | Description       											|
| -------------   		| -------------:	        | --------------:												|
| INSTANTIATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| CONFIGURE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| START  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| STOP  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| TERMINATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event|

### Node Template: VDU
This is the definition of VDU called ```VDU1```:

```yaml
VDU1:
      type: openbaton.type.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vimInstanceName: vim-instance
      requirements:
         - virtual_link: [CP1]
      capabilities:
        host:
          valid_source_types: openbaton.type.VDU

```

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | openbaton.type.VDU            | It is the type of the VDU |
| properties 			| See the Table below    	    | It is  a Object where are mapped some values for deploying the VDU    |
| requirements 			| List of requirement         | It describes the requirements for the VDU in the example above the VDU needs a virtual_link which is a list of Connection Point in this case **CP1**|
| capabilities			| Object      	    | Type of capability offered |

The **Properties** for the VDU are:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| vm_image  	                | List < String >     | It is the list of images present in the OpenStack that will be used to instantiate a VNFC (aka Virtual Machine) |
| scale_in_out  	            | Integer    | Maximum value of VNFCs that can be instantiated in the process of scale-in/out |
| vimInstanceName  	            | String     | Name of Point of Persistence (PoP aka Datacenter) where this VNFC will be instantiated  |



### Node Template: Connection Point (CP)

This is the definition of CP called ```CP2```:

```yaml
CP2: #endpoint of VDU2
      type: tosca.nodes.nfv.CP
      properties:
        floatingIp: random
      requirements:
        virtualbinding: VDU2
      virtualLink: private

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.CP            | It is the type of the CP |
| properties 			| Object   	    | It is a Object where are mapped some values for deploying the CP in this case **floatingIp** means that has a public IP chosen **random**  by OpenStack |
| requirements 			| Object         | It describes the requirements for the CP in the example above the CP needs a virtualbinding to the VDU in this case **VDU2**|
| virtualLink			| String      	    | It refers to Node Template which describes the Virtual Link in this case the Virtual Link is called **private**  |


### Node Template: Virtual Link (VL)

OpenBaton uses virtual Link name as subnets from OpenStack.

This is the definition of VL called ```private```:

```yaml
private:
    type: tosca.nodes.nfv.VL
    properties:
      vendor: Fokus
    capabilities:
      virtual_linkable:
        valid_source_types: tosca.nodes.nfv.CP

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.VL            | It is the type of the CP |
| properties 			| Object   	    | It is a Object that has some information in this case vendor |
| capabilities 			| Object      	    | Type of capability offered |



### Relationships Template
The Relationships Template creates the dependency between two VNFs.
This is the definition of Relationships Template called ```connection_server_client```:

```yaml

relationships_template:
  connection_server_client:
    type: tosca.nodes.relationships.ConnectsTo
    source: iperf-server
    target: iperf-client
    parameters:
        - private

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.relationships.ConnectsTo           | It is the type of the Relationships Template |
| source 			    | String   	    | It is a String which refers to the Node Template that describes the source VNF that provides some parameters in order to realize the dependency with the target VNF|
| target 			    | String   	    | It is a String which refers to the Node Template that describes the target VNF that requires some parameters in order to realize the dependency with the source VNF |
| parameters 			| List < String >      	    | List of parameters for this dependency |


The yaml definition that describe all the components and creates the Iperf-NSD is this below:


```yaml
tosca_definitions_version: tosca_iperf_1_0_0
tosca_default_namespace:    # Optional. default namespace (schema, types version)
description: NSD for deploing an iperf scenario
metadata:
  ID:                 # ID of this Network Service Descriptor
  vendor: Fokus       # Provider or vendor of the Network Service
  version: 0.1 Alpha  # Version of the Network Service Descriptor
  
topology_template:
  node_templates:
    iperf-server: #VNF1
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version: 0.1
        configurations:
          name: server-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
        deployment_flavour:
          - flavour_key: m1.small
      requirements:
        - virtualLink: private
        - host:
            node: VDU2
            type: openbaton.relationships.HostedOn
      interfaces:
        Standard: # lifecycle
          create: install.sh
          start: install-srv.sh
    iperf-client:
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version: 0.1
        configurations:
          name: client-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
        deployment_flavour:
          - flavour_key: m1.small
      requirements:
        - virtualLink: private
        - host:
            node: VDU1
            type: openbaton.relationships.HostedOn
      interfaces:
        openbaton.interfaces.lifecycle: # lifecycle
          INSTANCIATE:
            - install.sh
          CONFIGURE:
            - server_configure_only.sh
          START:
            - iperf_client_start.sh
    VDU1:
      type: openbaton.type.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vimInstanceName: vim-instance
      requirements:
         - virtual_link: [CP1]
      capabilities:
        host:
          valid_source_types: openbaton.type.VDU
    VDU2:
      type: openbaton.type.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vimInstanceName: vim-instance
      requirements:
        - virtual_link: [CP2]
      capabilities:
        host:
          valid_source_types: openbaton.type.VDU

    private:
      type: tosca.nodes.nfv.VL
      properties:
        vendor: Fokus
      capabilities:
        virtual_linkable:
          valid_source_types: tosca.nodes.nfv.CP

    CP1: #endpoint of VDU1
      type: tosca.nodes.nfv.CP
      properties:
      requirements:
        virtualbinding: VDU1
      virtualLink: private

    CP2: #endpoint of VDU2
      type: tosca.nodes.nfv.CP
      properties:
        floatingIp: random
      requirements:
        virtualbinding: VDU2
      virtualLink: private

relationships_template:
  connection_server_client:
    type: tosca.nodes.relationships.ConnectsTo
    source: iperf-server
    target: iperf-client
    parameters:
        - private


```

**NOTE**: Save the definition in a file called iperf-TOSCA.yaml.

To store this NSD written in TOSCA in the NFVO catalogue you need to send it to the NFVO with this curl command:

```bash
$ curl -i -X POST http://localhost:8080/api/v1/tosca -H "Content-Type: text/yaml" "Accept: application/json" --data-binary @iperf-TOSCA.yaml
```

The NFVO will answer with json translation of the NSD. 
To retrieve or to instantiate this NSD please use the Dashboard of OpenBaton in the page under the menu Catalogue > NS Descriptors.


<!------------
References
-------------->
[tosca-nfv]: http://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[ETSI-MANO]: https://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[TOSCA-simple-YAML]: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766

[iperf-TOSCA]:images/iperf.png

[vnfr-states]:vnfr-states
[vnfm-generic]: vnfm-generic
[nsd-doc]:ns-descriptor
[vnf-package]:vnfpackage
[vim-doc]:vim-instance
[iperf]:https://iperf.fr

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
