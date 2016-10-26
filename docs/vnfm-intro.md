## Virtual Network Function Manager Approaches

Open Baton release 3 provides three different alternatives with regard to VNF Managers:  

1. Use the Generic VNFM or Juju VNFM provided as part of the Open Baton project
2. Build a VNFM using the SDK in Java or Python
3. Use your own VNFM connecting it to the NFVO via REST APIs or AMQP

## Main purposes of the approaches

### 1. Use the Generic VNFM or Juju VNFM 

This approach allows you to start immediately focusing mainly on the implementation of the VNF Package. Both VNF Manager supports the execution of VNF Packages CSAR based (please read more [here][] for more details about VNF Packaging). 

Please refer to the following doc for more details: [Use the generic VNFM][generic] or [Use the Juju VNFM][juju]

### 2. Build a VNFM using the SDK

Openbaton provides a Java SDK called vnfm-sdk which helps you to simply create a VNFM for your VNF.
Regarding the type of the communication between the NFVO and the VNFM (Or-Vnfm), you can use the vnfm-sdk-amqp or vnfm-sdk-rest, depending if you prefer to communicate with AMQP or REST.

Please refer to the following doc for more details: [Build your own VNFM]

### 3. Use your own VNFM

This approach allows you to integrate your VNFM and VNF within Openbaton. In this case, the Or-Vnfm communication will be via REST interfaces.

The three pages following describe in details these three different approaches.

Please refer to the following doc for more details: [Bring your own VNFM]