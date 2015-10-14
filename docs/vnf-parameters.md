# VNF Parameters
-----------------

The useful parameters that you can use in your scripts are defined in two different fields of a VNFD.

```json
...
"configurations":{
                "name":"config_name",
                "configurationParameters":[
                {
                    "confKey":"key1",
                    "value":"the_value"
                }
                ]
            },

...

"provides":[
	    "param1",
	    "param2"
	  ]
...
```


### Configurations

This field describe an Entity that has a list of ConfigurationParameters inside. This is a list of Entity containing key:value. This parameters are always available in your scripts. See the section below, [how to use the parameters](#How to use the parameters), in order to see how to use them.


### Provides


This field is a list of parameter keys that will be available in all your scripts. The difference is that these parameters are parameters the actual value will be known only at runtime. For that reason these parameters can only be filled by a specific VNFM. So you need to implement a VNFM able to handle these specific parameters in the fillSpecificParameters method (see [How to write a VNFM][vnfm-how-to]).

**NOTE**: _there are some out-of-the-box parameters that will be added automatically to the VNFRecord. One of this parameters is key = < network_name >, value = < actual-IP >_


### How to use the parameters

All the above parameters are available in all the scripts of the VNF that defines them. You just need to use them as environment variables, a script of the INSTANTIATE lifecycle event for instance would be:

```bash
#!/bin/bash

echo "the value of the configuration parameter key1 is $key1"
```

As described in the [Generic VNFM][vnfm-generic] page, you can set up dependency in order to use parameters from another VNF in the MODIFY lifecycle event. For doing that you need to specify in the Network Service Descriptor the VNF Dependency, for instance if a VNF vnf-1 is connected to network net1 and vnf-2 needs the ip of vnf-1 on that network the VNF Dependency will be:

```json

"vnf_dependency":[
        {
            "source" : {
                "name": "vnf-1"
            },
            "target":{
                "name": "vnf-2"
            },
            "parameters":[
                "net1"
            ]
        }
    ]

```

Done that, in the MODIFY scripts it is possible to use that ip in this way:

```bash
#!/bin/bash

echo "the value of the ip on net1 of vnf-1 is $vnf1type_net1"
```

### Conclusion

You are always able to use the parameters of a VNF simply using the key as variable name, but when you want to use a parameter of a different VNF (like a relation) you need to specify the type followed by an underscore and then the name of the foreign parameter key (for instance `$typeExt_key`). In this last case, you can use them only in the MODIFY lifecycle event scripts.

<!---
References
-->

[vnfm-how-to]: vnfm-how-to-write
[vnfm-generic]: vnfm-generic

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