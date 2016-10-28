<img src="../images/linux-logo.png" alt="Vagrant" style="width: 50px;"/>


# Install Open Baton on Linux 

This tutorial will guide towards the installation of an Open Baton environment using the stable binaries version. 

***NOTE*** - Please refer to [this tutorial](nfvo-installation-src.md) if you are willing to install a development environment where you can easily modify, compile and commit changes to the code base directly.

This version is composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* [RabbitMQ][reference-to-rabbit-site] as messaging system
* Test VIM Driver for being able to execute the [hello world][dummy-NSR] tutorial without needing an OpenStack instance. 

And a set of optional components: 

* OpenStack VIM Driver for deploying VNFs on OpenStack
* Generic VNFM for the instantiation of VNFs part of the Open Baton ecosystem 
* Fault Management System for the support to detection and recovery of VNF faults
* Auto Scaling Engine for the automatic creation and termination of VNF instances due to performance requirements
* Network Slicing Engine for 
* [MySQL][reference-to-mysql] as a mean to enable the persistence when using Open Baton


### Requirements

To facilitate the installation procedures we provide a bootstrap script which will install the desired components and configure them for running a [hello world][dummy-NSR] VNF out of the box. To execute the bootstrap procedure you need to have curl installed (see http://curl.haxx.se/). This command should work on any linux system: 

```bash
apt-get install curl
```

**NOTE** - We assume that you are performing the installation on top of a clean installation either of Ubuntu 14.04 or Debian Jessy. In other cases we suggest to install the components one by one. You can checkout the [bootstrap][bootstrap] repository and see the installation procedures which are executed by the bootstrap script. 


### Installation guide

To start the bootstrap procedure of the Open Baton environment you can type the following command:

```bash
sh <(curl -s http://get.openbaton.org/bootstrap) release
```

In case you are interested in the latest nigthly versions of the binaries please run:

```bash
sh <(curl -s http://get.openbaton.org/bootstrap) nightly
```

***VERY IMPORTANT NOTE*** - By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that during the installation you will be prompted for entering the RabbitMQ IP and Port. Please make sure that this IP can be
  reached by external components (VMs, or host where will run other VNFMs) otherwise you will have runtime issues. If you are installing Open Baton on a VM running in OpenStack, the best is that you put here
  the floating IP.
 
During the bootstrap procedure you will be prompted for inputs. For instance you can choose to install or not the Generic VNFM as well as other additional components, or enable or not SSL. 

At the end of the bootstrap procedure, if there are no errors, the dashboard should be reachable at: [localhost:8080]. 
Depending on which additional component you decided to add to the Open Baton installation then you should have the following structure:
```bash
/usr/lib/openbaton
├── openbaton-*.jar
├── gvnfm
├── fms
├── ase
├── nse
└── plugins
```

Where:

* `openbaton-*jar` is the jar file related to the version of the NFVO which has been installed
* `gvnfm` contains the jar file related to the Open Baton Generic VNFM
* `fms` contains the jar file related to the Open Baton Fault Management System (FMS)
* `ase` contains the jar file related to the Open Baton Auto Scaling Engine (ASE)
* `nse` contains the jar file related to the Open Baton Network Slicing Engine (NSE)
* `plugins` contains the plugins for Open Baton. By default the Test VIM Driver plugin is installed, therefore its jar file is stored in this directory. Additionally, if during the installation procedure you decide to install the OpenStack VIM-Driver Plugins then also its jar file will be stored in this directory.


Additionally, still depending on which additional component you decided to add to the Open Baton installation, then you should also have the following structure:
```bash
/usr/bin
├── openbaton-nfvo
├── openbaton-gvnfm
├── openbaton-fms
├── openbaton-ase
└── openbaton-nse
```

Where:

* `openbaton-nfvo` is the Open Baton NFVO executable
* `openbaton-gvnfm` is the Open Baton Generic VNFM executable
* `openbaton-fms` is the Open Baton FMS executable
* `openbaton-ase` is the Open Baton ASE executable
* `openbaton-nse` is the Open Baton NSE executable

At this point Open Baton is ready to be used. Please refer to the [Introduction][use-openbaton] on how to start using it or step into the [hello world][dummy-NSR] tutorial immediately.

### Starting and stopping the NFVO

After the installation procedure the NFVO is running as a service.
If you want to stop it, enter one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-nfvo stop
sudo stop openbaton-nfvo
```

* With Debian Jessie:

```bash
sudo systemctl stop openbaton-nfvo.service
```

<br>

To start the NFVO (as a service), enter one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-nfvo start
sudo start openbaton-nfvo
```

* With Debian Jessie:

```bash
sudo systemctl start openbaton-nfvo.service
```

<br>

Instead, to start and stop the NFVO as a normal process, you can use the Open Baton executables in the '/usr/bin/' folder and type the following commands:

```bash
sudo openbaton-nfvo start
sudo openbaton-nfvo stop
```

### Starting and stopping the Generic VNFM (and the other additional components)


If you also installed the Generic VNFM it is also already running (as a service) at the end of the installation procedure. You can stop it with one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-gvnfm stop
sudo stop openbaton-gvnfm
```

* With Debian Jessie:

```bash
sudo systemctl stop openbaton-gvnfm.service
```

<br>

If you also installed the Generic VNFM, then you can start it (as a service) with one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-gvnfm start
sudo start openbaton-gvnfm
```

* With Debian Jessie:

```bash
sudo systemctl start openbaton-gvnfm.service
```

<br>

Instead, to start and stop the Generic VNFM as a normal process, you can use the Open Baton executables in the '/usr/bin/' folder and type the following commands:

```bash
sudo openbaton-gvnfm start
sudo openbaton-gvnfm stop
```

<br>

***NOTE*** - For all the other additional components the commands above still apply just adapted to the specific component (e.g.: for the Fault Management System you can substitute the 'openbaton-gvnfm' with 'openbaton-fms', etc.)


### Configure it

For specific configuration refer to the [configuration]

[bootstrap]: https://github.com/openbaton/bootstrap/
[spring]:https://spring.io
[configuration]:nfvo-configuration.md
[localhost:8080]:http://localhost:8080/
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[reference-to-mysql]:https://www.mysql.com/
[zabbix-server-configuration]:zabbix-server-configuration.md

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
