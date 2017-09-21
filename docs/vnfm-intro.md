# Virtual Network Function Manager Approaches

Open Baton release 3 provides three different alternatives with regard to VNF Managers:  

1. Use the Generic VNFM or Juju VNFM provided as part of the Open Baton project
2. Build a VNFM using the SDK in Java or Python
3. Use your own VNFM connecting it to the NFVO via REST APIs or AMQP

## Main purposes of the approaches

### 1. Use the Generic VNFM or Juju VNFM 

This approach allows you to start immediately focusing mainly on the implementation of the VNF Package. Both VNF Manager supports the execution of VNF Packages CSAR based (please read [here][tosca-csar] for more details about VNF Packaging). 

Please refer to the following docs for more details: [use the generic VNFM][generic] or [use the Juju VNFM][juju]

### 2. Build a VNFM using the SDK

We provide a set of SDKs (in Java, Go, and Python) called vnfm-sdk which helps you creating a VNFM.
Regarding the type of the communication between the NFVO and the VNFM (Or-Vnfm), you can use the vnfm-sdk-amqp or vnfm-sdk-rest, depending if you prefer to communicate with AMQP or REST.

Please refer to the following doc for more details: [build your own VNFM][vnfm-how-to]

### 3. Use your own VNFM

This approach allows you to integrate your VNFM with the NFVO. In this case, you can choose eiththe Or-Vnfm communication will be via REST interfaces.

Please refer to the following doc for more details: [bring your own VNFM][vnfm-rest]


The pages in this section describe in details these three different approaches.

[generic]: vnfm-generic
[juju]: vnfm-juju
[vnfm-how-to]: vnfm-how-to-write
[vnfm-rest]: vnfm-vendor-specific
[tosca-csar]: tosca-CSAR-onboarding
