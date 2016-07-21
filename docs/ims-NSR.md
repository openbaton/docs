# Tutorial: OpenIMSCore Network Service Record
-----------------------------------------

This tutorial shows how to deploy a Network Service Record composed by 5 VNFs, a basic OpenIMSCore.

Compared to the [Iperf-Server - Iperf-Client](http://openbaton.github.io/documentation/iperf-NSR/) the example provided here is far more complex. So we assume you are fimiliar with the architecture.

## Requirements

In order to execute this scenario, you need to have the following components up and running: 
 
 * [NFVO]
 * [Generic VNFM](http://openbaton.github.io/documentation/vnfm-generic/)

## Store the VimInstance

Upload a VimInstance to the NFVO (e.g. this [VimInstance]). 
 
## Prepare the VNF Packages

Download the necessary [files][vnf-package] from the [github repository][openims-repo], pack the [VNF Packages](http://openbaton.github.io/documentation/vnfpackage/) and onboard the packages.

## Store the Network Service Descriptor

Download the following [NSD] and upload it to the NFVO either using the dashboard or the cli. 

## Deploy the Network Service Descriptor 

Deploy the stored NSD either using the dashboard or the cli.

## Conclusions

Once the Network Service Record went to "ACTIVE" your [OpenIMSCore](http://www.openimscore.org/) - [Bind9](https://wiki.ubuntuusers.de/DNS-Server_Bind) - [FHoSS](http://www.openimscore.org/) deployment is finished.

![ims-deployment][ims-struc]

To test your [OpenIMSCore](http://www.openimscore.org/) you may use a Sip client of your choice. Be sure to use the realm defined in your [Bind9 Virtual Network Function Descriptor](https://github.com/openbaton/opemimscore_example/bind9) while testing registration and call. By default the [FHoSS](http://www.openimscore.org/) conaints 2 users : alice and bob. The user is the same as the password, but you may also alter it to your needs modifying the [FHoSS Virtual Network Function Descriptor][openims-repo] ( You will find the users in "var_user_data.sql" file under the fhoss folder)

For Benchmarking we can use [IMS Bench SIPp](http://sipp.sourceforge.net/ims_bench/) but then you should add more users to the [FHoSS](http://www.openimscore.org/) database since by default it only contains 2 users.

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
