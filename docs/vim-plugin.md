# Create Vim Driver

OpenBaton is an open source project providing a reference implementation of the NFVO and VNFM based on the ETSI specification, it is implemented in java using the spring.io framework. It consists of two main components: a NFVO and a generic VNFM. This project plugin-sdk contains modules that are needed to implement a plugin for OpenBaton system.

## How does this work?
OpenBaton use the Remote Procedure Call (RPC) mechanism for implementing the Plugins. It offers an implementation of an interface that is used by the NFVO. 

## Requirements

Before you can start with developing your own Vim Driver you need to prepare your programming environment by installing/configuring the following requirements:

* JDK 7 ([installation][openjdk])
* Gradle ([installation][gradle-installation])

### Create a new project

Once you have started the IDE, click on File -> New -> Project...

In this dialog click on Gradle on the left and select java in the main properties window in the middle.

![dialog][new_project_vim]

Then click on next to go to the next window.

In the next dialog you need to define the GroupId, ArtifactId and the Version.
More information on the specific meaning can be found [here][project-guide-naming-conventions].

![dialog][new_project_vim_groupId]

Continue with the next dialog.

In this dialog you need to specify which gradle you want to use.
It is recommend to use the default gradle wrapper.
Additionally you can enable the auto-import.

![dialog][new_project_vim_groupId1]

Continue with the next dialog by clicking on Next.

In the last dialog, you need to define the project name and the project location.

![dialog][new_project_vim_groupId2]

Once this is done you can click on Finish and continue with creating the Main Class.


### Create the Main Class

Afterwards, you need to create the Main Class of the VIM driver which will be started in the end.
For doing so, right click on the root folder my-vim, then click on New -> Directory and insert what is show below.

![dialog][new_project_vim_new_directory]

Click on OK to continue.

Additionally you need to create a new package.
This is done by a right-click on the previously created directory java.
Click on New -> Package.
Here you can define the package name.

![dialog][new_project_vim_new_package]

Finally you can create your MyVim Class by clicking (right click) on the previously created package and click on New -> Java Class.

![dialog][new_project_vim_new_class]

Once you did all these steps, the initial project structure is created.
What we miss right now is the configuration of the gradle files to define and fetch dependencies we need for implementing the Vim driver.
This is described in later sections.

In order to create a VIM driver for OpenBaton system you need to add to your *build.gradle* file:

```gradle

group 'org.myplugin.example'
version '1.0-SNAPSHOT'

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
    mavenCentral()
    /**
     * Only needed for openbaton snapshots dependencies
     */
    maven {
        url 'https://oss.sonatype.org/content/repositories/snapshots/'
    }
}

apply plugin: 'java'
apply plugin: 'maven'
apply plugin: 'spring-boot'


mainClassName = 'org.myplugin.example.Starter'


dependencies {
    compile 'org.openbaton:plugin-sdk:3.0.0-RC1'
    compile'org.springframework:spring-context:4.2.1.RELEASE'
}

```

## Write your Vim driver

The Vim driver is a simple class extending one abstract class and using a Starter utility 

#### Type of Vim Instance
OpenBaton provides a specific class for handling the **openstack** type or the **test** type thus these two types are supported. For all the other types a generic class will handle the communication between the NFVO and your plugin.

### Implement VimDriver

The *VimDriver* is an abastract class that contains tha basic functionalities that a Vim Instance has to provide. 

_**NOTE**_: If you want to implement a Monitoring plugin, then you need to implement the Abstract Class _MonitoringPlugin_

Your **MyVim** class will implement the methods inherited from *VimDriver* that manages your Vim Instance:
 
| Function          				    | Description       										|
| -------------   				        | -------------:											|
| List\<NFVImage\> listImages			| Returns the list of Images                                |
| List\<Server\> listServer 			| Returns the list of Servers                               |
| List\<Network\> listNetworks  		| Returns the list of Network                               |
| List\<DeploymentFlavour\> listFlavors	| Returns the list of DeploymentFlavour                     |
| Server launchInstanceAndWait          | Creates a new Server                                      |
| void deleteServerByIdAndWait			| Removes the Server with id 	                            |
| Network createNetwork					| Creates a new Network 	                                |
| Network getNetworkById				| Returns the Network with id 	                            |
| Network updateNetwork					| Updates a new Network 	                                |
| boolean deleteNetwork					| Deletes the Network 	                                    |
| Subnet createSubnet					| Creates a new Subnet 	                                    |
| Subnet updateSubnet					| Updates the Subnet 	                                    |
| boolean deleteSubnet					| Deletes the Subnet 	                                    |
| List\<String\> getSubnetsExtIds		| Returns the list of SubnetsExtId 	                        |
| DeploymentFlavour addFlavor			| Adds a new DeploymentFlavour 	                            |
| DeploymentFlavour updateFlavor		| Updates the DeploymentFlavour 	                        |
| boolean deleteFlavor					| Deletes the DeploymentFlavour 	                        |
| NFVImage addImage                     | Adds a new NFVImage 	                                    |
| NFVImage updateImage					| Updates the NFVImage 	                                    |
| NFVImage copyImage					| Copies the NFVImage 	                                    |
| boolean deleteImage				    | Deletes the NFVImage 	                                    |
| Quota getQuota				        | Returns the Quota 	                                    |
| String getType					    | Returns the type 	                                        |

