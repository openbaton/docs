# Network Service Descriptor

The Network Service Descriptor contains the values that are defined in [ETSI MANO specification][nfv-mano]. The NFVO is able to handle JSON file describing a Network Service Descriptor.

The NFVO can also handle onboarding a Network Service Template inside a CSAR compliant with the [TOSCA Simple Profile for NFV][tosca]. Refer to the [NS Template tutorial][ns-template] and [CSAR Onboarding tutorial][csar-onboard].

 An example of the most important fields follows:

```
{  
	"name":"iperf-NSD",
    "vendor":"fokus",
    "version":"0.1-ALPHA",
    "vnfd":[  ...  ],
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

You can see a complete NSD json [here][nsd-iperf].

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| name  						| The name to give to the NetworkServiceDescriptor |
| vendor 						| The vendor creating this NetworkServiceDescriptor      	|
| version 						| The version of the NetworkServiceDescriptor (can be any string)      	|
| vnfd 							| A list of VirtualNetworkFunctionDescriptors (see [VirtualNetworkFunctionDescriptor][vnf-descriptor])      	|
| vld 							| A list of VirtualLinkDescriptors      	|
| vnf_dependency 				| A list of VNF_Dependencies (**Not mandatory**, please check the [vnfd page](vnf-descriptor) in order to understand how to get rid of it)     	|

### VirtualLinkDescriptor

The Virtual Link Descriptor (VLD) describes the basic topology of the connectivity between one or more VNFs connected to this VL.
The VLD must contain a parameter _name_ with the value of a network that will be used by the VirtualNetworkFunctionDescriptors.
If the network exists, then this network will be used, if not a new one will be created.

### VNF Dependencies

A VNF Dependency is composed by:

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| source  						| The name of the VirtualNetworkFunctionDescriptor that provides one or more parameters (see [VNFManager Generic][vnfm-generic] and [VNF Parameters][vnf-parameters])|
| target 						| The name of the VirtualNetworkFunctionDescriptor that requires one or more parameters	(see [VNFManager Generic][vnfm-generic] and [VNF Parameters][vnf-parameters])|
| parameters					| The name of the parameters that the *target* requires     	|

It is possible to let the Orchestrator to calculate dependencies automatically by providing some parameters in the VNF Descriptor part. Please check the [VNF Descriptor page](vnf-descriptor)

### Network Service Onboarding

After saving the NSD as json you could easily upload it via the [Dashboard][dashboard] or the [Command Line Interface][cli]. 

<!---
References
-->

[vnf-descriptor]:vnf-descriptor
[vnfm-generic]:vnfm-generic
[vnf-parameters]:vnf-parameters
[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[nsd-iperf]:nsd-json-example.md
[tosca]:http://docs.oasis-open.org/tosca/tosca-nfv/v1.0/csd03/tosca-nfv-v1.0-csd03.pdf
[csar-onboard]:tosca-CSAR-onboarding
[ns-template]:tosca-nsd
[dashboard]:nfvo-how-to-use-gui
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
