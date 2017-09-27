# TOSCA CSAR on-boarding
This tutorial is more advanced and expects that you already know what TOSCA is and how Virtual Network Function Descriptor or Network Service Descriptor defined in the TOSCA format is structured.
The Cloud Service Archive [CSAR][csar-tosca] is a package defined by OASIS TOSCA. It is a compressed file that includes a TOSCA template of a Network Service, and all the scripts or files that a VNF needs for the lifecycle time from creation to termination.
The CSAR is a zip file with this structure:

```bash
├── Definitions
|   └── testNSDiperf.yaml
├── Scripts
|   ├── install.sh   
|   └── (VNF TYPE)
|        └── script.sh 
└── TOSCA-Metadata
    ├── Metadata.yaml
    └── TOSCA.meta
    
```
The CSAR reader can read both NSDs and VNFDs written in TOSCA. The difference being that when reading a NSD it will onboard all VNFs included in the NSD and after that the NSD itself.

 The **TOSCA.meta** file contains a reference to the template in this case **Entry-Definitions: Definitions/testNSDIperf.yaml** and versions of the CSAR package and the Meta-File version .

```bash
TOSCA-Meta-File-Version: 1.0
CSAR-Version: 1.1
Created-By: Fokus
Entry-Definitions: Definitions/testNSDIperf.yaml
```
The **Metadata.yaml** defines essential properties for the VNF or VNFs and every CSAR has to include one. For more information on how to create such a file refer to the [VNF Package tutorial][metadata]. This is a simple example:
```yaml
name: NSDExample
image:
    upload: false
    names:
        - ubuntu-14.04-server-cloudimg-amd64-disk1
vim_types:
    - openstack
```

The **Scripts** folder contains all the files required from the lifecycle interfaces of the VNFs.
If the CSAR has a Network Service Template, then for every type of VNF included in the NS Template you have to include a folder with the scripts for that particular type.
Example if one VNF is of type client, then the scripts for that VNF have to be put in Scripts/client folder. 


In this example **testNSDIperf.yaml** is a template for a Network Service. 
In a CSAR the template can define either a Virtual Network Function or a Network Service that consists of multiple Virtual Network Functions. 
The [VNF Tosca tutorial][tosca-vnf] and [NS Tosca tutorial][tosca-ns] provide more information on how to construct a template of each kind. 

```yaml
tosca_definitions_version: tosca_simple_profile_for_nfv_1_0
description: Example of NSD

metadata:
  ID: NSD-Iperf
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
      artifacts:
        VDU1Image:
          type: tosca.artifacts.Deployment.Image.VM
          file: ubuntu-14.04-server-cloudimg-amd64-disk1

    VDU2:
      type: tosca.nodes.nfv.VDU
      properties:
        scale_in_out: 3
      requirements:
        - virtual_link: CP2
      artifacts:
        VDU2Image:
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

## Saving as CSAR

To save the three folders - Scripts, Definitions, TOSCA-Metadata as a CSAR go to the folder where you have saved them and run:

```bash
zip -r iperf.csar . -x ".*" -x "*/.*"
```

## Onboarding VNF CSARs

Go to the Catalogue -> VNF Packages -> Upload VNFPackage, check the "Use CSAR Parser" box and select the csar that you want to upload.

![Drag&Drop modal][drag_drop] 

## Onboard Network Service CSARs

Go to the Catalogue -> NS Descriptors and click on "Upload CSAR NSD" and select the file.



<!------------
References
-------------->
[TOSCA-simple-yaml-lifecycle]:http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766
[csar-tosca]:https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjVyb-Ll5PLAhXCDCwKHTh3AEAQFggdMAA&url=https%3A%2F%2Fwww.oasis-open.org%2Fcommittees%2Fdownload.php%2F46057%2FCSAR%2520V0-1.docx&usg=AFQjCNG-Xqjz_D4ZY8TbJGls58Hp7LdNBg&sig2=w7waCIxRy_-ODL7GyZNFUg

[tosca-iperf]:tosca-iperf-scenario
[metadata]:vnf-package
[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[tosca-vnf]:tosca-vnfd
[tosca-ns]:tosca-nsd


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


