# How to configure the NFVO

This guide explains you how to configure the NFVO once the installation is completed. In general, after using the bootsrap procedure no changes described here are required unless you want to tune up your installation.
In addition to this, you may need to modify also the configuration parameters of the [Generic VNFM][generic-vnfm]

## NFVO properties overview

After the bootstrap procedure the NFVO's configuration file is located at:
```bash
/etc/openbaton/openbaton-nfvo.properties
```

This is a property file that is used to configure the *Spring* environment and the **NFVO**. Since the component is based on the Spring framework some parameters are inherited, for a deeper explanation on all the parameters meaning, please refer to the [Spring documentation][spring-properties].

Keep in mind that whenever some of the parameters below referred are changed, you will need to restart the NFVO.

### Modify NFVO General properties

**IMPORTANT NOTES:**

By default RabbitMQ is installed on the host of the NFVO. Be aware of the fact that if you want any of your additional external components to be executed on a different host, you will need RabbitMQ to be reachable also from the outside.  

In general, also the NFVO can be executed on a different host changing the following properties of the _/etc/openbaton/openbaton.properties_ file:
```properties
nfvo.rabbit.brokerIp = localhost
```

to:

```properties
nfvo.rabbit.brokerIp = <the rabbitmq broker ip>
```

Again, this property is very important to be set to the broker ip reachable from outside the machine were is running.

#### Additional rabbitMQ paramters required by the NFVO

```parameters
nfvo.rabbit.management.port=15672
# Set the queues to be autodeleted after the shut down
nfvo.rabbitmq.autodelete=true
nfvo.rabbitmq.durable=true
nfvo.rabbitmq.exclusive=false
```


#### Parameters related with NFVO behaviour runtime

This property allows the user to delete the Network Service Records no matter in which status they are. Please note that in any case it is possible to remove a Network Service Record in _NULL_ state.

```properties
# nfvo behaviour
nfvo.delete.all-status = true
# if true, after deleting a NSR, the nfvo will wait for "nfvo.delete.vnfr.wait.timeout" after that timeout the VMs and VNFR will be deleted anyway from the NFVO
nfvo.delete.vnfr.wait.timeout=20
nfvo.delete.vnfr.wait=true

nfvo.history.clear=false
nfvo.history.level=1
nfvo.history.max-entities=250
```

#### Initial admin password

The initial admin password is set via the configuration file property:

```properties
nfvo.security.admin.password=openbaton
```

Please bare in mind that if the property is modified via APIs/dashboard, the change *won't be reflected in this file*.

#### Parameters related with the monitoring system

**MONITORING:** Open Baton allows the monitoring of the VMs on top of which the VNFs are executing via an external monitoring system. At the moment Zabbix is the monitoring system supported.
If you want to enable it, you need first to install and configure Zabbix server following the guide at this page [Zabbix server configuration][zabbix-server-configuration-3.0].
Once the Zabbix server is correctly configured and running, you only need to add the following property:

```properties
nfvo.monitoring.ip = the Zabbix server ip
```
Every time a new Network Service is instantiated, each VNFC (VM) is automatically registered to the Zabbix server.


#### Parameters related with the marketplace

This parameters allow you to modify the marketplace IP, in case you want to use a different catalogue for providing VNF Packages.

```properties
nfvo.marketplace.ip=marketplace.openbaton.org
nfvo.marketplace.port=8080
```

#### Parameters related with plugins and drivers

The following properties are related to the plugin mechanism used for loading VIM and Monitoring instances.

```properties
# Setting the number of plugin active consumers
nfvo.plugin.active.consumers=10
nfvo.plugin.install=true
# directory for the vim driver plugins
nfvo.plugin.installation-dir=./plugins
nfvo.plugin.log.path=./plugin-logs
nfvo.plugin.wait=true
# timeout for plugin operations
nfvo.plugin.timeout=300000
```

where the `nfvo.plugin.installation-dir` is the directory where all the jar files are located. Each of these plugins implement the VIM interface (see the [VIM driver documentation][vim-driver]), and will be automatically started by the NFVO after booting.
While the `nfvo.plugin.log.path` defines the location where plugin log files will be available.


#### Parameters related with quota management

Modify this parameter in case you want to disable checking quota while deploying your network services. Be aware that the NFVO will request to the VIM its quota, so if quota is not properly set on the NFVI, you may have some issues with this. In case of any exceptions which come with some certain scenarios, you can also avoid failing on exceptions by changing the `nfvo.quota.check.failOnException` to `false`.

```properties
nfvo.quota.check=false
nfvo.quota.check.failOnException = true
```

Please consider also the property `nfvo.vim.drivers.allowInfiniteQuota` explained in the next section for the quota management during the allocate resources mechanism

#### Addition parameters for the NFVO and VNFM tuning
```parameters
# Execute the start event sequentially and in order based on the VNFDependencies. This implies the NSD not to have cycling dependencies
nfvo.start.ordered=false
# It can be used for enabling/disabling an active check to the VIM authentication URL
nfvo.vim.active.check=true
# Allow infinite quotas during the GRANT_OPERATION
nfvo.vim.drivers.allowInfiniteQuota=false
nfvo.vim.delete.check.vnfr=true
```

Those properties are needed in case you want to tune a bit the performances of the NFVO. When the VNFMs send a message to the NFVO, there is a pool of threads able to process these messages in parallel. These parameters allow you to change the pool configuration. For more details please check the [spring documentation regarding thread pool executor][spring-doc-thread-pool].

