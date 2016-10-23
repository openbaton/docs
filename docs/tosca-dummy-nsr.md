#TOSCA

The definition follows the TOSCA Simple Profile for Network Functions Virtualization (NFV) [Version 1.0][tosca-nfv]
Regarding the objects defined from ETSI please see: [ETSI GS NFV-MAN 001][ETSI-MANO]

Premise: some of the objects are defined by OpenBaton

## Prerequisites

The prerequisites are:

* OpenBaton running
* Dummy VNFM running
*  Test plugin 
* [Vim Instance][vim-doc] stored in the Catalogue


##  Mapping between TOSCA and ETSI NFV


| TOSCA Type          			| ETSI Entity       													|
| -------------   				| -------------:													|
| openbaton.type.VNF  	| Virtual Network Function Descriptor 
| tosca.nodes.nfv.VDU			| Virtual Deployment Unit (vnfd:vdu)     	|
| tosca.nodes.nfv.VL 			| Virtual Link Descriptor     	|
| tosca.nodes.nfv.CP 			| Connection Point      	|


## Deploy a NSD TOSCA Template

We are going to create a NSD from TOSCA-defined NSD Template that creates an dummy scenario, similiar to the one explained [here][dummy-NSR].

The Template has the following structure: 

```yaml
tosca_definitions_version: tosca_simple_iperf_scenario
description: Example of NSD

metadata:
  ID: dummy-NS
  vendor: Fokus
  version: 0.1

topology_template: #Explained below
relationships_template: #Explained below
```

| Name          		| Description       											|
| -------------   		| -------------	            | 
| tosca_definitions_version 	| The version of the template that follows it.    |
| description  	| A short description of the template.    |
| metadata  	| An Object containing metadata about the Network Service - name, version and creator.    |
| relationships_template  	| Explained below    |
| topology_template 	| Explained below   |

##Topology Template

For now the Topology template includes only the Node Templates. 

## Node Templates

The Node Templates are the description of the objects which constitute the Network Service Descriptor. Each node is defined by its name and the parameters needed to create its descriptor.

### Node Template: Virtual Network Function (VNF)

This is an example of VNF Template defined inside the NSD Template. The parameters available and needed to create a Virtual Network Function Descriptor are defined and explained below: 

```yaml
dummy-server: #VNF1
        type: openbaton.type.VNF
        properties:
          vendor: Fokus
          version: 0.1
          endpoint: dummy
          type: server
          configurations:
            name: config_name
            configurationParameters:
              - key: value
              - key2: value2
          vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
          deploymentFlavour:
            - flavour_key: m1.small
        requirements:
          - virtualLink: private
          - vdu: VDU2
        interfaces:
          lifecycle: # lifecycle
            instantiate:
              - install.sh
              - start-srv.sh
```

This Virtual Network Function is called ```iperf-server``` 

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | openbaton.type.VNF    | Type of the node. In the example it defines the node as a VNF node. |
| properties 			| See the Table below    	    | Defines parameters needed for deploying a VNFD    |
| requirements 			| See the Table below           | Describes the component requirements for the VNF |
| interfaces			| See the Table below      	    | Defines the lifecycle events and the scripts needed for their execution.  |


The **Properties** for the VNF are:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| vendor  	            | String    | Name of the provider of the VNF |
| version  	            | String     | Version of the provider of the VNF  |
| configurations  	    | Object with two values **name**, **configurationParameters**  | **name**: is a String with the name of the Configuration, **configurationParameters**: the list of Parameters defined by a pair of < key, value > |
| vnfPackageLocation  	| URL    | It is URL where the Orchestrator will fetch the Scripts needed in the lifecycle events defined in the **interfaces** |
| deploymentFlavour  	| List of flavour_key    | It is a list flavors each one refers to Virtual hardware templates called "flavors" in OpenStack  |
| endpoint 	| String    | The VNFManager deploying the VNF itself  |

The **Requirements** for the VNF is an object containing a list of String key-value pairs and the keys are defined the following way:

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| virtualLink  	        | String    | Shows where the VNF is connected |
| vdu  	            | String    | Defines a VDU which is a part of the VNF |

The **Interfaces** for the VNF has only one option at the moment: **lifecycle**
 
For the **lifecycle** object are the following events defined in compliance with the ETSI Lifecycle Events. 

| Lifecycle event       | Value   	        | Description       											|
| -------------   		| -------------:	        | --------------:												|
| INSTANTIATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| CONFIGURE  	        | List of Script files      | The Scripts will be called for this Lifecycle event |
| START  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| STOP  	            | List of Script files      | The Scripts will be called for this Lifecycle event|
| TERMINATE  	        | List of Script files      | The Scripts will be called for this Lifecycle event|

### Node Template: Virtual Deployment Unit (VDU)
This is an example of a VDU template and similar to above after that we explain briefly the components of the template.

```yaml
VDU2:
      type: tosca.nodes.nfv.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vim_instance_name:
          - test-vim-instance
      requirements:
        - virtual_link: CP2
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1
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
| vim_instance_name  	            | List < String >     | Names of Points of Persistence (PoP) where this VNFC will be instantiated  |

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
    - virtualBinding: VDU1
    - virtualLink: private

```

| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.nfv.CP            | Type of the node. In the example it defines the node as a CP node. |
| properties: floatiIP			| String  	    | Only property defined at the moment is **floatingIP**. In this case **floatingIp** means that has a public IP chosen **random**  by OpenStack |
| requirements: virtualBinding                  | String        | It describes the requirements for the CP in the example above the CP needs a **virtualBinding** to the VDU in this case **VDU1**. The bindings can be multiple hence the requirements is a node.|
| requirements: virtualLink                     | String            | It refers to Node Template which describes the Virtual Link in this case the Virtual Link is called **private**. Same applies here regarding requirements being a list.  |



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



### Relationships Template
The Relationships Template creates the dependency between two VNFs.
This is the definition of Relationships Template called ```connection_server_client```:

```yaml

relationships_template:
  connection_server_client:
    type: tosca.nodes.relationships.ConnectsTo
    source: dummy-server
    target: dummy-client
    parameters:
        - private

```
| Name          		| Value   	                    | Description       											|
| -------------   		| -------------:	            | --------------:												|
| type  	            | tosca.nodes.relationships.ConnectsTo           | It is the type of the Relationships Template |
| source 			    | String   	    | It is a String which refers to the Node Template that describes the source VNF that provides some parameters in order to realize the dependency with the target VNF|
| target 			    | String   	    | It is a String which refers to the Node Template that describes the target VNF that requires some parameters in order to realize the dependency with the source VNF |
| parameters 			| List < String >      	    | List of parameters for this dependency |


**NOTE**: Whenever a value of a given parameter is a string, it is best to put it in quotation marks. Example : 

```yaml
configurations:
    name: server-configurations
    configurationParameters:
      - key: "value"

```

### Complete Example


```yaml
tosca_definitions_version: tosca_simple_dummy_nsd
description: Example of NSD

metadata:
  ID: dummy-NS
  vendor: Fokus
  version: 0.1

topology_template:

  node_templates:

    dummy-server: #VNF1
        type: openbaton.type.VNF
        properties:
          vendor: Fokus
          version: 0.1
          endpoint: dummy
          type: server
          configurations:
            name: server-configurations
            configurationParameters:
              - key: value
              - key2: value2
          vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
          deployment_flavour:
            - flavour_key: m1.small
            - flavour_key: m1.large
        requirements:
          - virtualLink: private
          - vdu: VDU2
        interfaces:
          lifecycle: # lifecycle
            instantiate:
              - install.sh
              - install-srv.sh

    dummy-client:
      type: openbaton.type.VNF
      properties:
        ID: x
        vendor: Fokus
        version: 0.1
        type: client
        vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
        deploymentFlavour:
          - flavour_key: m1.small
        endpoint: dummy
      requirements:
         - virtualLink: private
         - vdu: VDU1
      interfaces:
          lifecycle: # lifecycle
            INSTANTIATE:
              - install.sh
            CONFIGURE:
              - server_start-clt.sh

    VDU1:
      type: tosca.nodes.nfv.VDU
      properties:
        scale_in_out: 1
        vim_instance_name:
          - test-vim-instance
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1

    VDU2:
      type: tosca.nodes.nfv.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vim_instance_name:
          - test-vim-instance
      requirements:
        - virtual_link: CP2
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1

    CP1:
      type: tosca.nodes.nfv.CP
      properties:
        floatingIP: random
      requirements:
        - virtualBinding: VDU1
        - virtualLink: private

    CP2: #endpoints of VNF2
      type: tosca.nodes.nfv.CP
      requirements:
        - virtualBinding: VDU2
        - virtualLink: private

    private:
      type: tosca.nodes.nfv.VL
      properties:
        vendor: Fokus

relationships_template:
  connection_server_client: 
    type: tosca.nodes.relationships.ConnectsTo
    source: dummy-server
    target: dummy-client
    parameters:
        - private


```

**NOTE**: Save the definition in a file called testNSDIperf.yaml.

Using the API you can store the NSD written in TOSCA directly in the NFVO. You will need the dummy-vnfm and test vim instance.
 To do that follow these steps:

1) Authentication:
Run this command:
```bash
$curl -v -u openbatonOSClient:secret -X POST http://localhost:8080/oauth/token -H "Accept: application/json" -d "username=admin&password=openbaton&grant_type=password"
```
The NFVO will answer with an authetication key and a project id. You will need them to send the NSD in the next step. The response should look like this:

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
**Note: ** Do not pay attention to the project-id supplied in this response.

2) To send the NSD in the TOSCA format save the example above in a file named testNSDIperf.yaml and get the project id of your project from the Dashboard under the menu Identity > Menu. After that run this :

```bash
$curl -i -X POST http://localhost:8080/api/v1/nsd-tosca -H "Content-Type: text/yaml" "Accept: application/json" -H "project-id: $Project-ID HERE$" -H "Authorization: Bearer $AUTH KEY HERE$" --data-binary @testNSDIperf.yaml
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
[vnf-package]:vnf-package
[vim-doc]:descriptors/vim-instance/test-vim-instance.json
[dummy-NSR]:dummy-NSR

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



