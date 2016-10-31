<img src="../images/linux-logo.png" alt="Vagrant" style="width: 50px;"/>


# Install Open Baton

This tutorial will guide towards the installation of an Open Baton environment composed by the following components: 

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

***NOTE*** - We assume that you are performing the installation on top of a clean installation either of Ubuntu 14.04 or Debian Jessy. In other cases we suggest to install the components one by one. You can checkout the [bootstrap][bootstrap] repository and see the installation procedures which are executed by the bootstrap script. 

### Installation guide

To start the bootstrap procedure of the **development** Open Baton environment you can type the following command:

```bash
sh <(curl -s http://get.openbaton.org/bootstrap) develop
```


***VERY IMPORTANT NOTE*** - By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that during the installation you will be prompted for entering the RabbitMQ IP and Port. Please make sure that this IP can be
  reached by external components (VMs, or host where will run other VNFMs) otherwise you will have runtime issues. If you are installing Open Baton on a VM running in OpenStack, the best is that you put here
  the floating IP.
 
During the bootstrap procedure you will be prompted for inputs. For instance you can choose to install or not the Generic VNFM as well as other additional components, or enable or not SSL. 
At the end of the bootstrap procedure, if there are no errors, the dashboard should be reachable at: [localhost:8080]. 
Depending on which additional component you decided to add to the Open Baton installation then you should have the following structure:

```bash
/opt/openbaton/
├── nfvo
├── generic-vnfm
├── fm-system
├── autoscaling
└── nse
```

Where:

* `nfvo` contains the source code and scripts of the NFVO
* `generic-vnfm` contains the source code and scripts required for dealing with the Generic VNFM
* `fm-system` contains the source code and scripts required for dealing with the Fault Management System (FMS)
* `autoscaling` contains the source code and scripts required for dealing with the Auto Scaling Engine (ASE)
* `nse` contains the source code and scripts required for dealing with the Network Slicing Engine (NSE)


At this point the NFVO is ready to be used. Please refer to the [Introduction][use-openbaton] on how to start using it or step into the [hello world][dummy-NSR] tutorial immediately.

### Starting and stopping the NFVO

After the installation procedure the NFVO is running. If you want to stop it, enter this command:

```bash
cd /opt/openbaton/nfvo
./openbaton.sh stop
```

To start the nfvo, enter the command:

```bash
cd /opt/openbaton/nfvo
./openbaton.sh start
```

### Starting and stopping the Generic VNFM (and the other additional components)

If you are also using the Generic VNFM remember you can stop it with the following command:

```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh stop
```

and start it with the following command:

```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh start
```

***NOTE*** - For all the other additional components the commands above still apply just adapted to the specific component (e.g.: for the Fault Management System you can use the 'fm-system.sh' script, etc.)


### Configure it

For specific configuration refer to the [configuration]


[configuration]:nfvo-configuration.md
[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[use-openbaton]:use.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[reference-to-mysql]:https://www.mysql.com/
[zabbix-server-configuration]:zabbix-server-configuration.md
[bootstrap]:https://github.com/openbaton/bootstrap

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
