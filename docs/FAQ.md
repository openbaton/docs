# Frequently Asked Questions (FAQ)


### Q1: What type of database is the NFVO using?

The NFVO uses Hibernate for managing transactions with a relational database. By default the NFVO is configured with an in memory database (HSQL).
Other types of databases are supported, for instance MySQL.  
This can be changed by setting the following properties in the /etc/openbaton/openbaton.properties file:
```
spring.datasource.url=jdbc:mysql://localhost:3306/openbaton?useSSL=false
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Q2: The EMS does not register to the VNFM and the connection timeouts (a.k.a. No EMS Found for VNF with id ...)

Double check that you configured correctly the `openbaton.properties` with the correct IP of the host where the NFVO is running

```properties
# The broker ip that needs to be reachable from all the components
nfvo.rabbit.brokerIp = the broker ip here
```

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
