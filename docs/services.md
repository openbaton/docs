# Open Baton Services

Open Baton follows a modular approach and aims to be an easily extendable platform. There are already some services extending Open Baton e.g. the [AutoScaling Engine][ase] or the [Fault Management System][fms] and new services can use the Open Baton [SDK][sdk] to facilitate the development.

For accessing the NFVO's API, a service has to have credentials. But sometimes, services have different requirements than the access with usual user credentials can provide. This is the reason for the concept of services in Open Baton. You can enable a new service and get a token. With this token it is then possible for a service to use the Open Baton SDK and issue requests in a "privileged" mode. Responses to service requests will for example contain the password of a VIM which is not shown to user requests.

## Enable a new Service
Admin users can enable a new service using the dashboard.
Roles specify to which project the service has access.
After enabling the service you can download a file containing the service token.
You can download this file only once.

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
