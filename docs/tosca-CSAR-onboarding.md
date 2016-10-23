#TOSCA CSAR on-boarding
This tutorial is more advanced and expects that you already know what TOSCA is and how Virtual Network Function Descriptor or Network Service Descriptor defined in the TOSCA format is structured.
The Cloud Service Archive [CSAR][csar-tosca] is a package defined by OASIS TOSCA. It is a compressed file that includes a TOSCA template of a Network Service, and all the scripts or files that a VNF needs for the lifecycle time from creation to termination.
The CSAR is a zip file with this structure:

```bash
├── Definitions
|   └── testNSDiperf.yaml
├── Scripts
|   ├── install.sh
|   └── ...
└── TOSCA-Metadata
    ├── Metadata.yaml
    └── TOSCA.meta
    
```
The CSAR reader can read both NSDs and VNFDs written in TOSCA. The difference being that when reading a NSD it will onboard all VNFs included in the NSD and after that the NSD itself.

 The **TOSCA.meta** file must contain the reference to the template in this case **Entry-Definitions: Definitions/testNSDIperf.yaml**. An optional feature is to define the vm image here in the metadata. It is easier to add it here one time instead of adding it multiple times in the template.

```bash
TOSCA-Meta-File-Version: 1.0
CSAR-Version: 1.1
Created-By: OASIS TOSCA TC
Entry-Definitions: Definitions/testNSDIperf.yaml
image: ubuntu-14.04-server-cloudimg-amd64-disk1 # optional
```
The **Metadata.yaml** defines essential properties for the VNF or VNFs and every CSAR has to include one. For more information on how to create such a file refer to the [VNF Package tutorial][metadata]. This is a simple example:
```yaml
name: bind9
image:
    upload: false
    names:
        - ubuntu-14.04-server-cloudimg-amd64-disk1

```

The **Scripts** folder contains all the files required from the lifecycle interfaces of the VNFs.

The **testNSDIperf.yaml** is a Definition of Network Service. It contains this descriptor.

```yaml
tosca_definitions_version: tosca_simple_iperf_scenario
description: Example of NSD

metadata:
  ID: NSD-Iperf + Floating Ips
  vendor: Fokus
  version: 1.0

topology_template:

  node_templates:

    iperf-server: #VNF1
        type: openbaton.type.VNF
        properties:
          vendor: Fokus
          version: 1.0
          endpoint: generic
          type: server
          vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
          deploymentFlavour:
            - flavour_key: m1.small
        requirements:
          - virtualLink: private
          - vdu: VDU2
        interfaces:
          lifecycle: # lifecycle
            instantiate:
              - install.sh
              - install-srv.sh

    iperf-client:
      type: openbaton.type.VNF
      properties:
        ID: x
        vendor: Fokus
        version: 1.0
        type: client
        vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
        deploymentFlavour:
          - flavour_key: m1.small
        endpoint: generic
      requirements:
         - virtualLink: private
         - vdu: VDU1
      interfaces:
          lifecycle: # lifecycle
            INSTANTIATE:
              - install.sh
            CONFIGURE:
              - server_configure.sh

    VDU1:
      type: tosca.nodes.nfv.VDU
      properties:
        scale_in_out: 1
        vim_instance_name:
          - vim-instance
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1

    VDU2:
      type: tosca.nodes.nfv.VDU
      properties:
        vm_image:
          - ubuntu-14.04-server-cloudimg-amd64-disk1
        scale_in_out: 3
        vim_instance_name:
          - vim-instance
      requirements:
        - virtual_link: CP2
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1

    CP1:
      type: tosca.nodes.nfv.CP
      properties:
        floatingIP: random
      requirements:
        - virtualBinding: VDU1
        - virtualLink: private

    CP2: #endpoints of VNF2
      type: tosca.nodes.nfv.CP
      requirements:
        - virtualBinding: VDU2
        - virtualLink: private

    private:
      type: tosca.nodes.nfv.VL
      properties:
        vendor: Fokus

relationships_template:
  connection_server_client:
    type: tosca.nodes.relationships.ConnectsTo
    source: iperf-server
    target: iperf-client
    parameters:
        - private

```


## VNF packages from CSAR on-boarding

To create the **.csar** package from the folder run this command:
```bash
zip -r iperf.csar . -x ".*" -x "*/.*"
```
To create the  The initial steps for setting up the NFVO before sending the VNF packages are the same as for the [Iperf][tosca-iperf] example. 

For on-boarding packages in NSD format use this command:

```bash
curl -X POST http://localhost:8080/api/v1/csar-nsd -H "Accept: application/json" -H "project-id: " -H "Authorization: Bearer " -v -F file=@iperf.csar
```
For on-boarding a single VNF package use this:

```bash
curl -X POST http://localhost:8080/api/v1/csar-vnfd -H "Accept: application/json" -H "project-id: $PROJECT ID HERE$" -H "Authorization: Bearer $AUTH KEY HERE$" -v -F file=@iperf-server.csar
```



<!------------
References
-------------->
[TOSCA-simple-yaml-lifecycle]:http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766
[csar-tosca]:https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjVyb-Ll5PLAhXCDCwKHTh3AEAQFggdMAA&url=https%3A%2F%2Fwww.oasis-open.org%2Fcommittees%2Fdownload.php%2F46057%2FCSAR%2520V0-1.docx&usg=AFQjCNG-Xqjz_D4ZY8TbJGls58Hp7LdNBg&sig2=w7waCIxRy_-ODL7GyZNFUg

[tosca-iperf]:tosca-iperf-scenario
[metadata]:vnf-package


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


