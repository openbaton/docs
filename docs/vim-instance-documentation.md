# Vim Instance documentation

The *Virtualised Infrastructure Manager* (Vim) it the functional block that is responsible for controlling and managing the
 NFVI compute, storage and network resources, usually within one operator's Infrastructure Domain.

In OpenBaton a Vim Instance is described by an object Json.

For working with Vim Instance in the folders `plugins` under nfvo should be a jar file that implements the interface to the your Data Center Manager ( i.e. Openstack)
(you can change the folder where the OpenBaton search the plugins just change the variable `vim-plugin-installation-dir` in the `openbaton.properties` 
file under /etc/openbaton)

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
| -------------   		| -------------:													|
| name  				| The name of the VimInstance |
| authUrl 				| The endpoint to request the authentication      	|
| tenant 				| The tenant is a string to refer to a group of users  	|
| username 				| The name of the user recognized in the Openstack in the keystone service    	|
| password 				| The password of the user recognized in the Openstack in the keystone service    	|
| keyPair 				| The keyPair name stored into Openstck to get the access to the VMs 
| securityGroups 		| Recognise a Security group into Openstack where gives a sets of IP filter rules that are applied to an instance's networking.   	|
| location 				| The location of the data Center. Name: String of the place where is the DC. Latitude/Longitude geolocation point  	|
