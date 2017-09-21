# Register a new PoP of type test



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

