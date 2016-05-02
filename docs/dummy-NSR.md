# Tutorial: Dummy Network Service Record
-----------------------------------------

This tutorial explains how to deploy a Network Service Record composed by Dummy VNFs. It is typically used for testing that the installation of the NFVO went fine. This tutorial makes uses the: 
 
 * Test plugin ([test-plugin])
 * Dummy VNFM ([dummy-vnfm])

## Requirements

In order to execute this scenario, you need to have the following components up and running: 
 
 * The NFVO
 * the test plugin
 * the dummy VNFM
 * a PoP (of type test) registered. You can use the following [json descriptor][vim]

## Store the Network Service Descriptor 

Download the following [nsd] and upload it in the catalogue either using the dashboard or the cli. 

## Deploy the Network Service Descriptor 

Deploy the stored NSD either using the dashboard or the cli. Below you find a view from the dashboard for doing it: 

![nsr-deployment][nsr-deployment]

## Conclusions

When all the VNF Records are done with all of the scripts defined in the lifecycle events, the NFVO will put the state of the VNF Record to ACTIVE and when all the VNF Records are in state ACTIVE, also the Network Service Record will be in state ACTIVE. This means that the service was correctly run. 

<!---
References
-->
[dummy-vnfm]: https://github.com/openbaton/dummy-vnfm-amqp
[vim-doc]:vim-instance-documentation
[test-plugin]: https://github.com/openbaton/test-plugin
[nsd]: descriptors/tutorial-dummy-NSR/tutorial-dummy-NSR.json
[vim]: descriptors/vim-instance/test-vim-instance.json
[nsr-deployment]: images/tutorials/tutorial-dummy-NSR/launch-NSD.png


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
