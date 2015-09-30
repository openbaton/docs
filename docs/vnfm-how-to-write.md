How to write a VNFManager
=========================

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
import org.openbaton.common.vnfm_sdk.jms.AbstractVnfmSpringJMS;

public class VNFManager extends AbstractVnfmSpringJMS{
	
	/**
	*	implement all the methods...
	*/

	public static void main(String[] args){
		SpringApplication.run(VNFManager.class);
	}
}
```

<!---
References
-->

[spring-boot]: http://projects.spring.io/spring-boot/