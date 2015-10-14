# Virtual Network Function Descriptor

The VirtualNetworkFunctionDescriptor is contained inside the Network Service Descriptor (NSD). It is a json file and is defined as follows:

```json
{  
    "vendor":"fokus",
    "version":"0.2",
    "name":"iperf-server",
    "type":"server",
    "endpoint":"generic",
    "configurations":{
        "name":"config_name",
        "configurationParameters":[
        {
            "confKey":"key",
            "value":"value"
        }
        ]
    },
    "vdu":[  
        {  
            "vm_image":[  
                "ubuntu-14.04-server-cloudimg-amd64-disk1"
            ],
            "vimInstanceName":"vim-instance",
            "scale_in_out":2,
            "vnfc":[  
                {  
                    "exposed":true,
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
                "install.sh",
                "install-srv.sh"
            ]
        }
    ],
    "deployment_flavour":[  
        {  
            "flavour_key":"m1.small"
        }
    ],
    "vnfPackage":{
        "scriptsLink":"https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git"
    }
}
```

| Params          				| Meaning       																|
| -------------   				| -------------:																|
| name  						| The name to give to the VirtualNetworkFunctionDescriptor 						|
| vendor 						| The vendor creating this VirtualNetworkFunctionDescriptor      				|
| version 						| The version of the VirtualNetworkFunctionDescriptor (can be any string)      	|
| type	 						| The type of the VirtualNetworkFunctionDescriptor (can be any string) and it is used in the dependency parameters in the scripts      	|
| endpoint 						| The endpoint of the VirtualNetworkFunctionDescriptor (can be any string) needs to point to a registered VnfManager     	|


The other most important parameters are described in the following sections.

### Virtual Deploymen Unit (VDU)

| Params          				| Meaning       																|
| -------------   				| -------------:																|
| vm_image  					| The image name or id existing in the VimInstance or in the VNF Package						|
| vimInstanceName				| The VimInstance name chosen      				|
| scale_in_out					| The maximum number of instances (VMs) which can be created to support scale out/in.      	|
| vnfc	 						| Contains information that is distinct for each VNFC created based on this VDU. Basically is a list and for each element will be launched a VM. Each element (VNFC) contains the _exposed_ field (in case the machine needs to be reachable) and the list of _connection_point_ pointing to a Internal Virtual Link     	|

### Configurations

The configuration object contains a list of parameters defined by key, value that can be used in the scripts.

### Virtual Link (aka Internal Virtual Link)

The Internal Virtual Link points to a Virtual Link Descriptor defined in the Network Service Descriptor.

**Note:** at the moment there are no difference between internal and external VL. All the available networks should be specified in the NSD->VLD, than in the VNFD->VL you specify which networks you want to use.
Finally in the VNFD->VDU->VNFC->connection_point you can specify which network to attach among those available in VNFD->VL.

### Lifecycle Events

A lifecycle event is composed by an Event and a list of strings that correspond to the script names needed to be run in that particular Event.

### Deployment Flavour

A delpoyment flavour corresponds to a flavour name existing in the VimInstance.
For example if you are using Openstack as Vim, the flavour_key parameter shall correspond to a [flavour name of Openstack][openstack-flavours] (e.q. m1.small).

### VNF Package

Please see [VNF Package][vnf-package-link]. If no package is needed, then a git url is needed to download the scripts needed for this vnfd and this url is defined in the vnfpackage->scriptsLink.

<!---
References
-->

[vnf-package-link]: vnfpackage
[openstack-flavours]: http://docs.openstack.org/openstack-ops/content/flavors.html

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