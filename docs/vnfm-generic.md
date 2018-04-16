# Generic VNF Manager

The Generic VNF Manager is an implementation following the [ETSI MANO][nfv-mano] specifications. It works as intermediate component between the NFVO and the VNFs, particularly the Virtual Machines on top of which the VNF software is installed. In order to complete the lifecycle of a VNF, it interoperates with the Open Baton Element Management System (EMS) which acts as an agent inside the VMs and executing scripts contained in a VNF package or defined via the `scripts-link` inside the VNFD. The Generic VNFManager is capable of handling errors caused while executing these scripts. Together with the NFVO, it allows update of failed scripts, and resume NSR from the failed lifecycle state. Currently, this is applicable only for scripts contained inside VNF Packages and not for scripts referred using scripts-link.
This VNFM may be assigned to the management of a single VNF instance, or the management of multiple VNF instances of the same type or of different types.

The Generic VNFM handles communication between the NFVO and the EMS. The communication NFVO ↔ VNFM ↔ EMS is done using the AMQP protocol over RabbitMQ.  

The communication between the NFVO and Generic VNFM:

![NFVO - Generic VNFM communication][nfvo-vnfm-communication]

The communication between the Generic VNFM and EMS:

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
Here is an example (to make it more readable it shows only the **VNF lifecycle event** part):
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
                 "start.sh"
            ]
        },
        {
            "event":"STOP",
            "lifecycle_events":[
                 "stop.sh"
            ]
        },
        {
            "event":"TERMINATE",
            "lifecycle_events":[
                 "terminate.sh"
            ]
        }
    ],
    ...
  }
  ...
}
```
The following table describes for each **VNF lifecycle event** at which point in time the scripts are executed.

| VNF Lifecycle event | When scripts are executed
| ------------------- | --------------
| INSTANTIATE         |  During the instantiation of the corresponding VNF.
| CONFIGURE           |  After the instantiation. Useful if the VNF depends on other VNFs, because we can get parameters that are only available after start-up (e.g. IP addresses). The parameters are available as environment variables (see below).
| START               |  After the instantiation and configuration.
| STOP                |  During the stopping of the corresponding VNF.
| TERMINATE           |  During the termination of the corresponding VNF.
| SCALE_IN            |  When the VNF is target of a VNFC instance on which a scale in operation is performed.


You can use specific environment variables in the scripts which are set by Open Baton.
The available parameters are defined in the VirtualNetworkFunctionDescriptor fields:

<!-- * **provides**: it contains the VMs parameters which will be available after the instantiation (e.g. IP) for other VNFs. -->
* **configurations**: it contains specific parameters which you want to use in the scripts.
* **out-of-the-box**: the following parameters are automatically available in the scripts:  
    1. Private IP
    2. Floating IP (if requested)
    3. Hostname  

To learn more about the VNF parameters and how you can use them as environment variables inside you scripts, please refer to [this](vnf-parameters) page.

##### Termination of Virtual Machines

The STOP lifecycle event is meant to just stop the VNF service and afterward be able to start it again. The TERMINATE lifecycle event deletes the virtual resources from the PoP.
As for VM's deployment, VM's termination is done by the NFVO. Specific scripts can be run before termination by putting them under the TERMINATE lifecycle event.

##### Resume NetworkServiceRecord

The EMS executes scripts in the VNFCInstance for each lifecycle event. If any failure occurs while executing an erroneous script, Generic VNFManager is capable of resuming the failed NetworkServiceRecord from the last executed script. The NFVO supports update of scripts contained in the vnfpackage. Once updated, the EMS copies the script to the VNFCInstance, and the Generic VNFManager can resume execution from the failed script in the event and continue to the remaining lifecycle events.
![Sequence Diagram Generic - Resume][generic-resume-seq-dg]

<!---
References
-->

[nfv-mano]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[stomp]: https://stomp.github.io/
[nfv-mano-B.3]: http://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf#page=108
[vnfm-ems-communication]:images/generic-vnfm-vnfm-ems-communication.png
[nfvo-vnfm-communication]: images/generic-vnfm-vnfm-or-communication.png
[generic-vnfm-or-vnfm-seq-dg]:images/generic-vnfm-or-vnfm-seq-dg-v2.png
[ns-with-dependency]:images/generic-vnfm-ns-with-dependency.png
[vnfpackage-tutorial-link]:vnf-package#tutorial
[vnfpackage-doc-link]:vnf-package

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
