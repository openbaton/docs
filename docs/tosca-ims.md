# Tutorial: OpenIMSCore Network Service Record in TOSCA
-----------------------------------------

This tutorial shows how to deploy a Network Service Record composed by 5 VNFs, a basic [OpenIMSCore][openims-website].

Compared to the [Iperf-Server - Iperf-Client](http://openbaton.github.io/documentation/iperf-NSR/) the example provided here is far more complex. So we assume you are fimiliar with the architecture.

## Requirements

In order to execute this scenario, you need to have the following components up and running: 
 
 * [NFVO]
 * [Generic VNFM](http://openbaton.github.io/documentation/vnfm-generic/)
 * [Openstack-Plugin][openstack-plugin]

## Store the VimInstance

Upload a VimInstance to the NFVO (e.g. this [VimInstance]). 
 
## Prepare the CSAR Packages

Download the necessary files from the **tosca** branch of the [github repository][openims-repo] and pack the [VNF Packages][vnf-package] for all 5 components ( scscf, icscf, pcscf, bind9, fhoss ).

#### Example for creating the Icscf Virtual Network Function Package
```bash
# Where to save the scripts
GIT_REPO_LOC=/opt/vnf_packages_example_openimscore_openbaton
# Clone the repository
git clone -b tosca https://github.com/openbaton/openimscore-packages.git $GIT_REPO_LOC
# Create the .csar file which needs to be uploaded
cd $GIT_REPO_LOC/icscf
zip -r icscf.csar . -x ".*" -x "*/.*"
```

For this example we assume the network used to interconnect the components is called "mgmt", if you want to modify this example ensure you are naming the network accordingly, the scripts from the github do not handle different network names yet. Also the vimInstanceName may be different to you, depending on your setup. The deployment_flavor is optional but should containg enough RAM for the default configuration of the components to be able to run, else some components may crash on start. This example setup has been successfuly tested on clean [Ubuntu14.04 images](https://cloud-images.ubuntu.com/) with 2048 Mb RAM deployed on an [Openstack Kilo (2015.1.3)](https://www.openstack.org/). Ensure that the image name defined in the Metadata.yaml of each package is existing.

When all 5 packages are in the CSAR format you can onboard them using the API with this command:

```bash
$curl -X POST http://your-ip-here:8080/api/v1/csar-nsd -H "Accept: application/json" -H "project-id: $Project ID here$" -H "Authorization: Bearer $Auth token here$" -v -F file=@icscf.csar
```

## Store the Network Service Descriptor

Download the following [NSD] and upload it to the NFVO either using the dashboard or the cli. 
Take care to replace the vnfd ids with the ones you deployed.

Open the Dashboard (checkout the [dashboard documentation][how-to-gui]) for more information on how to use it), open it at the URL http://your-ip-here:8080 and log in (default username and password are *admin* and *openbaton*). Go to `Catalogue -> NS Descriptors` and choose the NSD of your choice by clicking on `Upload NSD` and selecting the Descriptor's json file.

## Deploy the Network Service Descriptor 

Deploy the stored NSD either using the dashboard.

You need to go again to the GUI, go to `Catalogue -> NS Descriptors`, and open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button in order to start the deployment of this NSD.

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the deploying NSD.

## Conclusions

Once the Network Service Record went to "ACTIVE" your [OpenIMSCore][openims-website] - [Bind9](https://wiki.ubuntuusers.de/DNS-Server_Bind) - [FHoSS][openims-website] deployment is finished.

![ims-deployment][ims-struc]

To test your [OpenIMSCore][openims-website] you may use a Sip client of your choice. Be sure to use the realm defined in your [Bind9 Virtual Network Function Descriptor][bind9-vnf] while testing registration and call. By default the [FHoSS](http://www.openimscore.org/) conaints 2 users : alice and bob. The user is the same as the password, but you may also alter it to your needs modifying the [FHoSS Virtual Network Function Descriptor][openims-repo] ( You will find the users in "var_user_data.sql" file under the fhoss folder)

For Benchmarking we can use [IMS Bench SIPp](http://sipp.sourceforge.net/ims_bench/) but then you should add more users to the [FHoSS][openims-website] database since by default it only contains 2 users.

<!---
References
-->

[Dummy-VNFM]: https://github.com/openbaton/dummy-vnfm-amqp
[REST version]: https://github.com/openbaton/dummy-vnfm-rest
[vim-doc]:vim-instance-documentation
[Test Plugin]: https://github.com/openbaton/test-plugin
[NSD]: descriptors/tutorial-ims-NSR/tutorial-ims-NSR.json
[VimInstance]: descriptors/vim-instance/openstack-vim-instance.json
[NFVO]: https://github.com/openbaton/NFVO
[openstack-plugin]:https://github.com/openbaton/openstack-plugin
[bind9-vnf]: bind9/vnfd.json
[how-to-gui]:nfvo-how-to-use-gui
[openims-website]:http://www.openimscore.org

[ims-struc]:images/ims-architecture.png
[nfvo]:http://openbaton.github.io/documentation/nfvo-installation/
[vnf-package]:http://openbaton.github.io/documentation/vnfpackage/
[vnf-descriptors]:http://openbaton.github.io/documentation/vnf-descriptor/
[ns-descriptor]:http://openbaton.github.io/documentation/ns-descriptor/
[iperf-example]:./use-case-example.md
[openims-repo]:https://github.com/openbaton/openimscore-packages

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
