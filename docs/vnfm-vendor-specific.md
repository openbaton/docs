# Use my VNFM

In this section are described the REST interfaces which allow you to integrate your VNFM with Openbaton's NFVO.

NFVO - VNFM ReST interface
===============================

Nfvo exposes a ReST interface for the communication with the VnfManagers. The sequence diagram regarding the instantiation of a NetworkServiceRecord is shown in the following picture.

![NFVO - VNFM ReST interface][or-vnfm-sequence]

As shown in the picture, NFVO calls some ReST methods on the vnfm in a particular order. Than it expects some kind of back call. The list of these call exchange is described in the following sections. The ALLOCATE_RESOURCES call is not needed if the vnfm will take care of creating VMs. The communication with the EMS is particular to each VnfManagers. In order to be able to be found, the Vnfm needs to register to the NFVO. This can be done through a particular call.

| Params          | Meaning       |
| -------------   | -------------:|
| _*OrEndpoint*_  | the endpoint of the NFVO (i.e. http://127.0.0.1:8080) |
| _*VnfmEnpoint*_ | the endpoint of the Vnfm. this is given while registering      |



#### Registration (Vnfm-Or):

###### path:
_*OrEndpoint*_ /admin/v1/vnfm-register
###### body:
```
{
    "type":"dummy",
    "endpointType":"REST",
    "endpoint":"VnfmEndpoint"
}
```
where:
* _type_ is the vnfm type you are going to handle (specified in VirtualNetowrkFunctionDescriptor -> endpoint).
* _endpointType_ is the vnfm type you are going to implement (REST or JMS).
* _endpoint_ is the vnfm endpoint you have chosen (basically http://<IP>:<PORT>).

### Instantiate (Or-Vnfm)

###### path
_*VnfmEnpoint*_
###### body
```
{
    "scriptsLink":"linktogit", // a link to the reposritory where the links are located
    "scripts":"scriptsfiles", // the scripts files coming from the vnfPackage, in case no scriptsLink is provided
    "vnfd":{  ...  }, // the VirtualNetowrkFunctionDescriptor from which a VirtualNetowrkFunctionRecord is created
    "vnfdf":{  ...  }, // the deployment flavours to be used
    "vlrs":[  ...  ], // the list of VirtualLinkRecords of the NetworkServiceRecord.
    "extention":{  "nsr-id":"..."  }, // some info like the NetworkServiceRecord id
    "action":"INSTANTIATE" // the action to be executed
}
```

In this action either the _scriptsLink_ or the _scripts_ fields are set. The vnfm-sdk will take care of them.

### Instantiate (Vnfm-Or)

###### path
_*OrEndpoint*_ /admin/v1/vnfm-core-actions
###### body
```
{
    "virtualNetworkFunctionRecord":{  ...  }, // the created VirtualNetowrkFunctionRecord
    "action":"INSTANTIATE"
}
```

### Modify (aka AddRelations) (Or-Vnfm)

###### path
_*VnfmEnpoint*_
###### body
```
{
    "vnfr":{  }, // the VirtualNetowrkFunctionRecord target of the depedendecy
    "vnfrd":{  }, // the VNFDependency containing all the source parameters needed by the scripts
    "action":"MODIFY"
}
```

### Modify (aka AddRelations) (Vnfm-Or)

###### path
_*VnfmEnpoint*_
###### body

```
{
    "virtualNetworkFunctionRecord":{  },
    "action":"MODIFY"
}
```

### Start (Or-Vnfm)

###### path
_*VnfmEnpoint*_
###### body
```
{
    "vnfr":{  ...  },
    "action":"START"
}
```

### Start (Vnfm-Or)

###### path
_*OrEndpoint*_ /admin/v1/vnfm-core-actions
###### body

```
{
    "virtualNetworkFunctionRecord":{  ...  },
    "action":"START"
}
```

<!---
References
-->

[or-vnfm-sequence]:images/or-vnfm-seq-dg.png
