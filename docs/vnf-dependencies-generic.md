# EXAMPLE WITH DEPENDENCY AND SCRIPTS

Let's see a simple example with two VNFs: vnf-server and vnf-database.  
The vnf-server needs the ip of the vnf-database to be able to connect properly. The following figure shows the source (vnf-database), the target (vnf-server)
and the dependency (IP). Such VNFs are connected in the same virtual network called "vnet".

![ns with dependency][ns-with-dependency]

**INSTANTIATE scripts**

To start the VNFs we'll have two scripts **instantiate-vnf-server.sh** and **instantiate-vnf-database.sh** (more scripts are possible). Here an example of the instantiate-vnf-server.sh script:
```bash
#!/bin/bash

echo "INSTANTIATIATION of the VNF server"
echo "The following parameters are available:"

echo "Out-of-the-box parameters:"
echo "Hostname: ${hostname}"
echo "Private IP: ${vnet}"
echo "Floating IP (if requested otherwise it does not exist): ${vnet_floatingIp}"

echo "Configuration parameters:"
echo "The answer to everything is.. ${ANSWER_TO_EVERYTHING}"

# ... Add the code to start the vnf_server ...
```


**CONFIGURE script**

After the instantiation of the vnf-server we would configure it with the following **database_connectToDb.sh** script:

```bash
#!/bin/bash

echo "This is the ip of the vnf-database: ${database_vnet}"
echo "This is the floating ip of the vnf-database: ${database_vnet_floatingIp}"
echo "This is the hostname of the vnf-database: ${database_hostname}"

# ... Add the code to connect to the vnf-database with the ip: ${database_vnet} ...

```

**Note1**: _database_ is the type of the vnf-database, _vnet_ is the name of the network.

**Note2**: All the scripts need to be in a repository or in the vnf package (see the vnf package structure [here][vnfpackage-doc-link]).

In order to deploy the VNFs we have to create both the VNF descriptor: **vnf-database-descriptor.json** and **vnf-server-descriptor.json**. Below we'll be showed the most relevant part of them:

**vnf-database-descriptor.json**
```json
{
    "name":"vnf-database",
    "type":"database",
    "endpoint":"generic",
    ...
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
                "instantiate-vnf-database.sh"
            ]
        }
    ],
    ...
}
```

**Note:** to use the Generic VNFM for managing a VNF just set "generic" in the endpoint field.

**vnf-server-descriptor.json**
```json
{
    "name":"vnf-server",
    "type":"server",
    "endpoint":"generic",
    ...
    "configurations":{
            "name":"config_name",
            "configurationParameters":[
            {
                "confKey":"ANSWER_TO_EVERYTHING",
                "value":"42"
            }
            ]
    },
    ...
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
                "instantiate-vnf-server.sh"
            ]
        },
        {
            "event":"CONFIGURE",
            "lifecycle_events":[
                "database_connectToDb.sh"
            ]
        }
    ],
    ...
}
```

The result network service descriptor shall include both the vnf descriptors above and the dependency:
```json
{
    "name":"simple-nsd",
    "vnfd":[
        {
            "id":"29d918b9-6245-4dc4-abc6-b7dd6e84f2c1"
        },
        {
            "id":"87820607-4048-4fad-b02b-dbcab8bb5c1c"
        }
    ],
    "vld":[
        {
            "name":"vnet"
        }
    ],
    "vnf_dependency":[
        {
            "source" : {
                "name": "vnf-database"
            },
            "target":{
                "name": "vnf-server"
            },
            "parameters":[
                "vnet"
            ]
        }
    ]
}
```
See the complete tutorial → [VNFPackage tutorial][vnfpackage-tutorial-link].

<!---
References
-->

[ns-with-dependency]:images/generic-vnfm-ns-with-dependency.png
[vnfpackage-tutorial-link]:vnf-package#tutorial
[vnfpackage-doc-link]:vnfpackage

