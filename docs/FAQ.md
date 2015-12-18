# Frequently Asked Questions (FAQ)


### Q1 What type of database is the NFVO using?

The NFVO uses Hibernate for managing transactions with a relational database. By default the NFVO is configured with an in memory database (HSQL). 
Other types of databases are supported, for instance MySQL. This can be changed directly from the configuration file, outcommenting the : 
```
# mysql jdbc
spring.datasource.url=jdbc:mysql://localhost:3306/openbaton
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
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
