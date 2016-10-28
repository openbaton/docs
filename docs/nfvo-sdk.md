# NFVO Northbound SDK

A SDK is available if you want to use the NFVO from a java application.

## Import it

The build.gradle file must contain:

```gradle
repositories {
    mavenCentral()
    /**
     * Only needed for openbaton snapshots dependencies
     */
    maven {
        url 'https://oss.sonatype.org/content/repositories/snapshots/'
    }
}

dependencies {
    compile 'org.openbaton:sdk:3.3.0'
}
```

In this way you will have access to the NFVO SDK.

### And then?

The UML diagram of the classes follows:

![SDK UML][sdk-uml]

The NFVORequestor is the main and only class you need to use. From this class it is possible to retrieve all the Agents that are in charge of making calls to the NFVO. The NFVORequestor takes as constructor parameters:

| Params          	| Description       |
| -------------   	| -------------:|
| username  		| the username  |
| password 		| the password  |
| projectId		| the id of the project to use |
| sslEnabled		| set this to true if the NFVO uses SSL |
| nfvoIp 		| the ip of the NFVO      |
| nfvoPort 		| the port of the orchestrator      |
| version 		| the API version. Now only "1" is available      |

Once you have the NFVORequestor object, you can get the Agents. Available agents are:

* ConfigurationRestRequest
* EventAgent
* ImageRestAgent
* KeyAgent
* NetworkServiceDescriptorRestAgent
* NetworkServiceRecordRestAgent
* ProjectAgent
* UserAgent
* VimInstanceRestAgent
* VirtualLinkRestAgent
* VirtualNetworkFunctionDescriptorRestAgent
* VNFFGRestAgent
* VNFPackageAgent

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

### Usage example

###### Create a VimInstance using the SDK

```java
public class Main {
	
	public static void main(String[] args) {
        boolean sslEnabled = true;
        NFVORequestor nfvoRequestor = new NFVORequestor("username", "password", "projectId", sslEnabled, "nfvo_ip", "nfvo_port", "1");
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
