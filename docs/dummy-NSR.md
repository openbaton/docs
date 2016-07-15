# Tutorial: Dummy Network Service Record
-----------------------------------------

This tutorial explains how to deploy a Network Service Record composed by Dummy VNFs. It is typically used for testing that the installation of the NFVO went fine. This tutorial makes use of: 

## Requirements

In order to execute this scenario, you need to have the following components up and running: 
 
 * [NFVO]
 * [Test plugin]
 * [Dummy-VNFM] ([REST version])

## Preparation

Before starting the NFVO we have to pass the test-plugin to it. Navigate into the root folder of the test-plugin and execute *./gradlew build*.  
After that you will find a jar file in the folder *build/libs/*.  
Move this file into the folder *plugins/vim-drivers/* in the NFVO project (create the folder if it does not exist yet). 
Then start the NFVO and the Dummy-VNFM. 

## Store the VimInstance

Upload a VimInstance with the type *test* to the NFVO (e.g. this [VimInstance]). 
The type *test* will make sure that the NFVO uses the test-plugin for network services deployed using this VimInstance.  


## Store the Network Service Descriptor 

Download the following [NSD] and upload it to the NFVO either using the dashboard or the cli. 

## Deploy the Network Service Descriptor 

Deploy the stored NSD either using the dashboard or the cli. Below you find a view from the dashboard for doing it: 

![nsr-deployment][nsr-deployment]

## Conclusions

After the Dummy-Vnfm and the NFVO finished their work the deployed NSR will change to *ACTIVE* state.  
No virtual machines were created and no real network service was deployed.  
The dummy-plugin ensured that the NFVO thought that all the required resources were allocated and the VimInstance created. 
The Dummy-Vnfm lead the NFVO to believe that it created virtual machines and executed the lifecycle event scripts on them. 

<!---
References
-->
[Dummy-VNFM]: https://github.com/openbaton/dummy-vnfm-amqp
[REST version]: https://github.com/openbaton/dummy-vnfm-rest
[vim-doc]:vim-instance-documentation
[Test Plugin]: https://github.com/openbaton/test-plugin
[NSD]: descriptors/tutorial-dummy-NSR/tutorial-dummy-NSR.json
[VimInstance]: descriptors/vim-instance/test-vim-instance.json
[nsr-deployment]: images/tutorials/tutorial-dummy-NSR/launch-NSD.png
[NFVO]: https://github.com/openbaton/NFVO


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
