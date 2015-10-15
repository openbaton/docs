# Network Serice Descriptor

The Network Service Descriptor contains the values that are defined in [ETSI MANO specification][nfv-mano]. The NFVO is able to handle JSON file describing a Network Service Descriptor. An example of the most important fields follows:

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
        		"ip1"
      		]
    	}
    ]
}
```

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| name  						| The name to give to the NetworkServiceDescriptor |
| vendor 						| The vendor creating this NetworkServiceDescriptor      	|
| version 						| The version of the NetworkServiceDescriptor (can be any string)      	|
| vnfd 							| A list of VirtualNetworkFunctionDescriptors (see [VirtualNetworkFunctionDescriptor][vnf-descriptor])      	|
| vld 							| A list of VirtualLinkDescriptors      	|
| vnf_dependency 				| A list of VNF_Dependencies      	|

### VirtualLinkDescriptor

The Virtual Link Descriptor (VLD) describes the basic topology of the connectivity between one or more VNFs connected to this VL.
The VLD must contain a parameter _name_ with the value of a network that will be used by the VirtualNetworkFunctionDescriptors.
If the network exists, than this network will be used, if not a new one will be created.

### VNF Dependencies

A VNF Dependency is composed by 

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| source  						| The name of the VirtualNetworkFunctionDescriptor that provides one or more parameters (see [VNFManager Generic][vnfm-generic])|
| target 						| The name of the VirtualNetworkFunctionDescriptor that requires one or more parameters	(see [VNFManager Generic][vnfm-generic])|
| parameters					| The name of the parameters that the *target* requires     	|


<!---
References
-->

[vnf-descriptor]:vnf-descriptor
[vnfm-generic]:vnfm-generic
[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf

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