```properties
# Thread pool executor configuration
# for info see http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html
nfvo.vmanager.executor.corepoolsize = 20
nfvo.vmanager.executor.maxpoolsize = 30
nfvo.vmanager.executor.queuecapacity = 500
nfvo.vmanager.executor.keepalive = 30
# if true, deleting the nsd will remove also its vnfd
nfvo.vnfd.cascade.delete=false
# if true, deleting the vnfd will remove also its vnfpackage
vnfd.vnfp.cascade.delete=true
```

#### Enable SSL
By default SSL is disabled. Comment out those parameters in case you want to enable it.

```parameters
#server.port=8443
#server.ssl.enabled=true
#server.ssl.key-store=/etc/openbaton/keystore.p12
#server.ssl.key-store-password=password
#server.ssl.keyAlias=tomcat
#server.ssl.keyStoreType=PKCS12
#nfvo.https=false
```

### Modify logging levels

Feel free to modify that file for adding or removing specific functionalities.  For instance, you can decide to change logging levels (TRACE, DEBUG, INFO, WARN, and ERROR) and mechanisms:

```properties
#########################################
########## Logging properties ###########
#########################################

logging.level.org.springframework=WARN
logging.level.org.hibernate=WARN
logging.level.org.apache=WARN

# Level for loggers on classes inside the root package "org.project.openbaton" (and its sub-packages)
logging.level.org.openbaton=INFO

# Direct log to a log file
logging.file=/var/log/openbaton.log
```

### Modidy DB properties

Depending on the installation mode you selected, it may be that you have an in-memory database. In order to reconfigure the NFVO to use a persistent database, like MySQL, you need to change the properties as shown below:

```properties
#########################################
############# DB properties #############
#########################################

spring.datasource.username=admin
spring.datasource.password=changeme

# JDBC configurations' values for HSQL:
#       jdbc:hsqldb:file:/tmp/openbaton/openbaton.hsdb
#       org.hsqldb.jdbc.JDBCDriver
#       org.hibernate.dialect.HSQLDialect
# JDBC configurations' values for MYSQL:
#       jdbc:mysql://localhost:3306/openbaton
#       org.mariadb.jdbc.Driver
#       org.hibernate.dialect.MySQLDialect
#
# Active configurations by default MySQL:
spring.datasource.url=jdbc:mysql://localhost:3306/openbaton
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=false
# ddl-auto available values: create-drop, update
spring.jpa.hibernate.ddl-auto=update

# MYSQL configuration (enable it in order to avoid timeout exceptions)
#spring.datasource.validationQuery=SELECT 1
#spring.datasource.testOnBorrow=true
```

Where:
* _spring.datasource.username_ and _spring.datasource.password_ need to be adapted to the mysql username and password.
* _spring.jpa.hibernate.ddl-auto_ has to be set to **update** if you want the NFVO **not** to drop all the tables after being shut down and to make it reuse the same tables after restarting.

For more details please see the [Spring Documentation][spring-doc] regarding the configuration parameters.


### Modify RabbitMQ parameters

These are additional parameters about the configuration of Rabbit MQ:

```properties
#########################################
############## RabbitMQ #################
#########################################

# Comma-separated list of addresses to which the client should connect to.
#spring.rabbitmq.addresses=${nfvo.rabbit.brokerIp}
# Create an AmqpAdmin bean.
spring.rabbitmq.dynamic=true
# RabbitMQ host.
spring.rabbitmq.host=${nfvo.rabbit.brokerIp}
# Acknowledge mode of container.
#spring.rabbitmq.listener.acknowledge-mode=
# Start the container automatically on startup.
#spring.rabbitmq.listener.auto-startup=true
# Minimum number of consumers.
spring.rabbitmq.listener.concurrency=5
# Maximum number of consumers.
spring.rabbitmq.listener.max-concurrency=30
# Number of messages to be handled in a single request. It should be greater than or equal to the transaction size (if used).
#spring.rabbitmq.listener.prefetch=
# Number of messages to be processed in a transaction. For best results it should be less than or equal to the prefetch count.
#spring.rabbitmq.listener.transaction-size=
# Login user to authenticate to the broker.
spring.rabbitmq.username=admin
# Login to authenticate against the broker.
spring.rabbitmq.password=openbaton
# RabbitMQ managementPort.
spring.rabbitmq.port=5672
# Requested heartbeat timeout, in seconds; zero for none.
spring.rabbitmq.requested-heartbeat=60
# Enable SSL support.
#spring.rabbitmq.ssl.enabled=false
# Path to the key store that holds the SSL certificate.
#spring.rabbitmq.ssl.key-store=
# Password used to access the key store.
#spring.rabbitmq.ssl.key-store-password=
# Trust store that holds SSL certificates.
#spring.rabbitmq.ssl.trust-store=
# Password used to access the trust store.
#spring.rabbitmq.ssl.trust-store-password=
# Virtual host to use when connecting to the broker.
#spring.rabbitmq.virtual-host=
```


[spring]:https://spring.io
[spring-doc]:http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
[spring-properties]: http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
[spring-doc-thread-pool]:http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html
[localhost:8080]:http://localhost:8080/
[vim-driver]:vim-driver-create
[generic-vnfm]:vnfm-generic-configuration
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[zabbix-server-configuration-3.0]:zabbix-server-configuration-3.0.md
