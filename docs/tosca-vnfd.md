##TOSCA Definition

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
| tosca.nodes.nfv.VDU			| Virtual Deployment Unit (vnfd:vdu)     	|
| tosca.nodes.nfv.VL 			| Virtual Link Descriptor     	|
| tosca.nodes.nfv.CP 			| Connection Point      	|


## Deploy a VNFD TOSCA Template

We are going to create a Virtual Network Function Descriptor (VNFD) from a TOSCA-defined VNFD Template.
It has the following structure:

```yaml
tosca_definitions_version: tosca_simple_profile_for_vnf_1_0
description: Example of VNFD Template

metadata:
  ID: dummy-server
  vendor: Fokus
  version: 1.0
  
inputs: #Explained below
topology_template: #Explained below
```
| Name          		| Description       											|
| -------------   		| -------------	            | 
| tosca_definitions_version 	| The version of the template that follows it.    |
| description  	| A short description of the template.    |
| metadata  	| An Object containing metadata about the Virtual Network Function - name, version and creator.    |
| inputs  	| Explained below    |
| topology_template 	| Explained below   |


##Inputs Template

The Inputs Template consists of parameters needed for creating a Virtual Network Function Descriptor that can be added to OpenBaton. An example of how the template should look like is shown below.

```yaml
inputs:
  vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
  endpoint: dummy
  deploymentFlavour:
    - flavour_key: m1.small
  interfaces:
    lifecycle:
      INSTANTIATE :
        - install.sh
        - start-srv.sh
  configurations:
    name: server-configurations
    configurationParameters:
      - key: value
      - key2: value2
  
```
**Inputs Template** parameters: 

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| vnfPackageLocation  	| URL    | It is URL where the Orchestrator will fetch the Scripts needed in the lifecycle events defined in the **interfaces** |
| deployment_flavour  	| List of flavour_key    | It is a list flavors each one refers to Virtual hardware templates called "flavors" in OpenStack  |
| endpoint 	| String    | The VNFManager deploying the VNF itself  |
| interfaces			| See the Table below      	    | Defines the lifecycle events and the scripts needed for their execution.  |
| configurations  	    | Object with two values **name**, **configurationParameters**  | **name**: is a String with the name of the Configuration, **configurationParameters**: the list of Parameters defined by a pair of < key, value > |

The **Interfaces** for the VNF has only one option at the moment: **lifecycle**
 
For the **lifecycle** object are the following events defined in compliance with the ETSI Lifecycle Events. 

| Lifecycle event       | Value   	        | Description       											|
| -------------   		| -------------:	        | --------------:												|
| INSTANTIATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| CONFIGURE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| START  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| STOP  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| TERMINATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event|


##Topology Template

At the moment the Topology template includes only the Node Templates. 

## Node Templates

The Node Templates are the descriptions of the objects (Virtual Deployment Units, Connection Points, Virtual Links) which constitute the Virtual Network Function. Each node is defined by its name and the parameters needed to create its descriptor.

### Node Template: Virtual Deployment Unit (VDU)
This is an example of a VDU template and similar to above after that we explain briefly the components of the template.

```yaml
VDU2:
  type: tosca.nodes.nfv.VDU
  properties:
    vm_image:
      - ubuntu-14.04-server-cloudimg-amd64-disk1
    scale_in_out: 2
    vimInstanceName: vim-instance
  requirements:
    - virtual_link: CP2
```

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.VDU            |  Type of the node. In the example it defines the node as a VDU node. |
| properties 			| See the Table below    	    | Defines parameters needed for deploying a VDU    |
| requirements 			| List of requirement         | Describes the component requirements for the VDU |

The **Properties** Object of a VDU node has the following components:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| vm_image  	                | List < String >     | It is the list of images present in the OpenStack that will be used to instantiate a VNFC (aka Virtual Machine) |
| scale_in_out  	            | Integer    | Maximum value of VNFCs that can be instantiated in the process of scale-in/out |
| vimInstanceName  	            | List < String >     | Names of Points of Persistence (PoP) where this VNFC will be instantiated  |

