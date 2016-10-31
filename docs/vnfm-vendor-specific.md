# Use my VNFM

In this section are described the REST interfaces which allow you to use your Virtual Network Function Manager (VNFM) with Openbaton's Network Function Virtualization Orchestrator (NFVO).

NFVO - VNFM ReST interface
===============================

The NFVO exposes a ReST interface for the communication with the VNFMs. The sequence diagram regarding the instantiation of a NetworkServiceRecord (NSR) is shown in the following picture.

![NFVO - VNFM ReST interface][or-vnfm-seq]

As shown in the picture, the NFVO calls some ReST methods on the VNFM in a particular order. Then it expects the corresponding call back. The different types of exchanges are described in the following sections. The ALLOCATE_RESOURCES call is not needed if the VNFM will take care of creating VMs. The communication with the EMS is particular to each VNFM. In order to be able to be found, the VNFM needs to register to the NFVO. This can be done through a particular registration call.

In the following 'Vnfm-Or' means that the VNFM sends to the NFVO and 'Or-Vnfm' means that the NFVO sends to the VNFM.

| Params          | Meaning       |
| -------------   | -------------:|
| _*OrEndpoint*_  | The endpoint of the NFVO (i.e. http://127.0.0.1:8080) |
| _*VnfmEnpoint*_ | The endpoint of the VNFM. This is given to the NFVO while registering      |



#### Registering a VNFM to the NFVO (Vnfm-Or)

This call registers a VNFM to an NFVO. 

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-register
###### request body
```json
{
    "type":"dummy",
    "endpointType":"REST",
    "endpoint":"VnfmEndpoint",
    "description":"MyVnfm",
    "enabled":"true"
}
```
###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*type*_   | the VNFM type you are going to handle (specified in VirtualNetworkFunctionDescriptor → endpoint) |
| _*endpointType*_ | the VNFM type you are going to implement (REST or AMQP) |
| _*endpoint*_ | the VNFM endpoint to which the NFVO will connect (basically http://<IP\>:<PORT\>) |

### INSTANTIATE (Or-Vnfm)

This call sends the Virtual Network Function Descriptor (VNFD) to the VNFM, which shall be used to create the Virtual Network Funtion Record (VNFR) and also sends to the VNFM all the scripts which are executed in actions like INSTANTIATE, MODIFY or START. This call triggers the creation of a Virtual Machine for the VNFCInstances specified in the sent VNFD and triggers the execution of the scripts which are associated with the INSTANTIATE lifecycle event in the VNFD. 

###### request path
POST request on _*VnfmEnpoint*_
###### request body
```json
{
    "vnfd":{  ...  }, 
    "vnfdf":{  ...  },
    "vlrs":[  ...  ],
    "extention":{  
      "nsr-id":"...",
      "brokerIp":"...",
      ...
    },
    "action":"INSTANTIATE",
    "vimInstances": {
      "vdu_id":[
        { ... },
        { ... }
      ]
    },
    "vnfPackage": { ... },
    "keypairs":[
    { ... }
    ]  
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*vnfd*_ | the VNFD used to create the VNFR |
| _*vnfdf*_   | the deployment flavours to be used |
| _*vlrs*_ | the list of VirtualLinkRecords of the NetworkServiceRecord |
| _*extention*_ | some info like the NetworkServiceRecord id |
| _*action*_ | the action to be executed |
| _*vimInstances*_ | a map containing per each VDU id the list of VimInstance objects |
| _*vnfPackage*_ | the VNFPackage of the VNFR |
| _*keypairs*_ | the list of additional keypairs to be added to the VM |



### GrantOperation (Vnfm-Or)

This call sends the VNFR to the NFVO in order to ask if there are enough resources

###### request path
POST request on _*OrEndpoint*_/admin/v1/vnfm-core-grant

###### request body
```json
{
    "action":"GRANT_OPERATION",
    "virtualNetworkFunctionRecord":{..}
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*action*_ | GRANT_OPERATION |
| _*virtualNetworkFunctionRecord*_ | the VNFR |

### GrantOperation (Or-Vnfm)

This call returns the NFVO's answer to the grant operation call

###### request path
POST request on _*VnfmEnpoint*_

###### request body
```json
{
    "grantAllowed": true,
    "vduVim": {
      "vdu_id": {  }
    },
    "virtualNetworkFunctionRecord":{
        ...
    }
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*grantAllowed*_ | if the NFVO has granted the allocate resources |
| _*vduVim*_ | which VIM was chosen per VDU |
| _*virtualNetworkFunctionRecord*_ | the VNFR |


### AllocateResources (Vnfm-Or)

This call sends the VNFR to the NFVO in order to allocate resources

###### request path
POST request on _*OrEndpoint*_/admin/v1/vnfm-core-allocate

###### request body
```json
{
    "virtualNetworkFunctionRecord":{..},
    "vimInstances":{
      "vdu_id":{ ... }
    },
    "userdata":"",
    "keypairs":[
 	{ ... }
    ]
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_ | the VNFR |
| _*vimInstances*_ | the chosen VIM per VDU |
| _*userdata*_ | the userdata |
| _*keypairs*_ | the keypairs to be added to the VM by the NFVO |


### AllocateResources (Or-Vnfm)

This call returns the new VNFR to the VNFM

###### request path
POST request on _*VnfmEnpoint*_

###### request body
```json
{
    "vnfr": { ... }
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_ | the updated VNFR |


### Instantiate (Vnfm-Or)

This call sends back the created Virtual Network Function Record to the NFVO. 

###### request path
POST request on _*OrEndpoint*_/admin/v1/vnfm-core-actions

###### request body
```json
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

The Nfvo uses this request to provide dependencies of Virtual Network Functions to the VNFM. The scripts associated with the CONFIGURATION lifecycle event in the VNFR will be executed.

###### request path
POST request on

_*VnfmEnpoint*_
###### request body
```json
{
    "vnfr":{ ... }, 
    "vnfrd":{ ... }, 
    "action":"MODIFY"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*vnfr*_   | the dependency's target VNFR |
| _*vnfrd*_ | the VNFDependency containing all the source parameters needed by the scripts |
| _*action*_ | the action to be executed |


### Modify (aka AddRelations) (Vnfm-Or)

This call sends back the modified Virtual Network Function Record to the NFVO. 

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-core-actions
###### request body

```json
{
    "virtualNetworkFunctionRecord":{ ... },
    "action":"MODIFY"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*virtualNetworkFunctionRecord*_   | the VNFR |
| _*action*_ | the action that was executed |

### Start (Or-Vnfm)

This call will trigger the execution of the scripts associated with the START lifecycle event in the VNFR. 

###### request path
POST request on

_*VnfmEnpoint*_
###### request body
```json
{
    "vnfr":{  ...  },
    "action":"START"
}
```

###### request structure

| Field      | Meaning    |
| ---------- | ----------:|
| _*vnfr*_   | the VNFR to start |
| _*action*_ | the action to be executed |

### Start (Vnfm-Or)

This call sends back the VNFR to the NFVO.

###### request path
POST request on

_*OrEndpoint*_/admin/v1/vnfm-core-actions
###### request body

```json
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


With this last message the VNF managed by this VNFM will be set to ACTIVE. When all the VNF are set to ACTIVE also the NSR will be set to ACTIVE and the deployment succeeded.



<!---
References
-->

[or-vnfm-seq]:images/nfvo-rest-vnfm-seq-dg.png

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
