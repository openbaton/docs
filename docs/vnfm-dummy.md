# The Dummy VNFM

## Overview

The Dummy VNFM is a virtual network function manager which imitates the [Generic VNFM][vnfm-generic]. 
But instead of really executing the tasks given by the Orchestrator it just replies as if the request was executed successfully.
Or it returns always the same dummy data. 
For example the instantiate function of the generic VNFManager would safe scripts to the EMS and request to execute them, but the dummy VNFManager does not do that and just returns the given VirtualNetworkFunctionRecord after some time. 
In this way the communication from the NFVO to the VNFManager can be tested without deploying a real network service. 

## Installation

Clone the project to your machine. 
Navigate with a shell to the project's root folder *dummy-vnfm-amqp*. There execute the command *./gradlew clean build*. 
After that there will be a folder *dummy-vnfm-amqp/build/libs* and inside of it the executable jar file. 
Start the Dummy VNFM by executing *java -jar build/libs/dummy-vnfm-amqp-0.15-SNAPSHOT.jar*

The endpoint to use in the NSDs that should be managed by the dummy VNFManager is "dummy". 
And in the used vim file the field *type* should be set to "test", so that the [NFVO][nfvo-installation] uses the test-plugin and not for example the openstack one. 




<!---
References
-->

[vnfm-generic]:vnfm-generic
[nfvo-installation]:nfvo-installation

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
