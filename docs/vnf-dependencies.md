# Inter-VNF dependencies

In most of the cases, network services are composed by multiple VNFs interoperating together for providing some services to end-users. Those VNFs, should be  Inter-VNF dependencies is one of the most important functions which should be handled by the NFVO while deploying network services composed by multiple VNFs. In order to better understand the problem related with inter-VNF dependencies we'll start providing a very simple example. 

Imagine a network service composed by two VNFs: VNF-A and VNF-B. 

![ns-dependency][network-service-dependency]

VNF-A provides services to VNF-B, therefore they have a dependency in which the VNF-A is the source providing information to VNF-B which is the target. Those information could be related to: 

* virtual links: the VNF-B "requires" VNF-A to provide its IPs 
* configuration parameters: the VNF-B "requires" VNF-A to provide some configuration parameters (defined in the VNFD of VNF-A) 

## VNF depenency specified at the level of a NSD

A VNF Dependency is composed by:

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| source  						| The name of the VNFD that provides one or more parameters (see [VNFManager Generic][vnfm-generic] and [VNF Parameters][vnf-parameters])|
| target 						| The name of the VNFD that requires one or more parameters	(see [VNFManager Generic][vnfm-generic] and [VNF Parameters][vnf-parameters])|
| parameters					| The name of the parameters that the *target* requires     	|

It is possible to let the Orchestrator to calculate dependencies automatically by providing some parameters in the VNF Descriptor part. Please check the [VNF Descriptor page](vnf-descriptor)

## VNF depenency specified at the level of a VNFD


### Provides

This list of parameter names defines the parameters that the VnfManager will fill at runtime. For that reason they have a meaning only if you [write your own VnfManager][vnfm-how-to]. These parameters are then available in any scripts. For the usage of the parameters, please, refer to [How to use the parameters][param-how-to] page.

### Requires

The requires field provides an alternative method for defining VNF dependencies. The regular way is to define VNF dependencies in the Network Service Descriptor by defining the source, target and parameters of the dependency. But you can also use the requires field in the VNFD to achieve the same result. Let's look at an example to understand how to do this. Here is a VNF dependency defined in the classic way. 
```json
...
"vnf_dependency":[
        {
            "source":{
                "name":"server"
            },
            "target":{
                "name":"client"
            },
            "parameters":[
                "netname_floatingIp"
            ]
        }
]
...
```

This creates a VNF dependency that provides the floating ip of the VNFD with the type server to the VNFD with the type client. 
The same can be done by writing the following in the requires field of the VNFD with type client: 

```json
...
"requires":{
	"server":{
		"parameters":["netname_floatingIp"]
	}
}
...
```

The *"server"* field specifies that the source of the dependency is the VNFD with the type server. The target is the VNFD that contains the requires field, in this case the VNFD with type client. 

## Inter-VNF dependencies - practical example (Generic VNFM)

For a more detailed example of usage of inter-VNF dependencies, you could read the following [tutorial][vnf-depenendencies-generic]


[network-service-dependency]:images/network-service-dependency.png
[vnf-dependencies-generic]:vnf-dependencies-generic

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