The **Requirements** Object of a VDU node defines a list of virtual links to Connection Points. Exactly like the VNF Node the **Requirements** define a list of key-value pair, but in this case the only key is defined as follows:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| virtualLink  	        | String    | Shows where the VDU is connected |

### Node Template: Connection Point (CP)

This is an example of a CP template and similar to above after that we explain briefly the components of the template.

```yaml
CP1:
  type: tosca.nodes.nfv.CP
  properties:
    floatingIP: random
  requirements:
    virtualBinding: VDU1
    virtualLink: private

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.CP            | Type of the node. In the example it defines the node as a CP node. |
| properties: floatiIP			| String  	    | Only property defined at the moment is **floatingIP**. In this case **floatingIp** means that has a public IP chosen **random**  by OpenStack |
| requirements: virtualBinding 			| String        | It describes the requirements for the CP in the example above the CP needs a **virtualBinding** to the VDU in this case **VDU1**|
| requirements: virtualLink			| String      	    | It refers to Node Template which describes the Virtual Link in this case the Virtual Link is called **private**  |


### Node Template: Virtual Link (VL)

OpenBaton uses Virtual Link names as subnets from OpenStack.

This is the definition of VL called ```private```:

```yaml
private:
  type: tosca.nodes.nfv.VL
  properties:
    vendor: Fokus

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.VL            | It is the type of the node. In this example Virtual Link. |
| properties:vendor 			| String   	    | Information about the vendor of this VL. |


Here is a complete example of a VNFD Template in the yaml format:


```yaml
tosca_definitions_version: tosca_simple_profile_for_nfv_1_0
description: Example of VNFD Template

metadata:
  ID: dummy-server
  vendor: Fokus
  version: 0.1

inputs:
  interfaces:
    lifecycle:
      INSTANTIATE :
        - install.sh
        - start-srv.sh

  deploymentFlavour:
    - flavour_key: m1.small

  configurations:
    name: server-configurations
    configurationParameters:
      - key: value
      - key2: value2

  vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
  endpoint: dummy

topology_template:

  node_templates:

    vdu1:
      type: tosca.nodes.nfv.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 1
        vim_instance_name: vim-instance

    cp1:
      type: tosca.nodes.nfv.CP
      requirements:
        virtualBinding: vdu1
        virtualLink: private

    private:
      type: tosca.nodes.nfv.VL
      properties:
        vendor: Fokus

```

**NOTE**: Save the template in a file called server-iperf.yaml.

Using the API you can store the VNFD written in TOSCA directly in the NFVO. You will need the dummy-vnfm and test vim instance.
 To do that follow these steps:

1) Authentication:
Run this command:
```bash
$curl -v -u openbatonOSClient:secret -X POST http://localhost:8080/oauth/token -H "Accept: application/json" -d "username=admin&password=openbaton&grant_type=password"
```
The NFVO will answer with an authetication key and a project id. You will need them to send the VNFD in the next step. The response should look like this:

```bash
{
  # Authentication Key
  "value": "e8726a35-61c8-4bcb-873e-3ab6cc989f6f",
  "expiration": "Aug 30, 2016 9:14:22 PM",
  "tokenType": "bearer",
  "refreshToken": {
    "expiration": "Sep 29, 2016 9:14:22 AM",
    # Project ID
    "value": "336ca2e6-8e78-48eb-b8f8-c5de862a21da"
  },...
```
2) To add a VIM instance, save it in json format and add it using the api with the following command:

```bash
curl -i -X POST http://localhost:8080/api/v1/datacenters -H "Content-Type: application/json" "Accept: application/json" -H "project-id: $Project-ID HERE$" -H "Authorization: Bearer $AUTH KEY HERE$" --data-binary @test-vim.json
```

3) To send the VNFD in the TOSCA format run this:

```bash
$curl -i -X POST http://localhost:8080/api/v1/vnfd-tosca -H "Content-Type: text/yaml" "Accept: application/json" -H "project-id: $Project-ID HERE$" -H "Authorization: Bearer $AUTH KEY HERE$" --data-binary @server-iperf.yaml
```

The NFVO will answer with json translation of the VNFD. 
To retrieve or to instantiate this VNFD please use the Dashboard of OpenBaton in the page under the menu Catalogue > VNF Descriptors.

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


