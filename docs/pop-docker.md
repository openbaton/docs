# Register a new PoP of type Docker

The table below provides an explaination about the different parameters used in the PoP JSON file. 
**Please make sure you have read the [prerequisites][docker-driver] before registering an OpenStack PoP.**

| Params         | Meaning                                                                                                                                                                                | Mandatory |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------:|
| name           | The name of the Point of Presence, important for later on linking it into your VNFD. **_Please note that the name chosen must be unique inside the project and will be used to refer to this particular PoP instance_.**                                                                                                                                                         |       yes |
| authUrl        | Either you pass the unix socket, in this case will use the socket running locally to the vim driver or the host connection string for remote execution  |       yes |
| tenant         | Can specify the api version used by the chosen docker engine             |       yes |
| username       | NA |       no |
| password       | NA |       no |
| keyPair        | NA |       no |
| securityGroups | NA                                             |        no |
| type           | docker |       yes |
| location       |  The location of the Point of PoP.                                  |        no |


## Examples

Example for Docker engine with APIs v1.32:


```javascript
{
  "name": "vim-instance",
  "authUrl": "unix:///var/run/docker.sock",
  "tenant": "1.32",
  "username": "admin",
  "password": "openbaton",
  "type": "docker",
  "location": {
    "name": "Berlin",
    "latitude": "52.525876",
    "longitude": "13.314400"
  }
}
```

[docker-driver]: docker-driver.md