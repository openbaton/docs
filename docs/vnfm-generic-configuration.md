# How to configure the Generic VNFM 

This guide explains you how to configure the Generic VNFM after installation is completed. In general, after using the bootsrap procedure no changes described here are required unless you want to tune up your installation. 

## Generic VNFM properties overview


After the bootstrap procedure the Generic VNFM's configuration file should be located under /etc located at: 
```bash
/etc/openbaton/openbaton-gvnfm.properties
```

Keep in mind that whenever some of the parameters below referred are changed, you will need to restart the NFVO.


### modify RabbitMQ parameters

By default RabbitMQ maybe installed on the same host where the generic VNFM is running. Be aware of the fact that if you want the Generic VNFM to interact with the NFVO you will need RabbitMQ to be reachable also from the outside.  

**IMPORTANT NOTES:**

The Generic VNFM uses RabbitMQ to interact with the EMS agent installed inside VMs (ececuting VNF software). Therefore, you will need to configure the RabbitMQ endpoint (**vnfm.rabbit.brokerIp**) with the reachable IP of RabbitMQ (instead of localhost).
from:
```properties
vnfm.rabbitmq.brokerIp = localhost 
```
to:
```properties
vnfm.rabbitmq.brokerIp = <the rabbitmq broker ip>
``` 

#### additional rabbitMQ paramters required by the Generic VNFM:

```parameters
vnfm.rabbitmq.autodelete = true
vnfm.rabbitmq.durable = true
vnfm.rabbitmq.exclusive = false
vnfm.rabbitmq.minConcurrency = 15
vnfm.rabbitmq.maxConcurrency = 30

# Timeout in seconds for any sendAndReceive
vnfm.rabbitmq.sar.timeout = 1000
```

### parameters related with the EMS

```parameters
vnfm.ems.queue.autodelete = true
vnfm.ems.queue.heartbeat = 120
vnfm.ems.version = 0.20

# Timeout in seconds for waiting the EMS to boot
vnfm.ems.start.timeout = 500

# delete the script where last modified is older than vnfm.ems.script.old (in minutes)
vnfm.ems.script.old = 180
#where the script log are stored
vnfm.ems.script.logpath = /var/log/openbaton/scriptsLog/
vnfm.ems.userdata.filepath = /etc/openbaton/openbaton-vnfm-generic-user-data.sh
#RabbitMQ credentials passed to ems
vnfm.ems.username = admin
vnfm.ems.openbaton = openbaton
```

### Modify logging levels 

Feel free to modify that file for adding or removing specific functionalities.  For instance, you can decide to change logging levels (TRACE, DEBUG, INFO, WARN, and ERROR) and mechanisms:

```parameters
#########################################
############### logging ################
#########################################

logging.level.org.springframework=WARN
# logging.level.org.springframework=INFO
logging.level.org.hibernate=WARN
logging.level.org.jclouds=WARN
logging.level.org.springframework.security=WARN
# logging.level.org.springframework.amqp=DEBUG

# Level for loggers on classes inside the root package "de.fhg.fokus.ngni.osco" (and its
# sub-packages)
logging.level.org.openbaton = DEBUG

logging.file=/var/log/openbaton/generic-vnfm.log
```

### Modify RabbitMQ parameters

These are additional parameters about the configuration of Rabbit MQ:

```parameters
#########################################
############## RabbitMQ #################
#########################################

# Comma-separated list of addresses to which the client should connect to.
# spring.rabbitmq.addresses= 192.168.145.54
# Create an AmqpAdmin bean.
spring.rabbitmq.dynamic=true
# RabbitMQ host.
spring.rabbitmq.host= ${vnfm.rabbitmq.brokerIp}
# Acknowledge mode of container.
# spring.rabbitmq.listener.acknowledge-mode=
# Start the container automatically on startup.
# spring.rabbitmq.listener.auto-startup=true
# Minimum number of consumers.
spring.rabbitmq.listener.concurrency= 15
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
spring.rabbitmq.requested-heartbeat = 60
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
