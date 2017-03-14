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

## Install the NFVO

In order to install the NFVO you need to execute the following instructions: 
```bash
brew install http://get.openbaton.org/homebrew/openbaton-nfvo.rb
```

### Start the NFVO 

After the installation is completed you can launch the NFVO: 
```
openbaton-nfvo start
```
After few seconds you can open the dashboard at: http://localhost:8080. How to use the dashboard is shown [here][dashboard-doc].

### Configure the NFVO 

The configuration file (openbaton.properties) is in the folder /usr/local/etc/openbaton. To configure the NFVO please refer to [nfvo configuration][nfvo-configuration]. 
If you change the configuration make sure to restart the NFVO running:
```bash
openbaton-nfvo stop
openbaton-nfvo start
```

### Uninstall the NFVO

You can execute the following command for uninstalling the NFVO: 
```
brew remove openbaton-nfvo
```
## Install the Generic VNFM

In order to install the Generic VNFM you need to execute the following instructions: 
```bash
brew install http://get.openbaton.org/homebrew/openbaton-vnfm-generic.rb
```

### Start the Generic VNFM

After the installation is completed you can launch the Generic VNFM: 
```
openbaton-vnfm-generic start
```

### Configure the Generic VNFM 

The configuration file (application.properties) is in the folder /usr/local/etc/openbaton/vnfm/generic. 
If you change the configuration make sure to restart the Generic VNFM running:
```bash
openbaton-vnfm-generic stop
openbaton-vnfm-generic start
```

### Uninstall the Generic VNFM

You can uninstall the Generic VNFM running: 
```
brew remove openbaton-vnfm-generic
```
## Install the Open Baton CLI

In order to install the Open Baton CLI you need to execute the following instructions: 
```bash
brew install http://get.openbaton.org/homebrew/openbaton-client.rb
```

### Uninstall the Open Baton CLI

You can uninstall the Open Baton CLI running: 
```
brew remove openbaton-client
```


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
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
