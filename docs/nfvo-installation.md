# Install Open Baton 

This tutorial will guide towards the installation of a minimal Open Baton environment composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections

And a set of optional components: 

* Generic VNFM if you don't want to implement your own VNFM
* OpenStack plugin in case you want to use OpenStack as VIM
* Test plugin for being able to execute the [dummy NSR][dummy-NSR] tutorial without needing an OpenStack instance. 

In order to execute the minimal Open Baton setup you need the RabbitMQ messaging system ([RabbitMQ][reference-to-rabbit-site]). For some environments we provide installation mechanisms for automatically installing and configuring RabbitMQ. In some other cases you will need to manually install and configure it.

We provide several ways for installing Open Baton. You can choose between: 

* Direct installation on top of a Linux OS (ubuntu/debian) using either the [source-code][nfvo-installation-src] or [binary][nfvo-installation-deb] version
* Install it on MacOS using the provided brew formula. More info [here][macos]
* Launching a pre-configured docker image containing a standalone Open Baton environment. More info [here][docker]
* Launching a vagrant box using the provided vagrantfile. More info [here][vagrant]

Once you have done with the installation, you can decide to either to fine tune your environment configuring the different parameters as described in the [configuration guide][nfvo-configuration] or moving forward and start with your first [hello world tutorial][dummy-NSR].


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR
[docker]: nfvo-installation-docker
[macos]: nfvo-installation-mac
[nfvo-configuration]: nfvo-configuration
[nfvo-installation-deb]: nfvo-installation-deb
[nfvo-installation-src]: nfvo-installation-src
[use-openbaton]:use
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[vagrant]: nfvo-installation-vagrant
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
