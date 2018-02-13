# NFVO Northbound SDK

An SDK is available if you want to access the NFVO in your Java application.

## Import the Open Baton SDK

The Open Baton SDK artifacts are published on Maven Central. You can include them into your project by adding the following to your maven pom.xml file:

```xml
<dependency>
  <groupId>org.openbaton</groupId>
  <artifactId>sdk</artifactId>
  <version>5.1.2</version>
</dependency>
```

If you use gradle, add this to your build.gradle file:

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
  compile 'org.openbaton:sdk:5.2.0'
}
```


### Using the Open Baton SDK

The NFVORequestor is the main class of the SDK.
Objects of this class can be used to obtain various agent objects for working with the corresponding Open Baton components (e.g. Network Service Descriptors, VIM Instances, etc.).  
The NFVORequestor's constructor expects several parameters that are related to the NFVO, for example the NFVO's IP address, port and others.
The agent objects that you retrieve from the NFVORequestor make use of these arguments when communicating with the NFVO.  
You can find more information about the NFVORequestor and the different agent classes in the Javadoc.
The Open Baton SDK is thread safe.

### Usage example

###### Upload a VimInstance to the NFVO using the SDK
```java
public class Main {

  public static void main(String[] args) {
    boolean sslEnabled = true;
    String apiVersion = "1";
    // create the NFVORequestor object
    NFVORequestor requestor =
       NfvoRequestorBuilder.create()
           .nfvoIp("localhost")
           .nfvoPort(8080)
           .username("admin")
           .password("openbaton")
           .projectName("default")
           .sslEnabled(false)
           .version("1")
           .build();

    // obtain a VimInstanceAgent
    VimInstanceAgent vimInstanceAgent = nfvoRequestor.getVimInstanceAgent();

    // create the VIM Instance
    VimInstance vimInstance = new VimInstance();
    // we omitted the setting of the VIM Instance's values here...

    try {
      // upload the VIM Instance to the NFVO
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
