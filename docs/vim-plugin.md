# Create Vim Plugin

OpenBaton is an open source project providing a reference implementation of the NFVO and VNFM based on the ETSI specification, is implemented in java using the spring.io framework. It consists of two main components: a NFVO and a generic VNFM. This project plugin-sdk contains modules that are needed to implement a plugin for OpenBaton system.

## How does this works?
An OpenBaton Plugin is a RMI Server that connects to the NFVO or any other rmiregistry with access to the OpenBaton catalogue as codebase. It offers an implementation of an interface that is used by NFVO. by default NFVO starts a rmiregistry at localhost:1099.

In order to create a VIM plugin for OpenBaton system you need to add to your gradle build file:

```java
buildscript {
    repositories {
        mavenLocal()
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.2.6.RELEASE")
    }
}

repositories {
    maven { url "http://193.175.132.176:8081/nexus/content/groups/public/" }
}

apply plugin: 'java'
apply plugin: 'maven'
apply plugin: 'spring-boot'

project.ext{

}
mainClassName = 'org.myplugin.example.Starter'


dependencies {
    compile 'org.openbaton:plugin-sdk:0.6'
    compile'org.springframework:spring-context:4.2.1.RELEASE'
}

version '0.1'


```

Than create a class that implement ClientInterfaces and the inherited methods. 


```JAVA
package org.myplugin.example;

import org.openbaton.catalogue.mano.common.DeploymentFlavour;
import org.openbaton.catalogue.nfvo.*;
import org.openbaton.vim.drivers.exceptions.VimDriverException;
import org.openbaton.vim.drivers.interfaces.ClientInterfaces;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Scope("prototype")
public class MyVim implements ClientInterfaces {


    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public Server launchInstance(VimInstance vimInstance, String name, String image, String flavor, String keypair, Set<String> network, Set<String> secGroup, String userData) throws RemoteException {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getType(VimInstance vimInstance) {
        return "MyVim";
    }
    
    @Override
    public List<NFVImage> listImages(VimInstance vimInstance) {
        ArrayList<NFVImage> nfvImages = new ArrayList<>();
        NFVImage image = new NFVImage();
        image.setExtId("ext_id_1");
        image.setName("ubuntu-14.04-server-cloudimg-amd64-disk1");
        nfvImages.add(image);

        image = new NFVImage();
        image.setExtId("ext_id_2");
        image.setName("image_name_1");
        nfvImages.add(image);
        return nfvImages;
    }


.....

```

Create another starter class and set the path to it in a variable mainClass.

the starter class can be like the following:

```java
package org.myplugin.example;

import org.openbaton.plugin.PluginStarter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Starter {

    private static Logger log = LoggerFactory.getLogger(Starter.class);

    public static void main(String[] args) {
        log.info("params are: pluginName registryIp registryPort\ndefault is test localhost 1099");

        if (args.length > 1)
            PluginStarter.run(MyVim.class, args[0], args[1], Integer.parseInt(args[2]));
        else
            PluginStarter.run(MyVim.class, "MyVim", "localhost", 1099);
    }
}


```

Under the folder of your project *src/main/resorices* you should create a file **plugin.conf.properties** and write the variable *type = MyVim*

Now you can run **./gradlew build** and Gradle will create the jar that you can find it under the folder *build/libs/myVim-0.1.jar*.
You can copy and past the *myVim-0.1.jar* under the folder of the **OpenBaton -> plugins/vim-instances**. 

Congratulations you have your version of the interface for your Vim Instance that will be used from OpenBanton

For registering your Vim Instance you should send to the Openbaton a json like:

```javascript

{
  "name":"vim-instance",
  "authUrl":"http://the.ip.address.here/v2",
  "tenant":"test_tenant",
  "username":"test_username",
  "password":"test_password",
  "keyPair":"test_keyPair",
  "securityGroup": [
    "test_security_group1",
    "test_security_group2",
    "test_security_group3"
  ],
  "type":"MyVim",
  "location":{
	"name":"Berlin",
	"latitude":"52.525876",
	"longitude":"13.314400"
  }
}
```

For more information please see [Vim instance documentation]

[Vim instance documentation]:vim-instance-documention.md