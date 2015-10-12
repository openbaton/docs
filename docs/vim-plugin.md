# Create Vim Plugin

OpenBaton is an open source project providing a reference implementation of the NFVO and VNFM based on the ETSI specification, it is implemented in java using the spring.io framework. It consists of two main components: a NFVO and a generic VNFM. This project plugin-sdk contains modules that are needed to implement a plugin for OpenBaton system.

## How does this works?
An OpenBaton Plugin is a [RMI][rmi] Server that connects to the NFVO or any other rmiregistry with access to the OpenBaton catalogue as codebase. It offers an implementation of an interface that is used by the NFVO. By default the NFVO starts a rmiregistry at localhost:1099.

## Requirements

Before you can start with developing your own Vim Plugin you need to prepare your programming environment by installing/configuring the following requirements:

* JDK 7 ([installation][openjdk])
* Gradle ([installation][gradle-installation])


##### Create a new project

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


##### Create the Main Class

Afterwards, you need to create the Main Class of the VIM plugin which will be started in the end.
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
What we miss right now is the configuration of the gradle files to define and fetch dependencies we need for implementing the Vim plugin.
This is described in later sections.

In order to create a VIM plugin for OpenBaton system you need to add to your *build.gradle* file:

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
    maven { url "http://193.175.132.176:8081/nexus/content/groups/public/" }
}

apply plugin: 'java'
apply plugin: 'maven'
apply plugin: 'spring-boot'


mainClassName = 'org.myplugin.example.Starter'


dependencies {
    compile 'org.openbaton:plugin-sdk:0.6'
    compile'org.springframework:spring-context:4.2.1.RELEASE'
}

```

## Write your Vim plugin

The Vim plugin is splitted into two classes 

1. Implementation of **ClientInterfaces**
2. The **Starter Class** that contain the main function for bootstrapping the Vim plugin

#### Type of Vim Instance
OpenBaton expects only these three **type** of Vim Instance:

1.  Test
2.  OpenStack
3.  Amazon

**NOTE:** Your Vim plugin implementation ***type*** should be one of these to be launched and used by OpenBaton

### 1. Implement ClientInterfaces

The *ClientInterfaces* is an interface that contains tha basic functionality that a Vim Instance should be provide, and extends the [Remote Class]. 

_**NOTE**_: If you want to implement a Monitoring plugin, then you need to implement the Interface _ResourcePerformanceManagement_

Your **MyVim** class will implement the methods inherited from *ClientInterfaces* that manages your Vim Instance:
 
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


    // ...
}
```



### 2. Starter Class

Create another class and set the path to it in a variable *mainClassName* in *build.gradle*.
The starter class should be like the following:

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
            PluginStarter.run(MyVim.class, "test", "localhost", 1099);
    }
}
```



## Run your Vim plugin in OpenBaton environment

Under the folder of your project *src/main/resources* you should create a file **plugin.conf.properties** and write the variable **type = _the-vim-type_**.
The structure of your project should be like:

![Vim plugin structure][vim_plugin_structure]

Now you can run **./gradlew build** and Gradle will create the jar that you can find in the folder *build/libs/myPlugin-1.0-SNAPSHOT.jar*.

Once all these steps are done, you can copy and paste the *myPlugin-1.0-SNAPSHOT.jar* under the folder specified in the _openbaton.properties_ (under _/etc/openbaton_ folder) **plugin-installation-dir** property, as default NFVO/plugins.

Congratulations you have your version of the interface for your Vim Instance that will be used by NFVO

## Use my plugin

Once you copied the jar file into the right folder, you need to (re)start the NFVO. The plugin will automatically register and you can see that there will be a log file in the NFVO folder called _plugin-myPlugin.log_ containing the logs of the plugin. The myPlugin now acts as a normal plugin so for using it check out the [Vim instance documentation][vim-instance-documentation] in order to point out to the new plugin.

[spring-boot]: http://projects.spring.io/spring-boot/
[openjdk]: http://openjdk.java.net/install/
[Remote Class]: http://docs.oracle.com/javase/7/docs/api/java/rmi/Remote.html
[gradle-installation]:https://docs.gradle.org/current/userguide/installation.html
[gradle-wrapper]:https://docs.gradle.org/current/userguide/gradle_wrapper.html

[project-guide-naming-conventions]:https://maven.apache.org/guides/mini/guide-naming-conventions.html
[vim-instance-documentation]:vim-instance-documentation.md
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