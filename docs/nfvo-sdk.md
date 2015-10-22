# NFVO SDK

A SDK is available if you want to use the NFVO from a java application.

### Import it

The build.gradle file must contain:

```gradle
repositories {
    mavenCentral()
    maven {
        url "http://get.openbaton.org:8081/nexus/content/groups/public"
    }
}

dependencies {
    compile 'org.openbaton:sdk:0.12'
}
```

In this way you will have access to the NFVO SDK.

### And then?

The UML diagram of the classes follows:

![SDK UML][sdk-uml]

The NFVORequestor is the main and only class you need to use. From this class it is possible to retrieve all the Agents that are in charge of making calls to the NFVO. The NFVORequestor takes as constructor parameters:

| Params          	| Meaning       |
| -------------   	| -------------:|
| username  		| the username if the security is enabled in the NFVO |
| password 			| the password if the security is enabled in the NFVO      |
| nfvo_ip 			| the ip of the NFVO      |
| nfvo_port 		| the port of the orchestrator      |
| version 			| the API version. Now only "1" is available      |

Once you have the NFVORequestor object, you can get the Agents. Available agents are:

* ConfigurationRestRequest
* EventAgent
* ImageRestAgent
* NetworkServiceDescriptorRestAgent
* NetworkServiceRecordRestAgent
* VimInstanceRestAgent
* VirtualLinkRestAgent
* VNFFGRestAgent

each of them exposes these methods:

* create
* findById
* findAll
* delete
* update

plus some specific methods and they refer to the _catalogue_ class contained in the name of the Agent. For instance, the NetworkServiceDescriptorRestAgent refers to NetworkServiceDescriptor class and, besides the above methods, exposes:

* getVirtualNetworkFunctionDescriptors
* getVirtualNetworkFunctionDescriptor
* deleteVirtualNetworkFunctionDescriptors
* createVNFD
* updateVNFD
* getVNFDependencies
* getVNFDependency
* deleteVNFDependency
* createVNFDependency
* updateVNFD
* getPhysicalNetworkFunctionDescriptors
* getPhysicalNetworkFunctionDescriptor
* deletePhysicalNetworkFunctionDescriptor
* createPhysicalNetworkFunctionDescriptor
* updatePNFD
* getSecurities
* deleteSecurity
* createSecurity
* updateSecurity

The method names are explicit, they do what the name explains.

### Use it

###### Create VimInstance

```java
public class Main {
	
	public static void main(String[] args) {
        NFVORequestor nfvoRequestor = new NFVORequestor("username","password","nfvo_ip","nfvo_port","1");
        VimInstanceRestAgent vimInstanceAgent = nfvoRequestor.getVimInstanceAgent();

        VimInstance vimInstance = new VimInstance();

        // fill the vimInstance object accordingly to your VIM chosen

        try {
            vimInstance = vimInstanceAgent.create(vimInstance);
        } catch (SDKException e) {
            e.printStackTrace();
        }

        System.out.println("Created VimInstance with id: " + vimInstance.getId());
    }
}
```

<!---
References
-->

[sdk-uml]:images/nfvo-sdk-uml.png
