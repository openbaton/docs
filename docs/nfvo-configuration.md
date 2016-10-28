# How to configure the NFVO 



### NFVO properties overview

After the bootstrap procedure the NFVO's configuration file is located at: 
```bash
/etc/openbaton/openbaton.properties
```

This is a property file that is used to configure the *Spring* environment and the **NFVO**. Since the component is based on the Spring framework some parameters are inherited, for a deeper explanation on all the parameters meaning, please refer to the [Spring documentation](http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html). 

 Feel free to modify that file for adding or removing specific functionalities.  For instance, you can decide to change logging levels (TRACE, DEBUG, INFO, WARN, and ERROR) and mechanisms:
```properties
logging.level.org.springframework=INFO
logging.level.org.hibernate=INFO
logging.level.org.apache=INFO
logging.level.org.jclouds=WARN
logging.level.org.springframework.web = WARN

# Level for loggers on classes inside the root package "org.project.openbaton" (and its sub-packages)
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

**IMPORTANT NOTES:**

(Keep in mind that whenever some of the parameters below referred are changed, you will need to restart the NFVO)

1) By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that if you want your VNFM to be executed on a different host, you will need RabbitMQ to be reachable also from the outside.  
So when you want to deploy a VNF (EMS) in a VM which runs on a different host than the NFVO, you will need to configure the rabbitmq endpoint (**nfvo.rabbit.brokerIp**) with the real IP of the NFVO host (instead of localhost).

This can be done by changing the following properties of the _/etc/openbaton/openbaton.properties_ file:
```properties
nfvo.rabbit.brokerIp = localhost 
```
to:
```properties
nfvo.rabbit.brokerIp = <the rabbitmq broker ip>
``` 

2) Depending on the installation mode you selected, it maybe that you have an in-memory database. In order to reconfigure the NFVO to use a more persistent database, like MySQL, you need to change the properties as shown below:
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
Where:
* _spring.datasource.username_ and _spring.datasource.password_ need to be adapted to the mysql username and password.
* _spring.jpa.hibernate.ddl-auto_ has to be set to **update** if you want the NFVO not to drop all the tables after being shut down and to make it reuse the same tables after restarting.

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

The following properties are related to the plugin mechanism used for loading VIM and Monitoring instances. The `vim-plugin-installation-dir` is the directory where all the jar files are, which implement the VIM interface (see the [VIM driver documentation][vim-driver]). The NFVO will load them at runtime.  
```properties
########## plugin install ###############
# directory for the vim driver plugins
plugin-installation-dir = /usr/local/lib/openbaton/plugins
```

This property allows the user to delete the Network Service Records no matter in which status they are. Please note that in any case it is possible to remove a Network Service Record in _NULL_ state.
```properties
# nfvo behaviour
nfvo.delete.all-status = true
```

**MONITORING:** Openbaton allows the monitoring of the VMs on top of which the VNFs are exeucting via an external monitoring system. At the moment Zabbix is the monitoring system supported. If you want to enable it, you need first to install and configure Zabbix server following the guide at this page [Zabbix server configuration][zabbix-server-configuration].
Once the Zabbix server is correctly configured and running, you only need to add following property.

```properties 
nfvo.monitoring.ip = the Zabbix server ip
```
Every time a new Network Service is instantiated, each VNFC (VM) is automatically registered to the Zabbix server.

These are other parameters for configuring the NFVO's behaviour:
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
nfvo.ems.version = 0.17

# Allow infinite quotas during the GRANT_OPERATION
nfvo.vim.drivers.allowInfiniteQuota = false
# Execute the start event sequentially and in order based on the VNFDependencies. This implies the NSD not to have cycling dependencies
nfvo.start.ordered = false
# Avoid doing the GRANT_OPERATION
nfvo.quota.check = true
# if true, deleting the nsd will remove also its vnfd
nfvo.vnfd.cascade.delete = false
# if true, deleting the vnfd will remove also its vnfpackage
vnfd.vnfp.cascade.delete = false
# if true, after deleting a NSR, the nfvo will wait for "nfvo.delete.vnfr.wait.timeout" after that timeout the VMs and VNFR will be deleted anyway from the NFVO
nfvo.delete.vnfr.wait = false
# this timeout is useful only if "nfvo.delete.vnfr.wait" is set to true
nfvo.delete.vnfr.wait.timeout = 60
```

Those properties are needed in case you want to tune a bit the performances of the NFVO. When the VNFMs send a message to the NFVO, there is a pool of threads able to process these messages in parallel. These parameters allows you to change the pool configuration, for more details please check the [spring documentation regarding thread pool executor](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html) 
```properties
# Thread pool executor configuration
# for info see http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html
nfvo.vmanager.executor.corepoolsize = 20
nfvo.vmanager.executor.maxpoolsize = 30
nfvo.vmanager.executor.queuecapacity = 500
nfvo.vmanager.executor.keepalive = 30
```

[spring]:https://spring.io
[configuratino]:nfvo-configuration
[localhost:8080]:http://localhost:8080/
[vim-driver]:vim-driver-create
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[zabbix-server-configuration]:zabbix-server-configuration.md
