# Juju VNF Manager (Beta version)
The Juju VNF Manager enables the Open Baton NFVO to interoperate with Juju as a generic VNFM. This initial version does not provide full interoperability between this VNFM and the Generic one provided by Open Baton. However, with this VNFM you can execute the following: 

* deploy Open Baton VNF Packages 
* deploy Juju charms which are available on the [Juju Charm Store][juju-store]

Please be careful in reading the list of unsupported functionalities in the next section. Those functionalities are part of the roadmap of this component and will be available in the next releases.  

# Constraints and future work
Here is a list of known constraints and features that do not work at the moment. 

In case you are planning to use the Juju VNFM to deploy Open Baton VNF Packages keep in mind that: 

* Lifecycle scripts have to be bash scripts
* Execution order of CONFIGURE lifecycle scripts cannot be ensured
* No actual creation of networks (virtual links)
* VNFDs with the same name in different NSDs cause problems

In case you are planning to use the Juju VNFM to deploy Juju charms then keep in mind that: 

* Dependencies between charms from the Juju Charm Store cannot be resolved yet

In general, keep in mind that: 

* No accurate NSR/VNFR status feedback
* Scaling is not supported
* Dependencies between VNFs are only working when using the same VNFM

These list of issues is something we are working on for the future release.

# Requirements

* A running [NFVO][nfvo-github]
* The [Test vim driver][test-plugin-github]
* A running Juju 2.0 instance with a controller named *obcontroller*. Please refer to the juju [installation guide][installation-guide]
* The [Juju-VNFM][juju-vnfm-github] needs to run on the same machine where Juju is installed




## How to install the Juju VNF Manager from source code

Git clone the project into the /opt/openbaton directory (you may need to be logged in as root user, unless you change the permissions on the /opt/openbaton folder): 

```bash
sudo apt-get install openjdk-7-jdk #in case you don't have java installed
mkdir /opt/openbaton
git clone https://github.com/openbaton/juju-vnfm.git
```

And Execute 

```bash
cd /opt/openbaton/juju-vnfm; ./juju-vnfm.sh compile
```
to compile it. 

## Configure the Juju VNF Manager

The Juju VNF Manager uses AMQP to communicate with the NFVO, therefore it needs to reach RabbitMQ in order to properly register with the NFVO.  
In order to configure the VNFM to reach the proper NFVO you need to modify the juju configuration file. First of all, copy the application.properties file into the following location

```bash
sudo mkdir /etc/openbaton/ # in case it does not exists
sudo cp src/main/resources/application.properties /etc/openbaton/
```

Then change open it with your favourite editor and modify the properties *spring.rabbitmq.host* and *spring.rabbitmq.port* adding the ip address and port on which rabbitmq is running. Please make sure to update also the *spring.rabbitmq.username* and *spring.rabbitmq.password* with the one used also on the NFVO side. 

## How to control the Juju VNF Manager

To start the Juju VNF Manager execute

 ```bash
 cd /opt/openbaton/juju-vnfm
 ./juju-vnfm.sh start
 ```

This will create a new screen window which you can access using *screen -x openbaton*. 


# How to use the Juju VNF Manager


To use the Juju VNF Manager for deploying a network service you have to store a VimInstance with type *test* in the NFVO 
and the Virtual Network Function Descriptors used to describe the network service have to define their *endpoint* as *juju*. 
Now you can launch the NSD as usual. Juju uses Ubuntu series names to specify which image to use while deploying a charm.
You can specify this series in the application.properties, the default is trusty. 

If you want to deploy a charm from the Juju Charm Store you have to set the VNFD's *vnfPackageLocation* to *juju charm store* 
and name the VNFD after the charm name. 
This will cause the Juju VNFM to deploy the specified charm from the Juju Charm Store. 
This is currently a fairly simple mechanism and does not provide further integration into the Open Baton Network Service deployment. 
So it is not possible to include a VNFD that specifies a Juju Charm that has dependencies to other VNFDs or to pass configurations while deploying the Charm. 

 
# How it works

![Architecture][juju-vnfm-architecture]

The Juju VNFM translates Open Baton NSD's into Juju Charms, stores them in directories in */tmp/openbaton/juju* and deploys them 
using an already running Juju controller.  
After the NFVO transmitted the last START event of a Network Service to the Juju VNFM, the charm is 
created and the juju deploy command called. If dependencies exist, the Juju VNFM will also add relations between the charms. 
The charm directory will be removed afterwards. 
In the following diagram you can see the work flow. 

![Juju flow][juju-flow]

The basic lifecycle mapping between the Open Baton and the Juju model maps Open Baton's INSTANTIATE lifecycle to Juju's install hook, the START lifecycle 
to the start hook and the TERMINATE lifecycle to the stop hook. 
But since Open Baton and Juju handle dependencies differently you cannot simply map Open Baton's CONFIGURE lifecycle to an existing Juju hook. 
The following table shows in which VNFD dependency cases which Open Baton lifecycle is mapped to which Juju hook. 
That means the scripts used by this lifecycle event will be executed by the corresponding Juju hook. 

![Mapping table][mapping-table]

If the VNFD is a target of a dependency the START lifecycle will not be mapped to the start hook because the lifecycle's scripts 
should be executed after the relation-changed hook which runs the CONFIGURE scripts. 
In these cases a *startAfterDependency* script will be created and the relation-changed hook will trigger its execution after it has finished. 




[fokus-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/fokus.png
[installation-guide]: https://jujucharms.com/docs/stable/getting-started
[installation-juju-create-container]: https://jujucharms.com/docs/stable/getting-started#create-a-controller
[openbaton]: http://openbaton.org
[openbaton-doc]: http://openbaton.org/documentation
[openbaton-github]: http://github.org/openbaton
[openbaton-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/openBaton.png
[openbaton-mail]: mailto:users@openbaton.org
[openbaton-twitter]: https://twitter.com/openbaton
[tub-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/tu.png
[juju-flow]: images/juju-flow.png
[juju-store]:https://jujucharms.com/store
[mapping-table]: images/mapping-table.png
[openimscore-github]: https://github.com/openbaton/openimscore-packages/tree/master
[juju-private-cloud]: https://jujucharms.com/docs/devel/howto-privatecloud
[openims-nsd]: http://openbaton.github.io/documentation/descriptors/tutorial-ims-NSR/tutorial-ims-NSR.json
[juju-vnfm-architecture]:images/juju-vnfm-architecture.png
[juju-vnfm-github]:https://github.com/openbaton/juju-vnfm
[nfvo-github]:https://github.com/openbaton/NFVO
[test-plugin-github]:https://github.com/openbaton/test-plugin

