<img src="../images/linux-logo.png" alt="Vagrant" style="width: 50px;"/>


# Install Open Baton

This tutorial will guide towards the installation of an Open Baton environment checking out the source code from the github repositories, building and starting the individual components. 

A minimal version comprises the following components:

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* Test VIM Driver for being able to execute the [hello world][dummy-NSR] tutorial without needing an OpenStack instance.
* [RabbitMQ][reference-to-rabbit-site] as messaging system

A complete version includes those additional components:

* OpenStack VIM Driver for deploying VNFs on OpenStack
* Generic VNFM for the instantiation of VNFs part of the Open Baton ecosystem
* Fault Management System for the support to detection and recovery of VNF faults
* Auto Scaling Engine for the automatic creation and termination of VNF instances due to performance requirements
* Network Slicing Engine for ensuring a specific QoS for your NS
* [MySQL][reference-to-mysql] as a mean to enable the persistence when using Open Baton


### Requirements
Compiling and starting the Open Baton components requires the following things:
* git 
* screen
* OpenJDK8
* python
* RabbitMQ

### Preparation
* RabbitMQ
* MySQL

### Compilation guide

### Starting and stopping the NFVO

After the installation procedure the NFVO is running. If you want to stop it, enter this command:

```bash
cd nfvo
./openbaton.sh stop
```

To start the nfvo, enter the command:

```bash
cd nfvo
./openbaton.sh start
```

### Starting and stopping the Generic VNFM (and the other additional components)

If you are also using the Generic VNFM remember you can stop it with the following command:

```bash
cd generic-vnfm
./generic-vnfm.sh stop
```

and start it with the following command:

```bash
cd generic-vnfm
./generic-vnfm.sh start
```

**NOTE** - For all the other additional components the commands above still apply just adapted to the specific component (e.g.: for the Fault Management System you can use the 'fm-system.sh' script, etc.)


### Configure it

For specific configuration refer to the [configuration]

[configuration]:nfvo-configuration.md
[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[dummy-NSR]:dummy-NSR.md
[use-openbaton]:use.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[reference-to-mysql]:https://www.mysql.com/
[bootstrap]:https://github.com/openbaton/bootstrap
[bootstrap-config-file]:http://get.openbaton.org/bootstrap-config-file

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
