## Install NFVO

The NFVO is implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the extend it section.

### Install the latest NFVO version from the source code

The NFVO can be installed using different mechanisms. In this how to we will show you how to instantiate it using directly from the git repo. 

The NFVO uses the AMQP protocol for communicating with the VNFMs. Therefore an implementation of it is necessary, we chose [RabbitMQ][reference-to-rabbit-site].
To facilitate the installation procedures we provide an installation script which can be used for installing the NFVO and the prerequired libraries.
Considering that this script needs to install some system libraries, it is required to execute it as super user.
To execute the following command you need to have curl installed (see http://curl.haxx.se/). 

```bash
bash <(curl -fsSkL http://get.openbaton.org/bootstrap)
```

At the end of the installation procedure, if there are no errors, the dashboard is reachable at: [localhost:8080] and you should have the following structure:
```bash
/opt/openbaton/
├── generic-vnfm
└── nfvo
```

Where:

* `generic-vnfm`contains the source code and scripts required for dealing with the generic-vnfm  
* `nfvo` contains the source code and scripts of the NFVO

At this point the NFVO is ready to be used. Please refer to the [Introduction][use-openbaton] on how to start using it.

### Starting and stopping NFVO

After the installation procedure the nfvo is running. If you want to stop it, enter this command:
```bash
cd /opt/openbaton/nfvo
./openbaton.sh stop
```

**Note (in case you are also using the generic-vnfm):** remember to stop also the Generic VNFM with the following command:
```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh stop
```
To start the nfvo, enter the command:
```bash
cd /opt/openbaton/nfvo
./openbaton.sh start
```
**Note (in case you are also using the generic-vnfm):** remember to start also the Generic VNFM with the following command:
```bash
cd /opt/openbaton/generic-vnfm
./generic-vnfm.sh start
```

### NFVO properties overview

The NFVO is configured with default configuration parameters at the beginning. The configuration file is located at: 
```bash
/etc/openbaton/openbaton.properties
```

This file can be modified for specific parameters. For instance, you can decide to change logging levels (TRACE, DEBUG, INFO, WARN, and ERROR) and mechanisms:
```properties
logging.level.org.springframework=INFO
logging.level.org.hibernate=INFO
logging.level.org.apache=INFO
logging.level.org.jclouds=WARN
# logging.level.org.springframework.security=WARN
logging.level.org.springframework.web = WARN

# Level for loggers on classes inside the root package "org.project.openbaton" (and its
# sub-packages)
logging.level.org.openbaton=INFO

# Direct log to a log file
logging.file=/var/log/openbaton.log
```
Or parameters related with persistency (hibernate):
```properties
# DB properties
spring.datasource.username=admin
spring.datasource.password=changeme
# hsql jdbc
spring.datasource.url=jdbc:hsqldb:file:/tmp/openbaton/openbaton.hsdb
spring.datasource.driver-class-name=org.hsqldb.jdbc.JDBCDriver
spring.jpa.database-platform=org.hibernate.dialect.HSQLDialect
# mysql jdbc
#spring.datasource.url=jdbc:mysql://localhost:3306/openbaton
#spring.datasource.driver-class-name=com.mysql.jdbc.Driver
#spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
# hibernate properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=create-drop
```

**IMPORTANT NOTE:**

1) By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that if you want your VNFM to be executed on a different host, you will need RabbitMQ to be reachable also from the outside.  
So when you want to deploy a VNF (EMS) in a VM which runs on a different host in respect to the NFVO, you will need to configure the rabbitmq endpoint (**nfvo.rabbit.brokerIp**) with the real IP of the NFVO host (instead of localhost).
What we suggest is to copy entirely _/opt/openbaton/NFVO/etc/openbaton.properties_ to _/etc/openbaton/openbaton.properties_ and then change: 
```properties
nfvo.rabbit.brokerIp = localhost 
```
to
```properties
nfvo.rabbit.brokerIp = the rabbitmq broker ip (if you run the openbaton.sh update then will be the ip where the NFVO is running) 
``` 

2)In order to start using persistency through mysql database and not just in memory database, you need to change the properties shown above into:
```properties
# DB properties
spring.datasource.username=admin
spring.datasource.password=changeme
# hsql jdbc
# spring.datasource.url=jdbc:hsqldb:file:/tmp/openbaton/openbaton.hsdb
# spring.datasource.driver-class-name=org.hsqldb.jdbc.JDBCDriver
# spring.jpa.database-platform=org.hibernate.dialect.HSQLDialect

# mysql jdbc
spring.datasource.url=jdbc:mysql://localhost:3306/openbaton
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# hibernate properties
spring.jpa.show-sql=false
# spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.hibernate.ddl-auto=update
```
_spring.datasource.username_ and _spring.datasource.password_ need to be adapted to the mysql username and password. 
_spring.jpa.hibernate.ddl-auto_ has to be set to **update** if you want the NFVO not to drop all the tables after being shut down and to make it reuse the same tables after restarting.

For more details please see the [Spring Documentation](http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html) regarding the configuration parameters.

