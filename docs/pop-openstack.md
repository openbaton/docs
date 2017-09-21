# Register a new PoP of type OpenStack

The table below provides an explaination about the different parameters used in the PoP JSON file. 

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD. **_Please note that the name chosen must be unique inside the project and will be used to refer to this particular PoP instance_.**                                                                                                                                                         |       yes |
| authUrl        | Keystone APIs endpoint. **NOTE:** Both _**v2**_ and _**v3**_ of the keystone APIs are supported: if you want to use v2, then you must put an url ending with "2.0" or "2". In case you are willing to use v3, then you must use "3" as suffix    |       yes |
| tenant         | The tenant name on which you plan to deploy your VNFs. **NOTE:** if you want to use v2 you must put the openstack tenant **name**, in case you are willing to use v3, you must put the tenant **id**             |       yes |
| username       | The username of your openstack account (usually good to have admin rights)                                                                                                                   |       yes |
| password       | The password of your openstack account  |       yes |
| keyPair        | The keypair _name_ to get the access to the VMs (optional)                                                                                               |       no |
| securityGroups | Use a Security group that provides a sets of IP filtering rules that are applied to an instance's networking (mainly applicable to OpenStack). Usually set to default                                             |        no |
| type           | The type of the VIM Instance you are using. This information will be used by the NFVO for locating the corresponding driver. Please refer to the [Marketplace][marketplace-drivers] for checking which VIM drivers are currently available. |       yes |
| location       | The location of the Point of PoP.                                                      |        no |


## Examples

Example for Keystone V3: 

```javascript
{
   "name":"pop-1",
   "authUrl":"http://127.0.0.1:5000/v3",
   "tenant":"fae9596a144d422fa56f6f43926637de",
   "username":"admin",
   "password":"openbaton",
   "keyPair":"my-key",
   "securityGroups":[
      "default"
   ],
   "type":"openstack",
   "location":{
      "name":"Berlin",
      "latitude":"52.525876",
      "longitude":"13.314400"
   }
}
```

