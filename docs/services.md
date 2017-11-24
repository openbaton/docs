# Open Baton Services

Open Baton follows a modular approach and aims to be an easily extendable platform. 
There are already some services extending Open Baton e.g. the [Autoscaling Engine (ASE)][ase] or the [Fault Management System (FMS)][fms] and new services can use the Open Baton [SDK][sdk] to facilitate the development.

For accessing the NFVO's API, a service has to be authenticated and authorized.
However, the authorization process differs from the one used for users, since services have different requirements than the access with usual user credentials can provide. 
Thus, a service is an entity enabled by the administrator of the platform, and whose token granted allows modifications upon resources deployed by other users. 
Upon enablement of a new service, the NFVO provides a token, can be used via the Open Baton SDK for making requests in a "privileged" mode. 

## Enable a new Service
Only admin users can enable a new service using the dashboard.
The role specify to which project the service has access.
After enabling the service you can download a file containing the service token.
As for any private key/token, the NFVO does not maintain a copy of the file generated, thus, you can download this file only once, and you must safely store it for later usage in the configuration file of your service. 

![Enable new service][service-gif]


## Using the Open Baton SDK with the service token
The usage of the Open Baton SDK with the service token does not differ much from the [usage with user credentials][sdk].
The only difference is the constructor of the *NFVORequestor* which does not expect the user credentials but the service name and token.

Here is an example for retrieving the VIM instances of a project using the service token of a service named *testservice*.
In contrast to requests from normal users, the returned VIM instance objects will contain the password in plain text.


```java
public class Main {

  public static void main(String[] args) {
    String serviceName = "testservice";
    String projectId = "9985412a-565f-48c0-a364-c0045edce93f";
    String nfvoIp = "localhost";
    String nfvoPort = "8443";
    String apiVersion = "1";
    boolean sslEnabled = true;
    String serviceKey = "GYwXtMkLKGsauLVC";
    // create the NFVORequestor object with the service token
    NFVORequestor nfvoRequestor = new NFVORequestor(serviceName, projectId, nfvoIp, nfvoPort, apiVersion, sslEnabled, serviceKey);

    // obtain a VimInstanceAgent
    VimInstanceAgent vimInstanceAgent = nfvoRequestor.getVimInstanceAgent();

    List<VimInstance> vimInstances;
    try {
      // retrieve the VIM instances from the NFVO
      vimInstances = vimInstanceAgent.findAll();
    } catch (SDKException e) {
      e.printStackTrace();
    }
  }
}
```


<!---
References
-->

[ase]:autoscaling
[fms]:fault-management
[sdk]:nfvo-sdk
[service-gif]:images/service.gif
[sdk]:nfvo-sdk

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
