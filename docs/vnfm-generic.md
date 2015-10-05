# VNFManager Generic

The Generic VNFManager is an implementation following the [ETSI MANO][nfv-mano] specifications. For that reason is highly tied to the EMS.
This VNFM may be assigned the management of a single VNF instance, or the management of multiple VNF instances of the same type or of different types.

The Generic VNFManager handles communication with the NFVO and with EMS. The communication between NFVO and the EMS is done through Stomp protocol, in particular JMS.
The communication between the NFVO and Generic VNFManager:

![NFVO - Generic VNFM communication][nfvo-vnfm-communication]

The communication between the Generic VNFManager and EMS:

![Generic VNFM - EMS communication][vnfm-ems-communication]

As you can see, the Generic VNFM sends commands to the EMS, which is running in the VM. Then the EMS executes the commands (scripts) locally in the VNFC.
The following sequece diagram explains the communication messages.

![Sequence Diagram NFVO - VNFM - EMS][or-vnfm-sequence]

The Generic VNFManager is supposed to be used for any type of VNF that follows some conventions regarding:

* VMs deployment
* Script execution costraints
* VMs termination

### VMs deployment

Accordingly to the [ETSI MANO B.3][nfv-mano-B.3] the VNF instantiation flows can be done in two ways:

1. With resource allocation done by NFVO
2. With resource allocation done by VNF Manager

The Generic VNFM follow the first approach.
Before that all the VNFManagers need to request whenever the resources are available on the selected PoP.
This is done by the GRANT_OPERATION message and it is executed by all the VNFManagers.
The Generic VNFM sends the ALLOCATE_RESOURCES message as well. If the GRANT_OPERATION message is returned,
than it means that there are enough resources, if not an ERROR message will be sent. After the GRANT_OPERATION message it is possible to send the ALLOCATE_RESOURCE message.
This message will create all the resources and than, if no errors occurred, return the ALLOCATE_RESOURCE message to the VNFManager.

After that point the VMs are created and **the VNF record is filled with values**, such as ips, that can be found directly in the VirtualNetworkFunctionRecord->VirtualDeploymentUnit->VNFCInstance object.

### Script Execution Costraints

For each operation of the VNF Lifecycle Management interface, the VNFManager sends scripts to the EMS which executes them locally in the VMs.

**Note**: The scripts comes from the VNFPackage which you need to create (see [VNFPackage documentation][vnfpackage-doc-link]).

The ordering of this scripts is defined in the NetworkServiceDescriptor from which the NetworkServiceRecord was created, in particular into the NetworkServiceDescriptor->VirtualNetworkFunctionDescriptor->LifecycleEvents.
Here an example (to make it better readable it is shown only the **VNF lifecycle event** part):
```json
{
    ...
    "lifecycle_event":[
        {
            "event":"INSTANTIATE",
            "lifecycle_events":[
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
```
In the following table is described for each **VNF lifecycle event** when the scripts are executed.

| VNF Lifecycle event | When scripts are executed
| ------------------- | --------------
| INSTANTIATE         |  During the instantiation of the corresponding VNF
| CONFIGURE           |  After the instantiation. Useful if the VNF depends on other VNFs, because we can get parameters provided by them (e.g. IP). The parameters are available as environment variables (see later).
| START               |  After the instantiation or configuration (It depends whether the event CONFIGURE specified).
| TERMINATE           |  During the termination of the corresponding VNF


The available parameters are defined into the VirtualNetworkFunctionDescriptor fields:

* provides
* configurations

In the INSTANTIATE scripts, the parameters defined into these two fields are then available as environment variables into the script exactly as defined.

In the MODIFY scripts, the INSTANTIATE parameters are still available but plus there are environment variables that come from a VNFDependency.
These kind of parameters are defined into the _requires_ and the VNFDependency->parameters fields, and are then available as $*type_of_vnf_source*.*name_of_parameter*.


### VMs termination

As for VMs deployment, VMs termination is done by the NFVO. Specific scripts can be run before termination by putting them under the TERMINATE lifecycle event.

## Specify the endpoint in the VNFD and launch the Generic VNFM

To use the Generic VNFM for managing a VNF just set "generic" in the endpoint field of the VNFD.
```json
{
    ...
    "endpoint":"generic",
    ...
}
```

To launch the Generic VNFM, execute the following command:
```bash
$ cd <generic directory>
$ ./generic.sh
```

### Tutorial

See the [VNFPackage tutorial][vnfpackage-tutorial-link].


<!---
References
-->

[or-vnfm-sequence]:images/or-vnfm-seq-dg.png
[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[nfv-mano-B.3]: www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf#page=108
[vnfm-ems-communication]:images/GVNFM-EMS.jpg
[nfvo-vnfm-communication]:images/vnfm-Or_communication.png
[vnfpackage-tutorial-link]:vnfpackage.md#tutorial
[vnfpackage-doc-link]:vnfpackage.md