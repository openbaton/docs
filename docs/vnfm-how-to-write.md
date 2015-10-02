# How to write a VNFManager

How to write a Vnfm for OpenBaton:

requirements:
* JDK 7
* vnfm-sdk lib

It is suggested to use the vnfm-sdk-jms (in case of a jms Vnfm or vnfm-sdk-rest in case of a ReST VNFManager) because it is a sdk providing already the utilities classes in charge of the communication to the NFVO and other tools. This implementation make use of [SpringBoot][spring-boot]. If you don't want this dependency than use the simple vnfm-sdk artifact, but all the communication with the NFVO needs to be implemented.

For gathering the vnfm-sdk-jms library you need that to your build.gradle:

```gradle
buildscript {
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.2.6.RELEASE")
    }
}
apply plugin: 'spring-boot'
bootRepackage {
    mainClass = 'path.to.the.vnfm.class.VNFManager'
}
apply plugin: 'java'
apply plugin: 'maven'
repositories {
    mavenCentral()
    maven {
        url "http://193.175.132.176:8081/nexus/content/groups/public"
    }
}
dependencies {
    compile 'org.openbaton:vnfm-sdk-jms:0.5-SNAPSHOT' 
}
```

In this way you will have access to all the model classes and the vnfm-sdk classes needed to implement a VNFManager. The main class of your Vnfm will be the only class needed to be implemented and this class needs to extend *AbstractVnfmSpringJMS*. This class will provide all the methods that will be called in all the instantiation process (instantiate, modify etc.).

It needs to implement as well a main methods as follows:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.openbaton.common.vnfm_sdk.jms.AbstractVnfmSpringJMS;
public class VNFManager extends AbstractVnfmSpringJMS{
	@Autowired
	private VnfmHelper vnfmHelper;
	/**
	*	implement all the methods...
	*/
	public static void main(String[] args){
		SpringApplication.run(VNFManager.class);
	}
}
```


Then just compile & run. 

```bash
$ ./gradlew clean build
$ java -jar build/libs/vnfm-manager.jar
```

There is the possibility to use the VnfmHelper. The vnfmHelper helps with some methods out of the box:

```java
package org.openbaton.common.vnfm_sdk;
import org.openbaton.catalogue.nfvo.messages.Interfaces.NFVMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
public abstract class VnfmHelper {
    protected Logger log = LoggerFactory.getLogger(this.getClass());
    public abstract void sendToNfvo(NFVMessage nfvMessage);
    public abstract NFVMessage sendAndReceive(NFVMessage nfvMessage) throws Exception;
}
```

that send messages to the NFVO and wait for the answer.
This class need to be implemented in case you want to use only the vnfm-sdk and must be provided to the AbstarctVnfm.

In any case a configuration file is needed to be in the classpath called conf.properties
```properties
type=generic
allocate = true
concurrency = 15
transacted = false
```
Where the parameters means:

| Params          				| Meaning       																|
| -------------   				| -------------:																|
| type  						| The type of VNF you are going to handle 						|
| allocate 						| true if the NFVO will ALLOCATE_RESOURCES, false if the VNFManager will do      	|
| concurrency	 						| The number of concurrent Receiver (only for vnfm-sdk-jms)|
| transacted 						| Whenever the JMS receiver method shoud be transacted, this allows the message to be resent in case of exception VNFManager side (only for vnfm-sdk-jms)     	|

Please do not forget: if you use vnfm-sdk-jms or vnfm-sdk-rest **_the VNFManager main class needs to be stateless_** since can (will) run each method potentially in parallel. For what concerns vnfm-sdk-jms, even setting concurrency to 1, will not assure to have always the same instance of the class.

<!---
References
-->

[spring-boot]: http://projects.spring.io/spring-boot/