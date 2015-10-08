# Vim Instance documentation

The *Virtualised Infrastructure Manager* (Vim) is the functional block, responsible for controlling and managing the
 NFVI compute, storage and network resources, usually within one operator's Infrastructure Domain.

In order to interoperate with a NFVI it is required to register the VIM instance inside the NFVO. 

The JSON file of a Vim Instance allows OpenBaton to call OpenStack, to manage the lifecycle of VMs and tells where the VNF will be deployed and configured by OpenBaton

The Json looks like

```javascript
{
  "name":"vim-instance",
  "authUrl":"http://192.168.41.45:5000/v2.0",
  "tenant":"tenantName",
  "username":"userName",
  "password":"pass",
  "keyPair":"keyName",
  "securityGroups": [
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


| Params          		| Meaning       													|
| -------------   		| -------------:													            |
| name  				| The name of the VimInstance |
| authUrl 				| The endpoint to request the authentication      	                        |
| tenant 				| The tenant is a string to refer to a group of users  	                    |
| username 				| The name of the user recognized in OpenStack in the keystone service    	            |
| password 				| The password of the user recognized in the OpenStack in the keystone service    	                |
| keyPair 				| The keyPair name stored into OpenStack to get the access to the VMs 
| securityGroups 		| Recognise a Security group into OpenStack where gives a sets of IP filter rules that are applied to an instance's networking.   	        |
| type 		            | The type of the Vim Instance that will start the corresponding plugin 	        |
| location 				| The location of the data Center. Name: String of the place where is the Data Center located. Latitude/Longitude geolocation point  	    |


## How to register a new Vim Instance?
In order to make use of your VIM described within your JSON descriptor, you need to request the NFVO to register it. 
You can use the dashboard available at [localhost:8080] for this purpose. 
Under the menu `Manage PoPs` you can see the `PoP instances`. Click on the Register VIM button and upload your VIM descriptor. Following picture shows the dashboard: 

![dialog][registeraNewVim]

Once the VIM instance is registered, it will appear on the list of available PoPs. At this point the VIM/PoP can be included in your Network Service Descriptors.

For more information about the dashboard see: [OpenBaton Dashboard]


## How to register a new Vim Instance?

By default the NFVO supports two different VIM types: 

* OpenStack: for interoperating with an OpenStack instance
* Test: for testing purposes implementing a VIM mockup

In particular, this is due to the fact that for working with VIMs the NFVO uses a plugin mechanism. In the folders `plugins` under nfvo folder should be a jar file that implements the interface to the your VIM ( i.e. [Openstack][openstack-link] )
(you can change the folder where OpenBaton searches for the plugins by changing the variable `vim-plugin-installation-dir` in the `openbaton.properties` 
file under /etc/openbaton)


[OpenBaton Dashboard]:nfvo-how-to-use-gui
[localhost:8080]:localhost:8080
[registeraNewVim]:images/registeraNewVim.png
[openstack-link]:https://www.openstack.org/

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