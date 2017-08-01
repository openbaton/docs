# Register a new Point of Presence (PoP)

The *Virtualised Infrastructure Manager* (Vim) is the functional block, responsible for controlling and managing the
 NFVI compute, storage and network resources within a Point of Presence (PoP).

In order to interoperate with a PoP it is required to register the VIM instance responsible for it to the NFVO. Assuming that you already installed the proper VIM driver, in order to connect to the selected Point of Presence (PoP), you need to register it at the NFVO. For doing that you can write a JSON file containing the details of a VIM Instance like the one described below:


```javascript
{  
   "name":"vim-instance-name",
   "authUrl":"http://192.168.0.5:5000/v2.0",
   "tenant":"tenantName",
   "username":"userName",
   "password":"password",
   "keyPair":"keyName",
   "securityGroups":[  
      "securityName"
   ],
   "type":"openstack",
   "location":{  
      "name":"Berlin",
      "latitude":"52.525876",
      "longitude":"13.314400"
   }
}

```

Most of the parameters are based on the OpenStack VIM type, since OpenStack represents the standard de-facto VIM in the ETSI NFV specification.

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD                                                                                                                                                            |       yes |
| authUrl        | The endpoint for authentication                                                                                                                                             |       yes |
| tenant         | The tenant name on which you plan to deploy your VNFs                                                                                                                                    |       yes |
| username       | The name of the user able to access your VIM via its remote APIs (usually good to have admin rights)                                                                                                                   |       yes |
| password       | The password of the user able to access your VIM via its remote APIs                                                                                                            |       yes |
| keyPair        | The keyPair _name_ to get the access to the VMs (optional - mainly applicable to OpenStack)                                                                                               |       yes |
| securityGroups | Use a Security group that provides a sets of IP filtering rules that are applied to an instance's networking (mainly applicable to OpenStack)                                             |        no |
| type           | The type of the VIM Instance you are using. This information will be used by the NFVO for locating the corresponding driver. Please refer to the [Marketplace][marketplace-drivers] for checking which VIM drivers are currently available. |       yes |
| location       | The location of the Point of PoP.                                                      |        no |

By default we use only one tenant on your PoP. We are currently working on supporting the instantiation of different NSDs in different tenants. But it is possible to achieve this by creating two different PoPs with different names and the different tenants.

**NOTE:** If you are going to use the provided _openstack_ vim driver, you can use either _**v2**_ or _**v3**_ keystone API version: if you want to use v2, then in _authUrl_ you must put an url ending with "2.0" or "2" and in the _tenant_ field you must put the openstack **tenant name**. In case you are willing to use v3, then the _authUrl_ must be finishing with "3" and in the _tenant_ field you must put **the tenant id**


## Register the PoP using the GUI

In order to make use of your VIM described within your JSON descriptor, you need to upload the VIM json file to the NFVO.
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
