# Frequently Asked Questions (FAQ)

# Q1 ActiveMQ:connection refused

I'm getting this error message: 
```
2015-10-01 11:40:49.475 ERROR 26648 --- [enerContainer-1] o.s.j.l.DefaultMessageListenerContainer  : Could not refresh JMS Connection for destination 'event-register' - retrying using FixedBackOff{interval=5000, currentAttempts=1, maxAttempts=unlimited}. Cause: Could not connect to broker URL: tcp://localhost:61616. Reason: java.net.ConnectException: Connection refused
```
Answer: double check that ActiveMQ is up and running: 
```
apache-activemq-5.11.1/bin/activemq status
```
if not running, you need to start it. 


# Q2 What type of database is the NFVO using?

The NFVO uses Hibernate for managing transactions with a relational database. By default the NFVO is configured with an in memory database (HSQL). 
Other types of databases are supported, for instance MySQL. This can be changed directly from the configuration file, outcommenting the : 
```
# mysql jdbc
spring.datasource.url=jdbc:mysql://localhost:3306/openbaton
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```


