# Virtual Network Function Manager Approaches

In order to manage the Virtual Network Function\s, the NFV-MANO architectural framework expects a Virtual Network Function Manager (VNFM).
To facilitate ease of use and extensibility, the Openbaton project provides three different approaches to using a VNFM:

1. Use the Generic VNFM
2. Build a VNFM using the SDK
3. Use your own VNFM

## Main purposes of the approaches
### 1. Use the Generic VNFM

Using the generic VNFM you don't need to create a VNFM to use Openbaton.
It is called "Generic" Because may be assigned the management of a single VNF instance, or the management of VNF multiple instances of the same type or of different types.
It is already included in Openbaton as default.

### 2. Build a VNFM using the SDK

Openbaton provides a sdk called vnfm-sdk which help you to simple create a VNFM for your VNF.
Regarding the type of the communication between the NFVO and the VNFM (Or-Vnfm), you can use the vnfm-sdk-jms or vnfm-sdk-rest, depending if you prefer to communicate with JMS or REST.

### 3. Use your own VNFM

This approach allow you to integrate your VNFM and VNF within Openbaton. In this case, the Or-Vnfm communication will be via REST interfaces.