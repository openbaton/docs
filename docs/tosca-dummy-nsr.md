#TOSCA Dummy Network Service Example

The template follows the TOSCA Simple Profile for Network Functions Virtualization (NFV) [Version 1.0][tosca-nfv]
Regarding the objects defined from ETSI please see: [ETSI GS NFV-MAN 001][ETSI-MANO]

More Information about creating TOSCA Network Service Templates in this [tutorial][ns-temp].


## Prerequisites

The prerequisites are:

* OpenBaton running
* Dummy VNFM running
*  Test plugin 
* [Vim Instance][vim-doc] stored in the Catalogue



### Complete Example


```yaml
tosca_definitions_version: tosca_1.0
description: NSDummy

metadata:
  ID: dummy-NS
  vendor: Fokus
  version: 0.1

topology_template:

  node_templates:

    dummy-server: #VNF1
        type: openbaton.type.VNF
        properties:
          vendor: Fokus
          version: 0.1
          endpoint: dummy
          type: server
          configurations:
            name: server-configurations
            configurationParameters:
              - key: value
              - key2: value2
          vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
          deployment_flavour:
            - flavour_key: m1.small
        requirements:
          - virtualLink: private
          - vdu: VDU2
        interfaces:
          lifecycle: # lifecycle
            instantiate:
              - install.sh
              - install-srv.sh

    dummy-client:
      type: openbaton.type.VNF
      properties:
        ID: x
        vendor: Fokus
        version: 0.1
        type: client
        vnfPackageLocation: https://github.com/openbaton/vnf-scripts.git
        deploymentFlavour:
          - flavour_key: m1.small
        endpoint: dummy
      requirements:
         - virtualLink: private
         - vdu: VDU1
      interfaces:
          lifecycle: # lifecycle
            INSTANTIATE:
              - install.sh
            CONFIGURE:
              - server_start-clt.sh

    VDU1:
      type: tosca.nodes.nfv.VDU
      properties:
        scale_in_out: 1
        vim_instance_name:
          - test-vim-instance

    VDU2:
      type: tosca.nodes.nfv.VDU
      properties:
        scale_in_out: 2
        vim_instance_name:
          - test-vim-instance

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
    source: dummy-server
    target: dummy-client
    parameters:
        - private


```

**NOTE**: Save the definition in a file called dummyns.yaml.

Using the API you can store the NSD written in TOSCA directly in the NFVO. You will need the dummy-vnfm and test vim instance.
 To do that follow these steps:

1) Authentication:
Run this command:
```bash
$curl -v -u openbatonOSClient:secret -X POST http://localhost:8080/oauth/token -H "Accept: application/json" -d "username=admin&password=openbaton&grant_type=password"
```
The NFVO will answer with an authetication key and a project id. You will need them to send the NSD in the next step. The response should look like this:

```bash
{
  # Authentication Key
  "value": "e8726a35-61c8-4bcb-873e-3ab6cc989f6f",
  "expiration": "Aug 30, 2016 9:14:22 PM",
  "tokenType": "bearer",
  "refreshToken": {
    "expiration": "Sep 29, 2016 9:14:22 AM",
    # Project ID
    "value": "336ca2e6-8e78-48eb-b8f8-c5de862a21da"
  },...
```
**Note: ** Do not pay attention to the project-id supplied in this response.

2) To send the NSD in the TOSCA format save the example above in a file named testNSDIperf.yaml and get the project id of your project from the Dashboard under the menu Identity > Menu. After that run this :

```bash
$curl -i -X POST http://localhost:8080/api/v1/nsd-tosca -H "Content-Type: text/yaml" "Accept: application/json" -H "project-id: $Project-ID HERE$" -H "Authorization: Bearer $AUTH KEY HERE$" --data-binary @testNSDIperf.yaml
```

The NFVO will answer with json translation of the NSD. 
To retrieve or to instantiate this NSD please use the Dashboard of OpenBaton in the page under the menu Catalogue > NS Descriptors.


<!------------
References
-------------->
[tosca-nfv]: http://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[ETSI-MANO]: https://www.etsi.org/deliver/etsi_gs/NFV-MAN/001_099/001/01.01.01_60/gs_NFV-MAN001v010101p.pdf
[TOSCA-simple-YAML]: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766

[iperf-TOSCA]:images/iperf.png

[vnfr-states]:vnfr-states
[vnfm-generic]: vnfm-generic
[nsd-doc]:ns-descriptor
[vnf-package]:vnf-package
[vim-doc]:descriptors/vim-instance/test-vim-instance.json
[dummy-NSR]:dummy-NSR
[ns-temp]:tosca-nsd

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



