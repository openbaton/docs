# Install Open Baton on Linux 

This tutorial will guide towards the installation of a minimal Open Baton environment using the stable binaries version. 

**NOTE:** Please refer to [this tutorial](nfvo-installation.md) if you are willing to install a development environment where you can easily modify, compile and commit changes to the code base directly.

This minimal version is composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* RabbitMQ as messaging system [RabbitMQ][reference-to-rabbit-site].
* Test plugin for being able to execute the [hello world][dummy-NSR] tutorial without needing an OpenStack instance. 

And a set of optional components: 

* Generic VNFM for the instantiation of VNFs part of the Open Baton ecosystem 
* OpenStack plugin: for deploying VNFs on OpenStack. 

### Requirements

To facilitate the installation procedures we provide a bootstrap script which will install the desired components and configure them for running a hello world VNF out of the box. To execute the bootstrap procedure you need to have curl installed (see http://curl.haxx.se/). This command should work on any linux system: 

```bash
apt-get install curl
```

**NOTE** we assume that you are performing the installation on top of a clean installation either of Ubuntu 14.04 or Deabian Jessy. In other cases we suggest to install the components one by one. You can checkout the [bootstrap][bootstrap] repository and see the installation procedures which are executed by the bootstrap script. 

### Installation guide

To start the bootstrap procedure of the Open Baton environment you can type the following command:

```bash
sh <(curl -s http://get.openbaton.org/bootstrap) release
```

just in case you are interested in the latest nigthly versions of the binaries please run:

```bash
sh <(curl -s http://get.openbaton.org/bootstrap) nightly
```

**VERY IMPORTANT NOTE - By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that during the installation you will be prompted for entering the RabbitMQ IP and Port. Please make sure that this IP can be
  reached by external components (VMs, or host where will run other VNFMs) otherwise you will have runtime issues. If you are installing Open Baton on a VM running in OpenStack, the best is that you put here
  the floating IP. **
 
During the bootstrap procedure you will be prompted for inputs. For instance you can choose to install or not the Generic VNFM, or enable or not SSL. 

At the end of the bootstrap procedure, if there are no errors, the dashboard shuold be reachable at: [localhost:8080] and you should have the following structure:
```bash
/usr/lib/openbaton
├── openbaton-*.jar
├── gvnfm
└── plugins
```

Where:

* `openbaton-*jar` is the jar file related to the version of the NFVO which has been installed
* `gvnfm` (present only if during the installation procedure you also installed the Generic VNFM) contains the jar file related to the Open Baton Generic VNFM
* `plugins` contains the plugins for Open Baton. So far, if you downloaded the VIM-Driver Plugins during the installation procedure, it will contain only the jar files related to the plugins downloaded

Additionally you should also have the following structure:
```bash
/usr/bin
├── openbaton-nfvo
└── openbaton-gvnfm
```

Where:

* `openbaton-nfvo` is the Open Baton NFVO executable
* `openbaton-gvnfm` (present only if you also installed the Generic VNFM) is the Open Baton Generic GVNFM executable

At this point Open Baton is ready to be used. Please refer to the [Introduction][use-openbaton] on how to start using it or step into the [hello world][dummy-NSR] tutorial immediately.

### Starting and stopping NFVO (and the Generic VNFM)

After the installation procedure the NFVO is running.  
If you want to stop it, enter one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-nfvo stop
sudo stop openbaton-nfvo
sudo openbaton-nfvo stop
```

* With Debian Jessie:

```bash
sudo systemctl stop openbaton-nfvo.service
```

To start the NFVO, instead, enter one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-nfvo start
sudo start openbaton-nfvo
sudo openbaton-nfvo start
```

* With Debian Jessie:

```bash
sudo systemctl start openbaton-nfvo.service
```

**Note (in case you also installed the Generic VNFM):** If you also installed the Generic VNFM it is also already running at the end of the installation procedure. You can stop it with one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-gvnfm stop
sudo stop openbaton-gvnfm
sudo openbaton-gvnfm stop
```

* With Debian Jessie:

```bash
sudo systemctl stop openbaton-gvnfm.service
```

**Note (in case you also installed the Generic VNFM):** You can start the Generic VNFM with one of the following commands depending on your OS.

* With Ubuntu 14.04:

```bash
sudo service openbaton-gvnfm start
sudo start openbaton-gvnfm
sudo openbaton-gvnfm start
```

* With Debian Jessie:

```bash
sudo systemctl start openbaton-gvnfm.service
```

### Configure it

For specific configuration refer to the [configuration]

[bootstrap]: https://github.com/openbaton/bootstrap/
[spring]:https://spring.io
[configuration]:nfvo-configuration
[localhost:8080]:http://localhost:8080/
[vim_plugin_doc]:vim-plugin
[use-openbaton]:use
[dummy-NSR]:dummy-NSR
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[zabbix-server-configuration]:zabbix-server-configuration

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
