# Dummy VNF Managers

The Dummy VNF Managers exist to imitate the behaviour of a real VNF Manager mainly for testing purposes.  
Deploying NSDs using a Dummy VNFM will result in no virtual machines created and no real network service deployed.  

## AMQP and REST Version

Two versions of Dummy VNF Managers exist. One using AMQP for communication with the NFVO the other one using HTTP and the NFVO's REST API.  
Here are links to the corresponding git repositories:  
[Dummy VNFM AMQP][dummy-amqp]  
[Dummy VNFM REST][dummy-rest]

To use them you have to git clone the one you want to use. 

## Starting the Dummy VNFM

Depending on which version you decided to use you have to perform slightly different steps. 

### AMQP version

This version is probably easier to use than the REST version.  
Just change into the projects root directory and execute *./dummy-vnfm.sh compile start* to compile and start the manager. 
A new screen tab running the VNFM will appear in the openbaton screen session. 

### REST version

To compile the REST version change into the project's root directory and execute *./gradlew build*.  
After that you can execute *java -jar build/libs/rest-vnfm-versionHere.jar* to start the VNFM. 

**Note:** The REST version does not support SSL so it will not work with an NFVO that is using SSL. 

### Further reading

You can find a tutorial on how to deploy a dummy network service using a Dummy VNFM [here].

<!---
References
-->

[dummy-amqp]: https://github.com/openbaton/dummy-vnfm-amqp
[dummy-rest]: https://github.com/openbaton/dummy-vnfm-rest
[here]: dummy-NSR


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

