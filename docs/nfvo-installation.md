# Install Open Baton 

Open Baton provides several installation mechanisms. Open Baton has two different flavors: 

* **minimal** containing only the Open Baton NFV Orchestrator, the Open Baton Generic VNF Manager and the RabbitMQ. This version is the most suitable for getting started immediately with some simple scenarios. 
* **complete** containing most of the components (docker VNFMs and VIM driver, SFCO, and Amazon VIM driver are currently not included) as listed in the get started section. During the installation procedures users can decide specific configuraion options (i.e. passwords) and which components should be installed. This version is the most suitable for a production environment. 

Please select the most suitable installation tool for your needs: 

* **Linux OS**: Direct installation of a minimal or complete Open Baton environment on top of a Linux OS (ubuntu/debian) using either the [source-code][nfvo-installation-src] or [binary][nfvo-installation-deb] version. 
* **Mac OS**: Install the NFVO and Generic VNFM on MacOS using the provided brew formula. More info [here][macos]
* **Docker**: Launch a pre-configured docker image containing a minimal Open Baton environment. More info [here][docker]
* **Vagrant**: Launching a vagrant box using the provided 'Vagrantfile' containing a minimal Open Baton environment. More info [here][vagrant]

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
