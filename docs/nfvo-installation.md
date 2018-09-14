# Install Open Baton 

Open Baton provides several installation mechanisms: 

* **Docker**: Docker provides an easy way to containerize services and compose more complex service in a template-based way. More info [here][docker].
<!--- * **development** Direct installation of a minimal or complete Open Baton environment on top of a Linux OS (ubuntu/debian) using either the [source-code][nfvo-installation-src] or [binary][nfvo-installation-deb] version. -->  

Once you have done with the installation, you can decide either to fine tune your environment configuring the different parameters as described in the [configuration guide][nfvo-configuration] or to move forward and start with your first [hello world tutorial][dummy-NSR]. 
Configuration parameters can also be adjusted when using Docker containers and environement variables. Check [here][docker-env-usage] for further information.

[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[docker]: nfvo-installation-docker.md
[docker-env-usage]: https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
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
