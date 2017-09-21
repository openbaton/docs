# Register a new PoP of type test

The table below provides an explaination about the different parameters used in the PoP JSON file when using the test driver. 
Considering that the test VIM driver is just a dummy driver, in the sense that it does not instantiate any real resource, most of the parameters are not necessary. 

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD. **_Please note that the name chosen must be unique inside the project and will be used to refer to this particular PoP instance_.**                                                                                                                                                         |       yes |
| authUrl        |    |       yes |
| tenant         |    |       yes |
| username       |                                                                                                                    |       yes |
| password       | |       yes |
| keyPair        |                                                                                                |       no |
| securityGroups |                                              |        no |
| type           | |       yes |
| location       | The location of the Point of PoP.                                                      |        no |


## Examples

Example for Keystone V3: 

```javascript
{
   "name":"pop-1",
   "authUrl":"http://127.0.0.1:5000/v3",
   "tenant":"my-tenant",
   "username":"admin",
   "password":"openbaton",
   "keyPair":"my-key",
   "securityGroups":[
      "default"
   ],
   "type":"test",
   "location":{
      "name":"Berlin",
      "latitude":"52.525876",
      "longitude":"13.314400"
   }
}
```

