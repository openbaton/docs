# Register a new PoP of type Amazon

The table below provides an explaination about the different parameters used in the PoP JSON file. 
**Please make sure you have read the [prerequisites][amazon-driver] before registering an OpenStack PoP.**

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD. **_Please note that the name chosen must be unique inside the project and will be used to refer to this particular PoP instance_.**                                                                                                                                                         |       yes |
| authUrl        |  |       yes |
| tenant         |              |       yes |
| username       |  |       yes |
| password       |  |       yes |
| keyPair        |  |       no |
| securityGroups |                                              |        no |
| type           | amazon |       yes |
| location       |                                                      |        no |


## Examples

Example for Region eu-west-1: 

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
   "type":"amazon",
   "location":{
      "name":"Berlin",
      "latitude":"52.525876",
      "longitude":"13.314400"
   }
}
```

[amazon-driver]: amazon-driver.md