These are other parameters about the configuration of Rabbit MQ:
```properties
#########################################
############## RabbitMQ #################
#########################################

# Comma-separated list of addresses to which the client should connect to.
# spring.rabbitmq.addresses=${nfvo.rabbit.brokerIp}
# Create an AmqpAdmin bean.
spring.rabbitmq.dynamic=true
# RabbitMQ host.
spring.rabbitmq.host= ${nfvo.rabbit.brokerIp}
# spring.rabbitmq.host= localhost
# Acknowledge mode of container.
# spring.rabbitmq.listener.acknowledge-mode=
# Start the container automatically on startup.
# spring.rabbitmq.listener.auto-startup=true
# Minimum number of consumers.
spring.rabbitmq.listener.concurrency= 5
# Maximum number of consumers.
spring.rabbitmq.listener.max-concurrency= 30
# Number of messages to be handled in a single request. It should be greater than or equal to the transaction size (if used).
# spring.rabbitmq.listener.prefetch=
# Number of messages to be processed in a transaction. For best results it should be less than or equal to the prefetch count.
# spring.rabbitmq.listener.transaction-size=
# Login user to authenticate to the broker.
spring.rabbitmq.username= admin
# Login to authenticate against the broker.
spring.rabbitmq.password= openbaton
# RabbitMQ port.
spring.rabbitmq.port=5672
# Requested heartbeat timeout, in seconds; zero for none.
# spring.rabbitmq.requested-heartbeat=
# Enable SSL support.
# spring.rabbitmq.ssl.enabled=false
# Path to the key store that holds the SSL certificate.
# spring.rabbitmq.ssl.key-store=
# Password used to access the key store.
# spring.rabbitmq.ssl.key-store-password=
# Trust store that holds SSL certificates.
# spring.rabbitmq.ssl.trust-store=
# Password used to access the trust store.
# spring.rabbitmq.ssl.trust-store-password=
# Virtual host to use when connecting to the broker.
# spring.rabbitmq.virtual-host=

```

These parameters represent the maximum file size of the VNF Package which can be uploaded to the NFVO and the total maximum request size
```properties
# filesUpload
multipart.maxFileSize=2046MB
multipart.maxRequestSize=2046MB
```

The following properties are related to the plugin mechanism used for loading VIM and Monitoring instances. The `vim-plugin-installation-dir` is the directory where all the jar files are, which implement the VIM interface (see the [vim plugin documentation][vim_plugin_doc]). The NFVO will load them at runtime.  
```properties
########## plugin install ###############
# directory for the vim driver plugins
plugin-installation-dir = ./plugins
```

This property allows the user to delete the Network Service Records no matter in which status are they. Pleas note that in any case it is possible to remove a Network Service Record in _NULL_ state.
```properties
# nfvo behaviour
nfvo.delete.all-status = true
# public ip of the nfvo
nfvo.publicIp = localhost
nfvo.vnfd.cascade.delete = false
vnfd.vnfp.cascade.delete = false
nfvo.delete.vnfr = false
nfvo.delete.vnfr.wait = 60

# Thread pool executor configuration
# for info see http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html
nfvo.vmanager.executor.corepoolsize = 20
nfvo.vmanager.executor.maxpoolsize = 30
nfvo.vmanager.executor.queuecapacity = 500
nfvo.vmanager.executor.keepalive = 30

# server.port: 8443
# server.ssl.key-store = /etc/openbaton/keystore.p12
# server.ssl.key-store-password = password
# server.ssl.keyStoreType = PKCS12
# server.ssl.keyAlias = tomcat
# server.https = false


```
```properties
#GSON properties
spring.http.converters.preferred-json-mapper=gson
spring.jackson.deserialization.fail-on-unknown-properties = true
spring.jackson.deserialization.wrap-exceptions = false

```
**MONITORING:** Openbaton allows the monitoring of the VNFs via Zabbix. If you want to use this feature, install and configure Zabbix server following the guide at this page [Zabbix server configuration][zabbix-server-configuration].
Once the Zabbix server is correctly configured and running, you need only to add following property. 
Every time a new Network Service is instantiated, each VNFC (VM) is automatically registered to Zabbix server.

```properties 
nfvo.monitoring.ip = the Zabbix server ip
```

These are other parameters about the configuration of the nfvo behaviour:
```properties
# Wait for the NSR to be deleted
nfvo.delete.wait = false 
# The broker ip that needs to be reachable from all the components
nfvo.rabbit.brokerIp = the broker ip here 
# Set the queues to be autodeleted after the shut down
nfvo.rabbit.autodelete = true 
# Setting the number of plugin active consumers
nfvo.plugin.active.consumers = 5 
# Setting the number of minimum concurrency of the nfvo receivers
nfvo.rabbit.minConcurrency = 5 
# Setting the number of maximum concurrency of the nfvo receivers
nfvo.rabbit.maxConcurrency = 15
# Setting the management port number of rabbitmq
nfvo.rabbit.management.port = 15672 

# Setting the heartbeat between ems and the broker
nfvo.ems.queue.heartbeat = 60
# Set the ems queues to be autodeleted after the shut down
nfvo.ems.queue.autodelete = true
# Set the ems version to be installed
nfvo.ems.version = 0.15

# Allow infinite quotas during the GRANT_OPERATION
nfvo.vim.drivers.allowInfiniteQuota = false
# Execute the start event sequentially and in order based on the VNFDependencies. This implies the NSD not to have cycling dependencies
nfvo.start.ordered = false
# Avoid doing the GRANT_OPERATION
nfvo.quota.check = true
```

Those properties are needed in case you want to tune a bit the performances of the NFVO. When the VNFMs send a message to the NFVO, there is a pool of threads able to process these messages in parallel. These parameters allows you to change the pool configuration, for more details please check the [spring documentation regarding thread pool executor](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html) 
```properties
# Thread pool executor configuration
# for info see http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html
vmanager-executor-core-pool-size = 20
vmanager-executor-max-pool-size = 25
vmanager-executor-queue-capacity = 500
vmanager-keep-alive = 30
```

Whenever some of those parameters are changed, you will need to restart the orchestrator.

### Let's move to the next step

Dependening on the approach used for deploying your VNF, you'll have either to install the generic-VNFM or install and register your own VNFM

[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[vim_plugin_doc]:vim-plugin
[use-openbaton]:use.md
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
