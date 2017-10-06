# VNF Parameters
-----------------

VNF parameters are parameters that are defined in VNFDs and that you can use in lifecycle event scripts.



### Configuration parameters

The VNFD's *configurations* field describes an entity which contains a set of configuration parameters. Configuration parameters are key-value pairs. Here is an example of a VNFD's *configurations* field:
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
```



### Out-of-the-box parameters
There are some out-of-the-box parameters that will be added automatically to the execution environment when running the scripts. These parameters are:

* The IP address of the VNF
* The floating IP address of the VNF (if it exists)
* The hostname of the VNF



### Provides parameters



The VNFD's *provides* field is not used when working with the Generic-VNFM so you can ignore them if you are not planning to use your own VNFM. The *provides* field is a list of parameter keys that will be available in all your scripts. The difference is that these parameters are parameters whose actual value will be known only at runtime. For that reason these parameters can only be filled by a specific VNFM. So you need to implement a VNFM able to handle these specific parameters in the fillSpecificParameters method (see [How to write a VNFM][vnfm-how-to]).

```
...
"provides":[
    "param1",
    "param2"
]
...
```




### How to use the parameters

All of the parameters mentioned above are available inside the lifecycle event scripts of the corresponding VNFR as environment variables. You can refer to them with their key. For example, if you defined a configuration parameter with the key *title* and the value *This is the title*, you can refer to it by writing ```$title``` inside your scripts.

The out-of-the-box parameters are a special case, since you did not specify a key for them. You can refer to them in the scripts like this:

| Out-of-the-box-parameter | Usage of variables in scripts |Value
| ------------------- | -------------- | ----
| The IP address         |  $< network_name > | The IP address of the virtual machine connected to the network
| The floating IP address         |  $< network_name >\_floatingIp | The floating IP address of the virtual machine connected to the network
| The hostname         |  $hostname | The IP address of the virtual machine connected to the network

**Note**: Sometimes it may be that the names of VNF parameters are not conform with bash environment variables. For example if a network name contains a hyphen (e.g. network-one). In those cases are the hyphens replaced by Open Baton automatically with underscores. So in you scripts you would write ```$network_one``` instead of ```$network-one```.


### How to use parameters passed through a VNF dependency
As described [here](vnf-dependencies), you can have VNF dependencies between VNFs and pass VNF parameters through these dependencies. If you want to use these parameters inside your scripts, you have to consider a few things. The VNF parameters passed through a VNF dependency are only available inside the CONFIGURE lifecycle event scripts and only if the script names start with the source VNF's type followed by an underscore. In other lifecycle events you will not be able to use them. Environment variables derived from VNF parameters passed through a VNF dependency have a special naming rule. If you have one VNF of type *server* and another VNF of type *client* and the server is the source and the client is the target of a VNF dependency passing some VNF parameters, then you have to prepend the type of the source VNF (in our case *server*) to the environment variables for referring to the VNF parameters. Here is an example:

Assume that we have the two VNFs described above, that means one of type *server* and one of type *client*. And we have a dependency between the two which passes the server's IP address and one of its configuration parameters to the client. Here is how such a dependency might look like:

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
                "netname",
                "confParam"
            ]
        }
]
...
```

Now we can use the values of the two parameters *netname* (which is the virtual link to which the server VNF is connected) and *confParam* inside of the client's CONFIGURATION lifecycle scripts.

```bash
#!/bin/bash

echo "Server IP: $server_netname"
echo "Server configuration parameter: $server_confParam"
```

**Note**: That the lifecycle script's name has to start with the source VNF's type and an underscore, in this case for example *server_configuration_script.sh*



### Conclusion

You are always able to use the parameters of a VNF simply using the key as variable name, but when you want to use a parameter of a different VNF (passed through a dependency) you need to specify the VNF type followed by an underscore and then the name of the foreign parameter key (for instance `$typeExt_key`). But be aware that you can use foreign parameters only in CONFIGURE lifecycle event scripts.

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
