# TOSCA definition

The definition follows the TOSCA Simple Profile for Network Functions Virtualization (NFV) [Version 1.0][tosca-nfv]
Regarding the objects definded from ETSI please see: [ETSI GS NFV-MAN 001][ETSI-MANO]

Premise: some of the objects are defined by OpenBaton

##  Mapping between TOSCA and ETSI NFV


| TOSCA Type          			| ETSI Entity       													|
| -------------   				| -------------:													|
| openbaton.type.VNF.GENERIC  	| Virtual Network Function Descriptor (type: GENERIC) 
| openbaton.type.VDU 			| Virtual Deployment Unit (vnfd:vdu)     	|
| tosca.nodes.nfv.VL 			| Virtual Link Descriptor     	|
| tosca.nodes.nfv.CP 			| Connection Point      	|


## Deploy a Iperf server - client TOSCA definition
Before start we should be sure that we have the NFVO and the Generic VNFM running with a [Vim Instance][vim-doc] in the catalogue.

We are going to create a NSD from TOSCA-definition that create a [iperf][iperf] scenario.

The components in the definition are these in the picture below:

![Iperf overview][iperf-TOSCA]

The yaml definition that describe all the components is this below:


```yaml
tosca_definitions_version: tosca_iperf_1_0_0
tosca_default_namespace:    # Optional. default namespace (schema, types version)
description: NSD for deploing an iperf scenario
metadata:
  ID:                 # ID of this Network Service Descriptor
  vendor: Fokus       # Provider or vendor of the Network Service
  version: 0.1 Alpha  # Version of the Network Service Descriptor
  
topology_template:
  node_templates:
    iperf-server: #VNF1
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version: 0.1
        configurations:
          name: server-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
        deployment_flavour:
          - flavour_key: m1.small
      requirements:
        - virtualLink: private
        - host:
            node: VDU2
            type: openbaton.relationships.HostedOn
      interfaces:
        Standard: # lifecycle
          create: install.sh
          start: install-srv.sh
    iperf-client:
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version: 0.1
        configurations:
          name: server-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: https://gitlab.fokus.fraunhofer.de/openbaton/scripts-test-public.git
        deployment_flavour:
          - flavour_key: m1.small
      requirements:
        - virtualLink: private
        - host:
            node: VDU1
            type: openbaton.relationships.HostedOn
      interfaces:
        openbaton.interfaces.lifecycle: # lifecycle
          INSTANCIATE:
            - install.sh
          CONFIGURE:
            - server_configure_only.sh
          START:
            - iperf_client_start.sh
    VDU1:
      type: openbaton.type.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vimInstanceName: vim-instance
      requirements:
         - virtual_link: [CP1]
      capabilities:
        host:
          valid_source_types: openbaton.type.VDU
    VDU2:
      type: openbaton.type.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 2
        vimInstanceName: vim-instance
      requirements:
        - virtual_link: [CP2]
      capabilities:
        host:
          valid_source_types: openbaton.type.VDU

    private:
      type: tosca.nodes.nfv.VL
      properties:
        vendor: Fokus
      capabilities:
        virtual_linkable:
          valid_source_types: tosca.nodes.nfv.CP

    CP1: #endpoint of VDU1
      type: tosca.nodes.nfv.CP
      properties:
      requirements:
        virtualbinding: VDU1
      virtualLink: private

    CP2: #endpoint of VDU2
      type: tosca.nodes.nfv.CP
      properties:
        floatingIp: random
      requirements:
        virtualbinding: VDU2
      virtualLink: private

relationships_templete:
  connection_server_client:
    type: tosca.nodes.relationships.ConnectsTo
    source: iperf-server
    target: iperf-client
    parameters:
        - private


```

**NOTE**: Save the definition in a file called iperf-TOSCA.yaml.

To store this NSD written in TOSCA in the NFVO catalogue you need to send it to the NFVO with this curl command:

```bash
$ curl -i -X POST http://localhost:8080/api/v1/tosca -H "Content-Type: text/yaml" "Accept: application/json" --data-binary @iperf-TOSCA.yaml
```

The NFVO will answer with json translation of the NSD. 
To retrieve or to instantiate this NSD please use the Dashboard of OpenButton in page under the menu Catalogue > NS Descriptors.


<!------------
References
-------------->
[tosca-nfv]: http://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[ETSI-MANO]: https://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf

[iperf-TOSCA]:images/iperf-TOSCA.png

[vnfr-states]:vnfr-states
[vnfm-generic]: vnfm-generic
[nsd-doc]:ns-descriptor
[vnf-package]:vnfpackage
[vim-doc]:vim-instance-documentation
[iperf]:https://iperf.fr

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