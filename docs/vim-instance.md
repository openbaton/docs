# Register a new Point of Presence (PoP)

The *Virtualised Infrastructure Manager* (Vim) is the functional block, responsible for controlling and managing the
 NFVI compute, storage and network resources within a Point of Presence (PoP).
 
In order to interoperate with a PoP it is required to register the VIM instance responsible for it on the NFVO. For doing that you can write a JSon file containing the details of a Vim Instance like the one described below: 


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

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the VimInstance                                                                                                                                                            |       yes |
| authUrl        | The endpoint to request the authentication                                                                                                                                             |       yes |
| tenant         | The tenant is a string to refer to a group of users                                                                                                                                    |       yes |
| username       | The name of the user recognized in OpenStack in the keystone service                                                                                                                   |       yes |
| password       | The password of the user recognized in the OpenStack in the keystone service                                                                                                           |       yes |
| keyPair        | The keyPair _name_ stored into **OpenStack** to get the access to the VMs                                                                                                              |       yes |
| securityGroups | Recognise a Security group into OpenStack where gives a sets of IP filter rules that are applied to an instance's networking.                                                          |        no |
| type           | The type of the Vim Instance that will start the corresponding plugin. Please refer to the [Marketplace][marketplace-drivers] for checking what are the current VIM drivers available. |       yes |
| location       | The location of the data Center. Name: String of the place where is the Data Center located. Latitude/Longitude geolocation point                                                      |        no |

By default we use only one tenant on your PoP. We are currently working on supporting the instantiation of different NSDs in different tenants. But it is possible to achieve this by creating two different PoPs with different names and the different tenants. 

## Register the PoP using the GUI
In order to make use of your VIM described within your JSON descriptor, you need to request the NFVO to register it. 
You can use the dashboard available at [localhost:8080] for this purpose. 
Under the menu `Manage PoPs` you can see the `PoP instances`. Click on the Register VIM button and upload your VIM descriptor. Following picture shows the dashboard: 

![register a new PoP][register-new-pop]

Once the VIM instance is registered, it will appear on the list of available PoPs, filled with the information regarding the available images, networks and flavors. At this point the VIM/PoP can be included in your Network Service Descriptors.

**_Please note that the name chosen must be unique inside the project and will be used to refer the VimInstance_.**

For more information about the dashboard see: [OpenBaton Dashboard]

## What are the supported VIM types?

By default the NFVO supports two different VIM types: 

* openstack: for interoperating with an OpenStack instance
* test: for testing purposes implementing a VIM mockup

For each of those types there is a different implementation of the VIM API. The NFVO uses a driver mechanism for interacting with VIMs. In the folders `plugins` under nfvo folder should be a jar file that implements the interface to the your VIM ( i.e. [Openstack][openstack-link] )
(you can change the folder where OpenBaton searches for the plugins by changing the variable `plugin-installation-dir` in the `openbaton.properties` file under /etc/openbaton)
This jar is the implementation of the interface that communicates with your VIM.

**Note**: You can implement your own interface just follow the documentation [Vim plugin].

## Where do I find the open source plugins?

OpenBaton platform provides an openstack and a test plugin. They are automatically download by the bootstrap. Anyway you can find them [here](http://get.openbaton.org/plugins)

[localhost:8080]:localhost:8080
[marketplace-drivers]: http://marketplace.openbaton.org:8082/#/
[OpenBaton Dashboard]:nfvo-how-to-use-gui
[OpenBaton Dashboard]:nfvo-how-to-use-gui.md
[openstack-link]:https://www.openstack.org/
[register-new-pop]:images/vim-instance-register-new-pop.png
[Vim plugin]:vim-plugin.md

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