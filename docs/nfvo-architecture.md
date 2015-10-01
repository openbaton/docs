# NFVO Architecture

*NFVO* is a modular software composed by the modules illustrated in the following picture:

![NFVO module architecture][nfvo-architecture-full]

##### API

This module contains the necessary classes exposing APIs as ReST server. The most importat ones are the classes managing VimInstances, NetworkServiceDescriptors and NetworkServiceRecords. For more details please see [the api documentation][api]

##### MAIN

This module contains the classes charged of the startup of the whole system, gathering configuratons for instance.

##### COMMON

This module contains the classes that are common to the NFVO

##### CLI

This module contains the NFVO console.

##### DASHBOARD

This module contains the web dashboard available at localhost:8080

##### CORE-INT

This module contains the interfaces of the core functionalities regarding only the internal NFVO interfaces. Most of them are definend in [ETSI MANO specification][nfv-mano] in NFV-MANO interfaces section.

##### CORE-IMPL

This module contains the beans implementing the core-int interfaces.

##### VNFM-INT

This module contains the interfaces of the core functionalities regarding only the NFVO interfaces to the VnfManagers. Most of them are definend in [ETSI MANO specification][nfv-mano] in NFV-MANO interfaces section.

##### VNFM-IMPL

This module contains the beans implementing the vnfm-int interfaces.

##### REPOSITORY

This module contains specific repositories interfacing the database, in a generic way.

##### CATALOGUE

This module contains the complete model of NFVO that is sharde in the openbaton libraries.

##### VIM-INT

This module contains the interfaces of the core functionalities regarding only the NFVO interfaces to the VIM. Most of them are definend in [ETSI MANO specification][nfv-mano] in NFV-MANO interfaces section.

##### VIM-IMPL

This module contains the beans implementing the vim-int interfaces.

##### PLUGIN

This module contains the utility classes used to interface to the openbaton plugins.

##### VIM-DRIVERS

This module contains the interface for the VIM openbaton plugins.

##### EXCEPTION

This module contains all the exception classes common to every project containing openbaton libraries.

##### MONITORING

This module contains the interface for the Monitoring openbaton plugins.

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

[api]: linktoapi
[nfvo-architecture-full]:images/architecture-full.png
[or-vnfm-sequence]:images/or-vnfm-seq-dg.png
[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf