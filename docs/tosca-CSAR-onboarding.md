# TOSCA CSAR on-boarding
The Cloud Service Archive [CSAR][csar-tosca] is a package defined by OASIS TOSCA.
It is a compressed file that includes a TOSCA definition template of a Network Service, and all the scripts or files that a VNF needs for the lifecycle time from creation to termination.
The CSAR is a zip file with this structure:

```bash
├── Definitions
|   └── toscav1.yaml
├── Scripts
|   ├── install.sh
|   └── ...
└── TOSCA-Metadata
    └── TOSCA.meta
```
The TOSCA.meta file must contain the reference to the definition that will be translated in VNFs in this case **Entry-Definitions: Definitions/toscav1.yaml**

```bash
TOSCA-Meta-File-Version: 1.0
CSAR-Version: 1.1
Created-By: OASIS TOSCA TC
Entry-Definitions: Definitions/toscav1.yaml
```

The Scripts folder contains all the files required from the lifecycle interfaces of the VNFs.

The **toscav1.yaml** is a Definition of Network Service. It contains this descriptor.

```yaml

tosca_definitions_version: tosca_iperf_nsd
tosca_default_namespace:    # Optional. default namespace (schema, types version)
description: NSD for deploing an iperf scenario
metadata:
  ID:                 # ID of this Network Service Descriptor
  vendor: Fokus       # Provider or vendor of the Network Service
  version: 0.1 Alpha  # Version of the Network Service Descriptor imports:


topology_template:
  node_templates:
    iperf-server: #VNF1
      type: openbaton.type.VNF.GENERIC
      properties:
        id:
        vendor: Fokus
        version:
        configurations:
          name: server-configurations
          configurationParameters:
            - key: value
            - key2: value2
        vnfPackageLocation: 
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
        vnfPackageLocation: 
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

    CP1: #endpoint of VNF1
      type: tosca.nodes.nfv.CP
      properties:
        floatingIp: random
      requirements:
        virtualbinding: VDU1
      virtualLink: private

    CP2: #endpoint of VNF2
      type: tosca.nodes.nfv.CP
      properties:
        floatingIp: random
      requirements:
        virtualbinding: VDU2
      virtualLink: private


```

## TOSCA lifecycle interface to OpenBaton lifecycle event

In [TOSCA simple profile YAML][TOSCA-simple-yaml-lifecycle] is defined the interface *tosca.interfaces.node.lifecycle.Standard* . This interface defines the lifecycle of a service since 
OpenBaton is using different lifecycle events the mapping between these two definitions follows the rules described in the table below:

| tosca.interfaces.node.lifecycle.Standard  | openbaton.interfaces.lifecycle      |
| -----------------------------------:      | -------------------------:		|
| create 	                                | INSTANTIATE |
| configure 			                    | CONFIGURE     	|
| start 			                        | START     	|
| stop 			                            | STOP      	|
| delete 			                        | TERMINATE      	|


## CSAR on-bording

After create the CSAR with all scripts in the folder and the link to the definition, you can store this package and OpenBaton will persist all the Scripts and the VNFs inside of the definition. 
To retrieve the files you can use the dashboard in the page of VNFPackages under Catalogue menu, also you can use the page of VNF Descriptors to see the VNFs defined in **toscav1.yaml**

For on-boarding the CSAR use this command:

```bash
$ curl -X POST -v -F file=@iperf.csar "http://localhost:8080/api/v1/csar"
```


<!------------
References
-------------->
[TOSCA-simple-yaml-lifecycle]:http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766
[csar-tosca]:https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjVyb-Ll5PLAhXCDCwKHTh3AEAQFggdMAA&url=https%3A%2F%2Fwww.oasis-open.org%2Fcommittees%2Fdownload.php%2F46057%2FCSAR%2520V0-1.docx&usg=AFQjCNG-Xqjz_D4ZY8TbJGls58Hp7LdNBg&sig2=w7waCIxRy_-ODL7GyZNFUg


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
