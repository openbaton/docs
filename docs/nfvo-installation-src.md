# Install Open Baton

This tutorial will guide towards the installation of a minimal Open Baton environment composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* RabbitMQ as messaging system [RabbitMQ][reference-to-rabbit-site].
* Test plugin for being able to execute the [dummy NSR][dummy-NSR] tutorial without needing an OpenStack instance. 

And a set of optional components: 

* Generic VNFM
* OpenStack plugin: in case you want to use OpenStack as VIM

### Install the latest stable Open Baton environment from source code

This installation guide will provide you details on how to install the minimal set of Open Baton components using the boostrap scripts.

To facilitate the installation procedures we provide a bootstrap script which will install the desired components and configure them for running a hello world VNF out of the box. To execute the bootstrap procedure you need to have curl installed (see http://curl.haxx.se/). This command should work on any linux system: 

```bash
sh <(curl -s http://get.openbaton.org/bootstraps/bootstrap) develop
```


**NOTE - By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that during the installation you will be prompted for entering the RabbitMQ IP and Port. Please make sure that this IP can be
  reached by external components (VMs, or host where will run other VNFMs) otherwise you will have runtime issues. If you are installing Open Baton on a VM running in OpenStack, the best is that you put here
  the floating IP. **
 

During the bootstrap procedure you will be prompted for inputs. For instance you can choose to install or not the Generic VNFM, or enable or not SSL. 
At the end of the bootstrap procedure, if there are no errors, the dashboard shuold be reachable at: [localhost:8080] and you should have the following structure:
```bash
/opt/openbaton/
├── generic-vnfm
└── nfvo
```

Where:

* `generic-vnfm`contains the source code and scripts required for dealing with the generic-vnfm  
* `nfvo` contains the source code and scripts of the NFVO

At this point the NFVO is ready to be used. Please refer to the [Introduction][use-openbaton] on how to start using it.

### Starting and stopping NFVO

After the installation procedure the nfvo is running. If you want to stop it, enter this command:
```bash
cd /opt/openbaton/nfvo
./openbaton.sh stop
```

**Note (in case you are also using the generic-vnfm):** remember to stop also the Generic VNFM with the following command:
```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh stop
```
To start the nfvo, enter the command:
```bash
cd /opt/openbaton/nfvo
./openbaton.sh start
```
**Note (in case you are also using the generic-vnfm):** remember to start also the Generic VNFM with the following command:
```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh start
```



### Configure it

For specific configuration refer to the [configuration]


[configuration]:nfvo-configuration
[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[vim_plugin_doc]:vim-plugin
[use-openbaton]:use.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
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
