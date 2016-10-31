# Install Open Baton 

Open Baton provides several installation mechanisms. Open Baton has two different flavors: 

* **standalone** containing only the Open Baton NFV Orchestrator, the Open Baton Generic VNF Manager and the RabbitMQ. This version is the most suitable for getting started immediately with a development environment. 
* **complete** containing all components as listed in the get started section. Some of the components can be either installed or not using the provided installers. This version is the most suitable for a production infrastructure. 

Please select the most suitable installation tool for your needs: 

* **Linux OS**: Direct installation of a standalone or complete Open Baton environment on top of a Linux OS (ubuntu/debian) using either the [source-code][nfvo-installation-src] or [binary][nfvo-installation-deb] version. 
* **Mac OS**: Install the Open Baton NFVO on MacOS using the provided brew formula. More info [here][macos]
* **Docker**: Launching a pre-configured docker image containing a standalone Open Baton environment. More info [here][docker]
* **Vagrant**: Launching a vagrant box using the provided 'Vagrantfile' containing a standalone Open Baton environment. More info [here][vagrant]

Once you have done with the installation, you can decide either to fine tune your environment configuring the different parameters as described in the [configuration guide][nfvo-configuration] or to move forward and start with your first [hello world tutorial][dummy-NSR].


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[docker]: nfvo-installation-docker.md
[macos]: nfvo-installation-mac.md
[nfvo-configuration]: nfvo-configuration.md
[nfvo-installation-deb]: nfvo-installation-deb.md
[nfvo-installation-src]: nfvo-installation-src.md
[use-openbaton]:use.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[vagrant]: nfvo-installation-vagrant.md
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
