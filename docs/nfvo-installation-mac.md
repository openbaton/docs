<img src="../images/apple-logo.gif" alt="Vagrant" style="width: 50px;"/>

# Install Open Baton on MacOS using brew

This tutorial will guide you through the installation of the NFVO on top of MacOS.
 
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

This command will install the NFVO via brew. How to configure, start and stop the NFVO once it is installed is shown in the next section.

### Start the NFVO 

After the installation is completed you can launch the NFVO: 
```
openbaton-nfvo start
```
After few seconds you can open the dashboard at: http://localhost:8080. How to use the dashboard is shown [here][dashboard-doc]. Additonally, you can also use the [CLI][cli-doc].

### Configure the NFVO 

The configuration file (openbaton.properties) is in the folder /usr/local/Cellar/openbaton. To configure the NFVO please refer to [nfvo configuration][nfvo-configuration].

### Uninstall the NFVO

You can execute the following command for uninstalling the NFVO: 
```
brew remove openbaton-nfvo
```


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[zabbix-server-configuration]:zabbix-server-configuration.md
[homebrew-website]:http://brew.sh
[rabbitmq-website]:https://www.rabbitmq.com
[nfvo-configuration]:nfvo-configuration.md
[dashboard-doc]: nfvo-how-to-use-gui
[cli-doc]: nfvo-how-to-use-cli

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
