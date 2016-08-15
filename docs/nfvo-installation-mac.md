# Install Open Baton on MacOS using brew

This tutorial will guide towards the installation of the NFVO implemented in java using the [spring.io][spring] framework on top a MacOS. For more details about the NFVO architecture, you can refer to the next sections.
 
### Requirements

- [Homebrew][homebrew-website] installed and updated.  
- [RabbitMQ][rabbitmq-website] installed, properly configured and started. Once RabbitMQ is installed, you can configure it with the following commands:
```
rabbitmqctl add_user admin openbaton
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```


### Install the NFVO

In order to install the NFVO you need to execute the following instructions: 
```bash
brew install https://raw.githubusercontent.com/openbaton/NFVO/master/gradle/gradle/scripts/osx/openbaton-nfvo.rb
```

### Start the NFVO 

After the installation is completed you can launch the NFVO: 
```
openbaton-nfvo start
```
After few seconds you can open the dashboard http://localhost:8080

### Uninstall the NFVO

You can execute the following command for uninstalling the NFVO: 
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
[homebrew-website]:http://brew.sh
[rabbitmq-website]:https://www.rabbitmq.com

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
