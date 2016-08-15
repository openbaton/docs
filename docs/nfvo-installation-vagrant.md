<img src="../images/vagrant-logo.png" alt="Vagrant" style="width: 50px;"/>


# Install Open Baton using Vagrant 

This tutorial will guide towards the installation of a minimal Open Baton environment composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* [RabbitMQ][reference-to-rabbit-site] as messaging system
* Test plugin for being able to execute the [dummy NSR][dummy-NSR] tutorial without needing an OpenStack instance. 
* Generic VNFM
* OpenStack plugin: in case you want to use OpenStack as VIM 

## Requirements 

You need to have Vagrant installed. 

## Installation guide

If you already have Vagrant installed in your system, you can install the latest RELEASE Open Baton version by using this [Vagrantfile][vagrantfile] and simply typing the following command:

```bash
vagrant up
```

After the starting of the vagrant box has finished, you can open a browser and go on [localhost:8080]. To log in, the default credentials for the administrator user are:

```
user: admin
password: openbaton
```


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[vagrantfile]: http://get.openbaton.org/vagrant/Vagrantfile
[reference-to-rabbit-site]:https://www.rabbitmq.com/

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
