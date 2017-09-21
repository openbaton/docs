# Register a new PoP of type OpenStack



| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD. **_Please note that the name chosen must be unique inside the project and will be used to refer to this particular PoP instance_.**                                                                                                                                                         |       yes |
| authUrl        | Keystone APIs endpoint. **NOTE:** Both _**v2**_ and _**v3**_ of the keystone APIs are supported: if you want to use v2, then you must put an url ending with "2.0" or "2". In case you are willing to use v3, then you must use "3" as suffix    |       yes |
| tenant         | The tenant name on which you plan to deploy your VNFs. **NOTE:** if you want to use v2 you must put the openstack tenant **name**, in case you are willing to use v3, you must put the tenant **id**             |       yes |
| username       | The username of your openstack account (usually good to have admin rights)                                                                                                                   |       yes |
| password       | The password of your openstack account  |       yes |
| keyPair        | The keyPair _name_ to get the access to the VMs (optional)                                                                                               |       no |
| securityGroups | Use a Security group that provides a sets of IP filtering rules that are applied to an instance's networking (mainly applicable to OpenStack)                                             |        no |
| type           | The type of the VIM Instance you are using. This information will be used by the NFVO for locating the corresponding driver. Please refer to the [Marketplace][marketplace-drivers] for checking which VIM drivers are currently available. |       yes |
| location       | The location of the Point of PoP.                                                      |        no |

By default we use only one tenant on your PoP. We are currently working on supporting the instantiation of different NSDs in different tenants. But it is possible to achieve this by creating two different PoPs with different names and the different tenants.

## Examples



