# Register a new Point of Presence (PoP)

The *Virtualised Infrastructure Manager* (Vim) is the functional block, responsible for controlling and managing the
 NFVI compute, storage and network resources within a Point of Presence (PoP).

In order to interoperate with a PoP it is required to register the VIM instance responsible for it to the NFVO. 
Assuming that you already installed the proper VIM driver, in order to connect to the selected Point of Presence (PoP), 
you need to register it at the NFVO. For doing that you can write a JSON file containing the details of a VIM Instance like the one described below:


```javascript
{  
   "name":"vim-instance-name",
   "authUrl":"http://127.0.0.1:5000/v2.0",
   "tenant":"tenant-name",
   "username":"username",
   "password":"password",
   "keyPair":"keypair",
   "securityGroups":[  
      "default"
   ],
   "type":"vim-driver-type",
   "location":{  
      "name":"Berlin",
      "latitude":"52.525876",
      "longitude":"13.314400"
   }
}

```

Most of the parameters are based on the OpenStack VIM type, since OpenStack represents the standard de-facto VIM in the ETSI NFV specification. 
However, there are additional VIM drivers provided, therefore refer to the actual VIM driver you are using for more details about what to fill in the JSON file:

* [openstack][openstack]
* [test][test]


## Register the PoP using the GUI

In order to make use of your VIM described within your JSON file, you need to upload the JSON file to the NFVO.
You can use the dashboard available at [localhost:8080] for this purpose.
Under the menu `Manage PoPs` you can see the `PoP instances`. Click on the Register VIM button and upload your VIM descriptor. The following picture shows the dashboard:

![register a new PoP][register-new-pop]

Once the VIM instance is registered, it will appear on the list of available PoPs, filled with the information regarding the available images, networks and flavors. At this point the VIM/PoP can be included in your Network Service Descriptors.

**_Please note that the name chosen must be unique inside the project and will be used to refer to the VimInstance_.**

For more information about the dashboard see: [OpenBaton Dashboard]


[localhost:8080]: http://localhost:8080
[marketplace-drivers]: http://marketplace.openbaton.org:80/#/
[OpenBaton Dashboard]:nfvo-how-to-use-gui
[OpenBaton Dashboard]:nfvo-how-to-use-gui.md
[openstack-link]:https://www.openstack.org/
[openstack]: pop-openstack.md
[test]: pop-test.md
[register-new-pop]:images/vim-instance-register-new-pop.png
[VIM driver]:vim-driver-create.md

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
