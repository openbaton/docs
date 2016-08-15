# Generic VNF Manager

The Generic VNF Manager is an implementation following the [ETSI MANO][nfv-mano] specifications. It works as intermediate component between the NFVO and the VNFs, particularly the Virtual Machines on top of which the VNF software is installed. In order to complete the lifecycle of a VNF, it interoperates with the Element Management System (EMS) acting as an agent inside the VMs and executing scripts containeed in the vnf package.
This VNFM may be assigned the management of a single VNF instance, or the management of multiple VNF instances of the same type or of different types.

The Generic VNFManager handles communication with the NFVO and with EMS. The communication NFVO ↔ VNFM ↔ EMS is done using the AMQP protocol over RabbitMQ.  

The communication between the NFVO and Generic VNFManager:

![NFVO - Generic VNFM communication][nfvo-vnfm-communication]

The communication between the Generic VNFManager and EMS:

![Generic VNFM - EMS communication][vnfm-ems-communication]

As you can see, the Generic VNFM sends commands to the EMS, which is running in the VM. Then the EMS executes the commands (scripts) locally in the VNFC. **Please note that the EMS executes those scripts as root user**.
The following sequence diagram explains the communication messages.

![Sequence Diagram NFVO - VNFM - EMS][generic-vnfm-or-vnfm-seq-dg]

The Generic VNFManager is supposed to be used for any type of VNF that follows some conventions regarding:

* VMs deployment
* Script execution costraints
* VMs termination

### VMs deployment

Accordingly to the [ETSI MANO B.3][nfv-mano-B.3] the VNF instantiation flows can be done in two ways:

1. With resource allocation done by NFVO
2. With resource allocation done by VNF Manager

The Generic VNFM follows the first approach. In the first approach two messages will be sent to the NFVO:

* **GRANT_OPERATION message**: check if the resources are available on the selected PoP. If the GRANT_OPERATION message is returned, then there are enough resources, otherwise an ERROR message will be sent. After the GRANT_OPERATION message it is possible to send the ALLOCATE_RESOURCE message.  

* **ALLOCATE_RESOURCE message**: This message ask the NFVO to create all the resources and then, if no errors occurred, the ALLOCATE_RESOURCE message will be returned to the VNFManager. Only the VNFMs which follow the first approach need to send this message.


After that point the VMs are created and **the VNF record is filled with values**, such as ips, that can be found directly in the VirtualNetworkFunctionRecord→VirtualDeploymentUnit→VNFCInstance object.

### Script Execution Costraints

For each operation of the VNF Lifecycle Management interface, the VNFManager sends scripts to the EMS which executes them locally in the VMs.

**Note**: The scripts come from the VNFPackage which you need to create (see [VNFPackage documentation][vnfpackage-doc-link]).

The ordering of this scripts is defined in the NetworkServiceDescriptor from which the NetworkServiceRecord was created, in particular into the NetworkServiceDescriptor→VirtualNetworkFunctionDescriptor→LifecycleEvents.
Here an example (to make it more readable it is shown only the **VNF lifecycle event** part):
```json
{// NSD
  ...
  {// VNFD
    ...
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
                "pre-install.sh",
                "install.sh"
            ]
        },
        {
            "event":"CONFIGURE",
            "lifecycle_events":[
                "server_configure.sh"
            ]
        },
        {
            "event":"START",
            "lifecycle_events":[
                 "server_start.sh"
            ]
        },
        {
            "event":"TERMINATE",
            "lifecycle_events":[
                 "server_terminate.sh"
            ]
        }
    ],
    ...
  }
  ...
}
```
In the following table is described for each **VNF lifecycle event** when the scripts are executed.

| VNF Lifecycle event | When scripts are executed
| ------------------- | --------------
| INSTANTIATE         |  During the instantiation of the corresponding VNF
| CONFIGURE           |  After the instantiation. Useful if the VNF depends on other VNFs, because we can get parameters provided by them (e.g. IP). The parameters are available as environment variables (see later).
| START               |  After the instantiation or configuration (It depends whether the event CONFIGURE specified).
| TERMINATE           |  During the termination of the corresponding VNF
| SCALE_IN            |  When the VNF is target of a scaled in vnfcInstance


The available parameters are defined in the VirtualNetworkFunctionDescriptor fields:

<!-- * **provides**: it contains the VMs parameters which will be available after the instantiation (e.g. IP) for other VNFs. -->
* **configurations**: it contains specific parameters which you want to use in the scripts.
* **out-of-the-box**: the following parameters are automatically available into the scripts:  
    1. Private IP
    2. Floating IP (if requested)
    3. Hostname  
Please check the example at the end of the page to understand this mechanism.

In the INSTANTIATE scripts, the parameters defined in these two fields are then available as environment variables into the script exactly as defined (i.e. you can get by $parameter_name).

In the MODIFY scripts, the INSTANTIATE parameters are still available but plus there are environment variables that come from other VNF sources, where they are specified in the provides field. 
These kind of parameters are defined in the _requires_ fields (of the VNF target) and the VNFDependency→parameters fields (of the NSD), and are then available as $*type_of_vnf_source*_*name_of_parameter* (in the VNF target).

_**NOTE**_: _the scripts in the CONFIGURE lifecycle event need to start with the type of the source VNF followed by \_ and the name of the script (i.e. server_configure.sh)_

### VMs termination

As for VMs deployment, VMs termination is done by the NFVO. Specific scripts can be run before termination by putting them under the TERMINATE lifecycle event.

## Launch the Generic VNFM

Please check also the [installation page](nfvo-installation). To launch the Generic VNFM, execute the following command:
```bash
$ cd <generic directory>
$ ./generic-vnfm.sh start
```
The Generic VNFM can handle more than one VNF (in parallel) of the same or different type, so that you need to start only one Generic VNFM.

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

[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[stomp]: https://stomp.github.io/
[nfv-mano-B.3]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf#page=108
[vnfm-ems-communication]:images/generic-vnfm-vnfm-ems-communication.png
[nfvo-vnfm-communication]: images/generic-vnfm-vnfm-or-communication.png
[generic-vnfm-or-vnfm-seq-dg]:images/generic-vnfm-or-vnfm-seq-dg.png
[ns-with-dependency]:images/generic-vnfm-ns-with-dependency.png
[vnfpackage-tutorial-link]:vnfpackage#tutorial
[vnfpackage-doc-link]:vnfpackage

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


