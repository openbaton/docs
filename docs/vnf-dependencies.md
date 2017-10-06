# Inter-VNF dependencies

In most cases, Network Services are composed of multiple VNFs operating together for providing a service to the end-user. For achieving this goal, it is necessary to have dependencies between the VNFs.

Here is a simple example Network Service composed of two VNFs: VNF-A and VNF-B. 

![ns-dependency][network-service-dependency]

VNF-A provides some information to VNF-B, therefore they have a dependency in which the VNF-A is the source providing information to VNF-B, which is the target. The information passed through the dependency can be of two types: 

* **Out-of-the-box information**: this type of information includes IP addresses and hostnames, their values are set out-of-the-box by Open Baton
* **Custom information**: information that is set in the *configurations* object of the VNFD

For more information on how you can use the information passed through dependencies, have a look at the page about [VNF parameters](vnf-parameters#how-to-use-the-parameters).

## VNF depenencies specified at NSD level

A VNF dependency is composed of:

| Params          				| Meaning       													|
| -------------   				| -------------:													|
| source  						| The name of the VNFD that provides one or more parameters (see [VNFManager Generic][vnfm-generic] and [VNF parameters][vnf-parameters])|
| target 						| The name of the VNFD that requires one or more parameters	(see [VNFManager Generic][vnfm-generic] and [VNF parameters][vnf-parameters])|
| parameters					| The name of the parameters that the *target* requires     	|

## VNF depenencies specified at VNFD level

### Requires

The *requires* field provides an alternative method for defining VNF dependencies. The regular way is to define VNF dependencies in the Network Service Descriptor by defining the source, target and parameters of the dependency. But you can also use the requires field in the VNFD to achieve the same result. Let's look at an example to understand how to do this. Here is a VNF dependency defined in the classic way. 
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

For a more detailed example of the usage of inter-VNF dependencies you can read the following [tutorial][vnf-dependencies-generic].


[network-service-dependency]:images/network-service-dependency.png
[vnf-dependencies-generic]:vnf-dependencies-generic
[vnfm-generic]:vnfm-generic
[vnf-parameters]:vnf-parameters
[vnfm-how-to]:vnfm-how-to-write

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
