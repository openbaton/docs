# Use my VNFM

In this section are described the REST interfaces which allow you to integrate your VNFM with Openbaton's NFVO.

NFVO - VNFM ReST interface
===============================

Nfvo exposes a ReST interface for the communication with the VnfManagers. The sequence diagram regarding the instantiation of a NetworkServiceRecord is shown in the following picture.

![NFVO - VNFM ReST interface][or-vnfm-seq]

As shown in the picture, NFVO calls some ReST methods on the vnfm in a particular order. Then it expects some kind of back call. The list of these call exchange is described in the following sections. The ALLOCATE_RESOURCES call is not needed if the vnfm will take care of creating VMs. The communication with the EMS is particular to each VnfManagers. In order to be able to be found, the Vnfm needs to register to the NFVO. This can be done through a particular call.

In the following 'Vnfm-Or' means that the Vnfm sends to the Nfvo and 'Or-Vnfm' means that the Nfvo sends to the Vnfm.

| Params          | Meaning       |
| -------------   | -------------:|
| _*OrEndpoint*_  | the endpoint of the NFVO (i.e. http://127.0.0.1:8080) |
| _*VnfmEnpoint*_ | the endpoint of the Vnfm. this is given to the nfvo while registering      |



#### Registering a Vnfm to the Nfvo (Vnfm-Or)

This call registers a vnfm to a nfvo. 

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-register
###### request body
```
{
    "type":"dummy",
    "endpointType":"REST",
    "endpoint":"VnfmEndpoint"
}
```
###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*type*_   | the vnfm type you are going to handle (specified in VirtualNetowrkFunctionDescriptor → endpoint) |
| _*endpointType*_ | the vnfm type you are going to implement (REST or JMS) |
| _*endpoint*_ | the vnfm endpoint you have chosen (basically http://<IP\>:<PORT\>) |

### INSTANTIATE (Or-Vnfm)

This call sends the Vnfm the Virtual Network Function Descriptor, which shall be used to create the Virtual Network Funtion Record and also sends to the Vnfm all the scripts which are executed in actions like INSTANTIATE, MODIFY or START. This call triggers the creation of a virtual machine for the sent vnfd and the execution of the scripts which are associated with the INSTANTIATE lifecycle event in the vnfd. 

###### request path
POST request on

_*VnfmEnpoint*_
###### request body
```
{
    "scriptsLink":"linktogit", 
    "scripts":"scriptsfiles", 
    "vnfd":{  ...  }, 
    "vnfdf":{  ...  }, 
    "vlrs":[  ...  ], 
    "extention":{  "nsr-id":"..."  }, 
    "action":"INSTANTIATE" 
}
```

In this action either the _scriptsLink_ or the _scripts_ fields are set. The vnfm-sdk will take care of them.

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*scriptsLink*_   | a link to the repository where the links are located |
| _*scripts*_ | the script files coming from the vnfPackage, in case no scriptsLink is provided |
| _*vnfd*_ | the VirtualNetworkFunctionDescriptor from which a VirtualNetworkFunctionRecord is created |
| _*vnfdf*_   | the deployment flavours to be used |
| _*vlrs*_ | the list of VirtualLinkRecords of the NetworkServiceRecord |
| _*extention*_ | some info like the NetworkServiceRecord id |
| _*action*_ | the action to be executed |

### Instantiate (Vnfm-Or)

This call sends back the created Virtual Network Function Record to the Nfvo. 

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-core-actions
###### request body
```
{
    "virtualNetworkFunctionRecord":{  ...  }, 
    "action":"INSTANTIATE"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_   | the created VirtualNetworkFunctionRecord |
| _*action*_ | the action that was executed |

### Modify (aka AddRelations) (Or-Vnfm)

The Nfvo uses this request to provide dependencies of Virtual Network Functions to the Vnfm. The scripts associated with the CONFIGURATION lifecycle event in the vnfr will be executed.

###### request path
POST request on

_*VnfmEnpoint*_
###### request body
```
{
    "vnfr":{ ... }, 
    "vnfrd":{ ... }, 
    "action":"MODIFY"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*vnfr*_   | the VirtualNetowrkFunctionRecord target of the depedendecy |
| _*vnfrd*_ | the VNFDependency containing all the source parameters needed by the scripts |
| _*action*_ | the action to be executed |


### Modify (aka AddRelations) (Vnfm-Or)

This call sends back the modified Virtual Network Function Record to the Nfvo. 

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-core-actions
###### request body

```
{
    "virtualNetworkFunctionRecord":{ ... },
    "action":"MODIFY"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_   | the VirtualNetworkFunctionRecord |
| _*action*_ | the action that was executed |

### Start (Or-Vnfm)

This call will trigger the execution of the scripts associated with the START lifecycle event in the vnfr. 

###### request path
POST request on

_*VnfmEnpoint*_
###### request body
```
{
    "vnfr":{  ...  },
    "action":"START"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*vnfr*_   |  |
| _*action*_ | the action to be executed |

### Start (Vnfm-Or)

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-core-actions
###### request body

```
{
    "virtualNetworkFunctionRecord":{  ...  },
    "action":"START"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_   | the Virtual Network Function Record |
| _*action*_ | the action that was executed |

<!---
References
-->

[or-vnfm-seq]:images/generic-vnfm-or-vnfm-seq-dg.png

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
