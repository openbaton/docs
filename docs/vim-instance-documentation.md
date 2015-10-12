# Vim Instance documentation

The *Virtualised Infrastructure Manager* (Vim) is the functional block, responsible for controlling and managing the
 NFVI compute, storage and network resources, usually within one operator's Infrastructure Domain.

In OpenBaton a Vim Instance is described by an object Json.

For working with Vim Instance in the folders `plugins/vim-drivers/` under nfvo should be a jar file that implements the interface to the your Data Center Manager ( i.e. [Openstack] )
(you can change the folder where the OpenBaton search the plugins just change the variable `vim-plugin-installation-dir` in the `openbaton.properties` 
file under /etc/openbaton)
This jar is the implementation of the interface that communicates with your Data Center Manager.  
**Note**: You can implement your own interface just follow the documentation [Vim plugin].

The file JSON of Vim Instance allows to OpenBaton to call OpenStack and for managing the lifecycle of VMs where the VNF will be deployed and configured by OpenBaton

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
| username 				| The name of the user recognized in the OpenStack in the keystone service    	            |
| password 				| The password of the user recognized in the OpenStack in the keystone service    	                |
| keyPair 				| The keyPair name stored into OpenStack to get the access to the VMs 
| securityGroups 		| Recognise a Security group into OpenStack where gives a sets of IP filter rules that are applied to an instance's networking.   	        |
| type 		            | The type of the Vim Instance that will start the corresponding plugin 	        |
| location 				| The location of the data Center. Name: String of the place where is the Data Center located. Latitude/Longitude geolocation point  	    |


## How to register a new Vim Instance?
You can use the dashboard for sending the Json file just created.
When the OpenBaton is running for opening the **Dashboard**, please open a browser and surf to [localhost:8080]
under the menu `Manage PoPs` you can see the `PoP instances` and you can send the JSON of Vim Instance like in the picture below:

![registeraNewVim]

From now you can use your Vim instance into your Network Service Descriptors.

For know more about Dashboard you can see: [OpenBaton Dashboard]

[Vim plugin]:vim-plugin.md
[OpenBaton Dashboard]:nfvo-how-to-use-gui.md
[localhost:8080]:localhost:8080
[registeraNewVim]:images/registeraNewVim.png
[Openstack]:https://www.openstack.org/