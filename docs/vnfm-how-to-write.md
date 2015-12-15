# How to write a VNFManager

This section is going to describe how to write your own VNFManager by using any vnfm-sdk.
Moreover, the vnfm-sdk contains all the things you may need for the development of the VNFManager of your choice as well.

The vnfm-sdk provides the following things:

* multiple [vnfm-sdks](#choose-a-vnfm-sdk) where you can choose your preferred type of communication
* Catalogue, shared with the NFVO containing all entities
* [VNFMHelper](#using-the-vnfmhelper) for providing some methods out of the box

## Requirements

Before you can start with developing your own VNFManager you need to prepare your programming environment by installing/configuring the following requirements:

* JDK 7 ([installation][openjdk-link])
* Gradle ([installation][gradle-installation-link])

## Develop your own VNFManager

This part is going to describe the steps you need to do to develop your own VNFManager with the help of any vnfm-sdk.

The practical parts of implementing a basic VNFManager will focus on the usage of a specific vnfm-sdk, namely the vnfm-sdk-jms.

### Preparations

This section describes the initial steps for creating the project structure and configuring essential files for developing your own VNFManager.
This can be done in two ways.
Either you may use your favorite IDE or you may do everything manually via the command line.

Once this is done, you can start implementing your VNFManager by using different communication models, the catalogue and several helpers.

#### Using your favorite IDE
In the following we will create the project and setup the configuration files by using your favorite IDE.
So first of all, start your IDE and go to the next step.
All the details base on the usage of [IntelliJIdea][IntelliJIdea-link].

##### Create a new project

Once you have started the IDE, click on File -> New -> Project...

In this dialog click on Gradle on the left and select java in the main properties window in the middle.

![dialog][intellijidea_new_project_type]

Then click on next to go to the next window.

In the next dialog you need to define the GroupId, ArtifactId and the Version.
More information on the specific meaning can be found [here][project-guide-naming-conventions-link].

![dialog][intellijidea_new_project_group]

Continue with the next dialog.

In this dialog you need to specify which gradle you want to use.
It is recommend to use the default gradle wrapper.
Additionally you can enable the auto-import.

![dialog][intellijidea_new_project_gradle]

Continue with the next dialog by clicking on Next.

In the last dialog, you need to define the project name and the project location.

![dialog][intellijidea_new_project_name]

Once this is done you can click on Finish and continue with creating the Main Class.

##### Create the Main Class

Afterwards, you need to create the Main Class of the VNFManager which will be started in the end.
For doing so, right click on the root folder my-vnfm, then click on New -> Directory and insert what is show below.

![dialog][intellijidea_new_directory]

Click on OK to continue.

Additionally you need to create a new package.
This is done by a right-click on the previously created directory java.
Click on New -> Package.
Here you can define the package name.

![dialog][intellijidea_new_package]

Finally you can create your Main Class by clicking (right click) on the previously created package and click on New -> Java Class.

![dialog][intellijidea_new_class]

Once you did all these steps, the initial project structure is created.
What we miss right now is the configuration of the gradle files to define and fetch dependencies we need for implementing the VNFManager.
This is described in later sections.

##### Create the properties files

The properties files are used to define several parameters you need at runtime.
So just create the following file structure.

Do a right-click on the main folder located in the src folder.
Click on New -> Directory and create a new folder with the name resources.

Do again a right-click on the newly created folder resources and click on New -> File.
This you need to do two times.
The first file is called application.properties and the second one is called conf.properties.

What these files should contain is explained [here](#property-files).


#### Using the command line
This section refers to the developers which don't like to use any IDE.
By not using any IDE we need to create all the folders and configuration files manually.
So we start with creating the project structure, the Main Class, initializing the gradle wrapper and according configuration files.

##### Create project folder
First of all you need to create a new directory for your VNFManager.
Here we call the new VNFManager my-vnfm.
So this can be replaced by whatever you want.

```bash
$ mkdir my-vnfm
```

##### Create the Main Class
The Main class is the most important class you need to consider.
Here you implement your main method and also methods you need to have for your VNFManager.
Further explanations are done in the according sections.
This is only for creating a proper file structure.
So execute the following commands to create the Main class in a proper folder and package structure.

First, you need to create the folders and package by executing the following command in your root folder of the project.

```bash
$ mkdir -p src/main/java/org/openbaton/vnfm
```

This creates the java folder src/main/java with the proposed package name org.openbaton.vnfm.

In the next step you create the Main Class called MyVNFM in this case.

```bash
$ vim /src/main/java/org/openbaton/vnfm/MyVNFM.java
```
At this point you create only the basic Java Class used later as the Main Class for implementing your VNFManager.
The newly created Java Class should contain the following lines for now.

```java
package org.openbaton.vnfm;

public class MyVNFM {
}
```

If you have chosen a different package name you need to replace it as well at this point.
Once this is done, you need to initialize the gradle wrapper and configuring according files.

##### The Build.Gradle file

First you need to create the build.gradle file by executing the following command from your root project folder.

```bash
$ vim build.gradle
```

This gradle configuration file needs to contain initially the following lines.

```gradle
buildscript {
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.2.6.RELEASE")
    }
}
group 'your.group'
version '1.0-SNAPSHOT'

apply plugin: 'java'
apply plugin: 'spring-boot'
apply plugin: 'maven'
```

The second gradle configuration is called settings.gradle.
This file contains only the project name.
So create a new file called settings.gradle in your root folder.


```bash
$ vim settings.gradle
```
Afterwards you need to add the following line containing your project name.
In our case my-vnfm.

```gradle
rootProject.name = 'my-vnfm'
```

Afterwards go back to the root folder and run the following command to create automatically the gradle wrapper which is used for code management and compilation.
For more information on how to use the gradle wrapper have a look at the gradle wrapper documentation [here][gradle-wrapper-link].

```bash
$ gradle wrapper --gradle-version 2.4
```

Once you did all these steps, the initial project structure is created.
What we miss right now is the configuration of the gradle files to define and fetch dependencies we need for implementing the VNFManager.
This is described in later sections.

##### Create the properties files

The properties files are used to define several parameters you need at runtime.
So just create the following file structure by executing the following commands.

```bash
$ mkdir src/main/resources
```

Now you need to create two new files by running both commands you can find in the following

```bash
$ touch src/main/resources/application.properties
$ touch src/main/resources/conf.properties
```

What these files should contain is explained [here](#property-files).

#### Configure Gradle

Finally you need to extend your build.gradle for announcing the Main Class, plugins to apply and repositories to use.
So open the build.gradle an add missing line so that the file contains the following line.

```gradle
//...

bootRepackage {
    mainClass = 'org.openbaton.vnfm.MyVNFM'
}

//...
```

Take care about the configuration of the mainClass.
If the name or package of your mainClass is different, you need to replace it here as well.

#### Property files
The previously created properties files are used to define several things.
They are located in src/main/resources and are called application.properties and conf.properties.

The **application.properties** contains parameters for setting up all log levels. This file is useful for configuring the springframework (see [Spring Boot configuration file](http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)). This file can contain the following lines.

```properties
logging.level.org.springframework=INFO
logging.level.org.hibernate=INFO
logging.level.org.apache=INFO
logging.level.org.jclouds=WARN
# logging.level.org.springframework.security=WARN
logging.level.org.springframework.web = WARN

# Level for loggers on classes inside the root package "org.project.openbaton" (and its
# sub-packages)
logging.level.org.openbaton=INFO

# Direct log to a log file
logging.file=/var/log/openbaton.log
```

If you want to change log levels you need to adapt it here. Please note that if the VNFManager is running in the same machine of the rabbitMQ broker, this file is not needed.

_**NOTE**_: _If your VNFManager is running on a different machine than the rabbitmq broker, you need to change the `nfvo.rabbit.brokerIp` accordingly with the ip:port of the rabbitmq broker._

The **conf.properties** is also a very important configuration file.
Here you need to define the type and endpoint of your VNFManager that is later used for registering on the NFVO.
Furthermore, you can define your own parameters which can be used at runtime for whatever you want.
So this file has to contain at least the type and endpoint.
Additionally, it is defined the folder where the vim-plugins are located.
In this case the file should contain the following lines.

```gradle
type=my-vnfm
endpoint=my-vnfm-endpoint

allocate = true
concurrency = 15
transacted = false

#### Additionally
vim-plugin-dir = ./plugins
```

Where the parameters mean:

| Params          				| Meaning       																|
| -------------   				| -------------:																|
| type  						| The type of VNF you are going to handle 						|
| endpoint                      | The endpoint used for requesting this VNFManager |
| allocate 						| true if the NFVO will ALLOCATE_RESOURCES, false if the VNFManager will do      	|
| concurrency	 				| The number of concurrent Receiver (only for vnfm-sdk-jms)|
| transacted 					| Whenever the JMS receiver method shoud be transacted, this allows the message to be resent in case of exception VNFManager side (only for vnfm-sdk-jms)     	|

## Choose a vnfm-sdk

Before you can start with the implementation you need to select the type of communication you want to use for the communication between the Orchestrator (NFVO) and the VNFManager.
Either you can use the vnfm-sdk-jms for using the [Java Message Service (JMS)][JMS-link] or the vnfm-sdk-rest for using the [ReST][ReST-link] interface.
However, your choice doesn't effect the upcoming implementation, because the communication itself is done automatically in the background.
But have in mind that both libraries depend on [SpringBoot][spring-boot-link].
So, if you want to avoid this dependency, a third option might be: just use the simple vnfm-sdk artifact.
By using the simple vnfm-sdk you need to take care about all the communication between NFVO and VNFManager by yourself.

Once you have imported one of the vnfm-sdks you will have access to all the model classes and the vnfm-sdk classes needed to implement a VNFManager.

The following section shows you how to import the vnfm-sdk-jms, representative for all the other opportunities.

### Import a vnfm-sdk

This section shows how to import and configure your VNFManager to make use of the vnfm-sdk-jms.

For gathering the vnfm-sdk-jms library you need to import the libraries by adding the missing lines to your build.gradle:

```gradle
//...

dependencies {
    compile 'org.hibernate:hibernate-core:4.3.10.Final'
    compile 'org.openbaton:vnfm-sdk-jms:0.15'
}

//...
```

**Note** To make use of the vnfm-sdk-rest you need to change 'vnfm-sdk-jms' to 'vnfm-sdk-rest' only.

So the final build.gradle file results like:

```gradle
buildscript {
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.2.6.RELEASE")
    }
}

apply plugin: 'spring-boot'
apply plugin: 'java'
apply plugin: 'maven'

repositories {
    mavenCentral()
    maven {
        url "http://193.175.132.176:8081/nexus/content/groups/public"
    }
}

dependencies {
    compile 'org.openbaton:vnfm-sdk-jms:0.15'
    compile 'org.hibernate:hibernate-core:4.3.10.Final'
}

group = 'your.group'
version = 1.0-SNAPSHOT
```

Once you did this, you need to trigger the gradle build process by running the following command via the command line in your project's root folder.

```bash
$ ./gradlew build
```
This will fetch all the dependencies defined in the build.gradle and gives you access to all the Classes you need.
You can also do this by using the IDE by running the corresponding gradle task.

## Implementation of the VNFManager

This section is going to describe the implementation of a basic VNFManager by using the vnfm-sdk-jms.
In the end, the VNFManager will be able to allocate and terminate resources by using its own openstack-plugin.

So first of all you need to define the main method used for starting your VNFManager.
So add the following to your Main Class that it looks as follows:

```java
package org.openbaton.vnfm;

public class MyVNFM {

	public static void main(String[] args){
		SpringApplication.run(MyVNFM.class);
	}
}
```

Afterwards you need to extend your Main Class (in this case MyVNFM) with the *AbstractVnfmSpringJMS*.

The *AbstractVnfmSpringJMS* takes care of all the configuration you need to register/unregister the VNFManager to the NFVO and handles incoming messages.
Whereas the *AbstractVnfm*, extended by the *AbstractVnfmSpringJMS*, is independent of the type of communication.
This means more in detail that the *AbstractVnfm* processes the incoming messages and executes the right method depending on the defined Action inside the message.
Moreover, it is responsible for loading predefined configuration files, setting up the VNFManager itself, creating the VNFR (based on the VNFD received in the first step) and doing essential parts like requesting the NFVO for granting operations or deciding who is responsible for allocate resources.

Once you extended your VNFMManger, you need to implement all the methods coming from the extension of *AbstractVnfmSpringJMS* as shown below:

```java
package org.openbaton.vnfm;

import org.openbaton.catalogue.mano.record.VNFRecordDependency;
import org.openbaton.catalogue.mano.record.VirtualNetworkFunctionRecord;
import org.openbaton.common.vnfm_sdk.VnfmHelper;
import org.openbaton.common.vnfm_sdk.jms.AbstractVnfmSpringJMS;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;

public class MyVNFM extends AbstractVnfmSpringJMS {

	@Autowired
	private VnfmHelper vnfmHelper;

    /**
     * This operation allows creating a VNF instance.
     * @param virtualNetworkFunctionRecord
     * @param scripts
     */
    @Override
    public VirtualNetworkFunctionRecord instantiate(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord, Object scripts) throws Exception {
        return virtualNetworkFunctionRecord;
    }

    /**
     * This operation allows retrieving
     * VNF instance state and attributes.
     */
    @Override
    public void query() {

    }

    /**
     * This operation allows scaling
     * (out/in, up/down) a VNF instance.
     */
    @Override
    public void scale() {

    }

    /**
     * This operation allows verifying if
     * the VNF instantiation is possible.
     */
    @Override
    public void checkInstantiationFeasibility() {

    }

    /**
     * This operation allows verifying if
     * the VNF instantiation is possible.
     */
    @Override
    public void heal() {

    }

    /**
     * This operation allows applying a minor/limited
     * software update (e.g. patch) to a VNF instance.
     */
    @Override
    public void updateSoftware() {

    }

    /**
     * This operation allows making structural changes
     * (e.g. configuration, topology, behavior,
     * redundancy model) to a VNF instance.
     * @param virtualNetworkFunctionRecord
     * @param dependency
     */
    @Override
    public VirtualNetworkFunctionRecord modify(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord, VNFRecordDependency dependency) throws Exception {
        return virtualNetworkFunctionRecord;
    }

    /**
     * This operation allows deploying a new
     * software release to a VNF instance.
     */
    @Override
    public void upgradeSoftware() {

    }

    /**
     * This operation allows terminating gracefully
     * or forcefully a previously created VNF instance.
     * @param virtualNetworkFunctionRecord
     */
    @Override
    public VirtualNetworkFunctionRecord terminate(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord) throws Exception{
        return virtualNetworkFunctionRecord;
    }

    @Override
    protected void checkEmsStarted(String hostname) throws RuntimeException {

    }

    @Override
    public VirtualNetworkFunctionRecord start(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord) throws Exception {
        return virtualNetworkFunctionRecord;
    }

    @Override
    public VirtualNetworkFunctionRecord configure(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord) throws Exception {
        return virtualNetworkFunctionRecord;
    }

    /**
	 * This operation allows providing notifications on state changes
	 * of a VNF instance, related to the VNF Lifecycle.
	 */
	@Override
	public void NotifyChange() {

    }

	public static void main(String[] args){
        SpringApplication.run(MyVNFM.class);
    }
}
```
Now you can implement whatever you want. If the VirtualNetworkFunctionRecord is returned, it will go back directly to the NFVO.

One of the methods that can be overwritten is the _fillSpecificParameters_. This method is important when you have specified some "provides" in your VNFD, in facts you can fill them in this method and make them available afterwards to the scripts (see [How to use the parameters][param-how-to]). 

An example of allocating and terminating resource by using a plugin can be found [here](#allocate-resources) and [here](#release-resources).

**Note** If you use vnfm-sdk-jms or vnfm-sdk-rest **_the VNFManager main class needs to be stateless_** since it can (will) run each method potentially in parallel.
For what concerns vnfm-sdk-jms, even setting concurrency to 1, will not ensure to have always the same instance of the class.

#### Using the VnfmHelper

Additionally you can autowire the VnfmHelper to make use of several helper methods that are very useful.
In this case your VNFManager should look like this:

```java
package org.openbaton.vnfm;

import org.springframework.beans.factory.annotation.Autowired;

public class MyVNFM extends AbstractVnfmSpringJMS {

	@Autowired
	private VnfmHelper vnfmHelper;

    [...]
}
```

The vnfmHelper helps with some methods out of the box:

```java
package org.openbaton.common.vnfm_sdk;

import org.openbaton.catalogue.nfvo.messages.Interfaces.NFVMessage;

public abstract class VnfmHelper {

    /**
     * This operation sends a NFVMessage
     * to the NFVO and doesn't wait for answer.
     * @param nfvMessage
     */
    public abstract void sendToNfvo(NFVMessage nfvMessage);

    /**
     * This operation send a NFVMessage
     * to the NFVO and waits for the answer.
     * @param nfvMessage
     */
    public abstract NFVMessage sendAndReceive(NFVMessage nfvMessage) throws Exception;
}
```

At the moment, the main purpose of the VnfmHelper is to send messages to the NFVO and wait for the answer if needed.

**Note** This class needs to be implemented in case you want to use only the vnfm-sdk and must be provided to the AbstractVnfm.

#### Using plugins

This section describes the initialization and usage of plugins.
Therefore, you need to do several things:

* Create a Registry
* Start the plugins
* Connect an according VIM to the plugin

**Note** If you want to use plugins, you need to fetch also the interfaces and VIM implementations by adding the following lines to your build.gradle dependencies

```gradle
compile 'org.openbaton:vim-int:0.15'
compile 'org.openbaton:vim-impl:0.15'
```
After that you need to rebuild your project for fetching the dependencies automatically.

Now you can use the ResourceManagement interface.
In the end it should look like the following:

```java
package org.openbaton.vnfm;

import org.openbaton.nfvo.vim_interfaces.resource_management.ResourceManagement;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;

import org.openbaton.plugin.utils.PluginStartup;
import java.io.IOException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class MyVNFM extends AbstractVnfmSpringJMS {

	@Autowired
    private ConfigurableApplicationContext context;

    private ResourceManagement resourceManagement;

    [...]

    @Override
    protected void setup() {
        super.setup();
        try {
            int registryport = 19345;
            Registry registry = LocateRegistry.createRegistry(registryport);
            PluginStartup.startPluginRecursive("./plugins", true, "localhost", "" + registryport);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        resourceManagement = (ResourceManagement) context.getBean("openstackVIM", "openstack", 19345);
    }
}
```

This code expects that the plugins are located in ./plugins.
So just copy the openstack plugin of your choice to this path.
Now you are able to use a VIM inside your VNFManager to allocate and release resources whenever you want.

##### Allocate Resources
The following code snippet shows how to instantiate (allocate) resources at VNFManager side with the help of the VIM.

```java
@Override
public VirtualNetworkFunctionRecord instantiate(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord, Object object) {
    log.debug("Processing allocation of Resources for vnfr: " + virtualNetworkFunctionRecord);
    List<Future<VNFCInstance>> vnfcInstances = new ArrayList<>();
    try {
        for (VirtualDeploymentUnit vdu : virtualNetworkFunctionRecord.getVdu()) {
            log.debug("Creating " + vdu.getVnfc().size() + " VMs");
            for (VNFComponent vnfComponent : vdu.getVnfc()) {
                Future<VNFCInstance> allocate = resourceManagement.allocate(vdu, virtualNetworkFunctionRecord, vnfComponent, "#userdata", vnfComponent.isExposed());
                vnfcInstances.add(allocate);
            }
        }
    } catch (VimDriverException e) {
        log.error(e.getMessage(), e);
        throw new RuntimeException(e.getMessage(), e);
    } catch (VimException e) {
        log.error(e.getMessage(), e);
        throw new RuntimeException(e.getMessage(), e);
    }
    //Print ids of deployed VDUs
    for (Future<VNFCInstance> vnfcInstance : vnfcInstances) {
        try {
            log.debug("Created VNFCInstance with id: " + vnfcInstance.get());
        } catch (InterruptedException e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        } catch (ExecutionException e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        }
    }
    log.debug("Allocated all Resources for vnfr: " + virtualNetworkFunctionRecord);
    return virtualNetworkFunctionRecord;
}
```

**Note** Keep in mind that you need to set *allocate* to false in conf.properties, if you want to allocate resources on the VNFManager side.

##### Release Resources
The next code snippet shows an implementation of the terminate method used for releasing resources at VNFManager side.

```java
@Override
public VirtualNetworkFunctionRecord terminate(VirtualNetworkFunctionRecord virtualNetworkFunctionRecord) {
    log.info("Terminating vnfr with id " + virtualNetworkFunctionRecord.getId());
    for (VirtualDeploymentUnit vdu : virtualNetworkFunctionRecord.getVdu()) {
        Set<VNFCInstance> vnfciToRem = new HashSet<>();
        for (VNFCInstance vnfcInstance : vdu.getVnfc_instance()) {
            log.debug("Releasing resources for vdu with id " + vdu.getId());
            try {
                resourceManagement.release(vnfcInstance, vdu.getVimInstance());
            } catch (VimException e) {
                log.error(e.getMessage(), e);
                throw new RuntimeException(e.getMessage(), e);
            }
            vnfciToRem.add(vnfcInstance);
            log.debug("Released resources for vdu with id " + vdu.getId());
        }
        vdu.getVnfc_instance().removeAll(vnfciToRem);
    }
    log.info("Terminated vnfr with id " + virtualNetworkFunctionRecord.getId());
    return virtualNetworkFunctionRecord;
}
```

### Start the VNFManager

Once you finalized your VNFManager you can compile and start it with the following commands.

```bash
$ ./gradlew clean build
$ java -jar build/libs/my-vnfm.jar
```
If everything is fine, your VNFManager will register to NFVO and is able now to receive requests and process them.

<!---
References
-->

[spring-boot-link]:http://projects.spring.io/spring-boot/
[openjdk-link]: http://openjdk.java.net/install/
[JMS-link]: http://docs.spring.io/spring/docs/current/spring-framework-reference/html/jms.html
[ReST-link]: https://en.wikipedia.org/wiki/Representational_state_transfer

[gradle-installation-link]:https://docs.gradle.org/current/userguide/installation.html
[gradle-wrapper-link]:https://docs.gradle.org/current/userguide/gradle_wrapper.html

[project-guide-naming-conventions-link]:https://maven.apache.org/guides/mini/guide-naming-conventions.html

[IntelliJIdea-link]:https://www.jetbrains.com/idea/?fromMenu


[intellijidea_new_project_type]: images/vnfm-how-to-write-intellijidea-new_project-type.png
[intellijidea_new_project_group]: images/vnfm-how-to-write-intellijidea-new-project-group.png
[intellijidea_new_project_gradle]: images/vnfm-how-to-write-intellijidea-new-project-gradle.png
[intellijidea_new_project_name]: images/vnfm-how-to-write-intellijidea-new-project-name.png
[intellijidea_new_directory]: images/vnfm-how-to-write-intellijidea-new-directory.png
[intellijidea_new_package]: images/vnfm-how-to-write-intellijidea-new-package.png
[intellijidea_new_class]: images/vnfm-how-to-write-intellijidea-new-class.png

[param-how-to]: vnf-parameters
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