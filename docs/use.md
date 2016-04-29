# How to use OpenBaton

In order to use OpenBaton for launching your first Network Service, you will need to follow these steps:

1. Register one or more Point of Presences (PoPs). [Learn more here][Register PoP]
2. Build your VNF Package
    * Decide which VNFM to use.
    * Create the VNF Package(s).
    * Prepare the Network Service Descriptor (NSD).

Once these steps are completed you will be able to orchestrate your Network Service from the dashboard or via the [REST APIs]. 


## Virtual Network Function Manager Approaches

In order to manage the Virtual Network Function(s), the NFV-MANO architectural framework expects a Virtual Network Function Manager (VNFM).
To facilitate ease of use and extensibility, the Openbaton project provides three different approaches to using a VNFM:

1. Use the Generic VNFM
2. Build a VNFM using the SDK
3. Use your own VNFM

## Main purposes of the approaches


### 1. Use the Generic VNFM

Using the generic VNFM you don't need to create a VNFM to use Openbaton.
It is called "Generic" because it may be assigned the management of a single VNF instance, or the management of VNF multiple instances of the same type or of different types.
It is already included in Openbaton as default.

Please refer to the following doc for more details: [Use the generic VNFM]

### 2. Build a VNFM using the SDK

Openbaton provides a Java SDK called vnfm-sdk which helps you to simply create a VNFM for your VNF.
Regarding the type of the communication between the NFVO and the VNFM (Or-Vnfm), you can use the vnfm-sdk-amqp or vnfm-sdk-rest, depending if you prefer to communicate with AMQP or REST.

Please refer to the following doc for more details: [Build your own VNFM]

### 3. Use your own VNFM

This approach allows you to integrate your VNFM and VNF within Openbaton. In this case, the Or-Vnfm communication will be via REST interfaces.

The three pages following describe in details these three different approaches.

Please refer to the following doc for more details: [Bring your own VNFM]

[Use the generic VNFM]:vnfm-generic
[Build your own VNFM]:vnfm-how-to-write
[Bring your own VNFM]:vnfm-vendor-specific
[Register PoP]: vim-instance
[REST APIs]: http://get.openbaton.org/api/ApiDoc.pdf

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
