# Extend OpenBaton
Being an open source implementation, OpenBaton can be easily extended for supporting additional features or capabilities.

# Extend the NFVO
The NFVO has been implemented as a java modular application using the Spring.io framework. It is pretty easy to add a new module for extending the supported features. Please refer to the [NFVO documentation](nfvo-documentation) for learning a bit more about the NFVO architecture.

## Implement a new plugin of the VIM interface

First of all you need to install the plugin sdk to your local repository. The second step is to install the gradle plugin [plugin-sdk-gradle-plugin]. 
Create a new project with build.gradle starting with:

```
   project.ext {
        mainClassName = '<path_to_Starter>'
    }
    buildscript {
        repositories{
            mavenCentral()
            maven {
                url uri('../repository-local')
            }
        }
        dependencies {
            classpath 'org.project.openbaton:plugin-sdk-gradle-plugin:0.1'
            classpath 'org.springframework.boot:spring-boot-gradle-plugin:1.2.5.RELEASE'
        }
    }
    apply plugin: 'spring-boot'
    apply plugin: 'plugin-sdk'
```

Create a starter that contains a psvm calling PluginStarter.run() like this:

```java
public static void main(String[] args) {
    PluginStarter.run(<plugin_class>, <plugin_register_name>, <nfvo_ip>, <nfvo_rmi_port(default: 1099)>);
}
```
Create a plugin class extending ClientInterfaces for vim-driver.


# Build your own VNFM using the provided vnfm-sdk 
In order to facilitate the implementation of a VNFM specific for your VNFs, we provide a Java SDK that could provide all the basic functionalities required, among them the implementation of the vnfm-or interface. 



[nfvo-documentation](nfvo-architecture)

[plugin-sdk-gradle-plugin](https://gitlab.fokus.fraunhofer.de/openbaton/plugin-sdk-gradle-plugin)