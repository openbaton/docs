# Install Open Baton on MacOS using brew

This tutorial will guide towards the installation of the NFVO implemented in java using the [spring.io][spring] framework on top a MacOS. For more details about the NFVO architecture, you can refer to the next sections.
 
### Requirements

In order to execute this tutorial you need to have Brew installed. In order to execute the NFVO you need to have RabbitMQ installed, properly configured and started: 


### Install the NFVO

In order to execute the installation of the NFVO you need to execute the following instruction: 
```bash
brew update
brew install https://raw.githubusercontent.com/openbaton/NFVO/master/gradle/gradle/scripts/osx/openbaton-nfvo.rb
```

### Start the NFVO 

After the installation is completed you can launch the NFVO: 

```
openbaton-nfvo start
```


### Disinstall the NFVO

You can execute the following command for disinstalling the NFVO: 

```
brew remove openbaton-nfvo
```


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[vim_plugin_doc]:vim-plugin
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
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