An example of the class:

```java
package org.myplugin.example;

import org.openbaton.catalogue.mano.common.DeploymentFlavour;
import org.openbaton.catalogue.nfvo.*;
import org.openbaton.exceptions.VimDriverException;
import org.openbaton.vim.drivers.interfaces.VimDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class MyVim extends VimDriver{


    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public Server launchInstance(VimInstance vimInstance, String name, String image, String flavor, String keypair, Set<String> network, Set<String> secGroup, String userData) throws RemoteException {
        // ...
    }

    @Override
    public String getType(VimInstance vimInstance) {
        // ...
    }
    
    @Override
    public List<NFVImage> listImages(VimInstance vimInstance) {
        // ...
    }

    public static void main(String[] args) {
        PluginStarter.registerPlugin(MyVim.class, "my-type", "broker-ip", 5672, 10);
    }
}
```

As you can notice, there is the need of a _main_ method to start multiple instances of the plugin (in this example are 10, the last parameter).

## Run your Vim driver in OpenBaton environment

Under the folder of your project *src/main/resources* you should create a file **plugin.conf.properties** and write the variable **type = _the-vim-type_**.

The structure of your project should be like:

![Vim driver structure][vim_plugin_structure]

Now you can run **./gradlew build** and Gradle will create the jar that you can find in the folder *build/libs/myPlugin-1.0-SNAPSHOT.jar*.

Once all these steps are done, you can copy and paste the *myPlugin-1.0-SNAPSHOT.jar* under the folder specified in the _openbaton.properties_ (under _/etc/openbaton_ folder) **plugin-installation-dir** property, as default path_to_NFVO/plugins.
The plugin sends the log messages to NFVO, the NFVO writes them into a log file. The path to this file can be set with nfvo.plugin.log.path properties in the /etc/openbaton/openbaton.properties. 
Congratulations you have your version of the interface for your Vim Instance that will be used by NFVO

## Use my plugin

Once you copied the jar file into the right folder, either you need to (re)start the NFVO or you type _installPlugin_ in the NFVO console passing the needed arguments. In case you restart the NFVO, the plugin will automatically register and you can see that there will be a log file in the NFVO folder called _plugin-myPlugin.log_ containing the logs of the plugin. The myPlugin now acts as a normal plugin so for using it check out the [Vim instance documentation][vim-instance-documentation] in order to point out to the new plugin.

**NOTE**: you can also launch your plugin from your command line just typing

```bash
$ java -jar myPlugin-1.0-SNAPSHOT.jar
```

[spring-boot]: http://projects.spring.io/spring-boot/
[openjdk]: http://openjdk.java.net/install/
[Remote Class]: http://docs.oracle.com/javase/7/docs/api/java/rmi/Remote.html
[gradle-installation]:https://docs.gradle.org/current/userguide/installation.html
[gradle-wrapper]:https://docs.gradle.org/current/userguide/gradle_wrapper.html

[project-guide-naming-conventions]:https://maven.apache.org/guides/mini/guide-naming-conventions.html
[vim-instance-documentation]:vim-instance.md
[vim_plugin_structure]: images/vim_plugin_structure.png
[new_project_vim]: images/new_project_vim.png
[new_project_vim_groupId]: images/new_project_vim_groupId.png
[new_project_vim_groupId1]: images/new_project_vim_groupId1.png
[new_project_vim_groupId2]: images/new_project_vim_groupId2.png
[new_project_vim_new_directory]: images/new_project_vim_new_directory.png
[new_project_vim_new_package]: images/new_project_vim_new_package.png
[new_project_vim_new_class]: images/new_project_vim_new_class.png
[rmi]: https://docs.oracle.com/javase/tutorial/rmi/overview.html

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
