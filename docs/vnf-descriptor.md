# Virtual Network Function Descriptor

The VirtualNetworkFunctionDescriptor is contained inside the Network Service Descriptor (NSD). It is defined as follows:

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
| vm_image  					| The list of image names or ids existing in the VimInstance or in the VNF Package						|
| vimInstanceName				| The VimInstance name chosen      				|
| scale_in_out					| The maximum number of VMs that this VNFD can reach if scaling is enabled      	|
| vnfc	 						| the minimum number of VMs that will be deployed for this VNFD. It contains the _exposed_ field, in case the machine needs to be reachable, and the list of _connection_point_ pointing to a Internal Virtual Link     	|

### Configurations

The configuration object contains a list of parameters defined by key, value that can be used in the scripts.

### Virtual Link (aka Internal Virtual Link)

The Internal Virtual Link points to a Virtual Link Descriptor defined in the Network Service Descriptor.

### Lifecycle Events

A lifecycle event is composed by an Event and a list of strings that correspond to the script names needed to be run in that particular Event.

### Deployment Flavour

A delpoyment flavour corresponds to a flavour name existing in the VimInstance.
It defines a set of constraints (e.q. calls per second) and provides the VDU(s) which meet those constraint.

### VNF Package

Please see [VNF Package][vnf-package-link]. If no package is needed, then a git url is needed to download the scripts needed for this vnfd and this url is defined in the vnfpackage->scriptsLink.

<!---
References
-->

[vnf-package-link]: vnfpackage

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