# Identity management

Open Baton provides several mechanisms for managing users, roles and projects. When accessing the dashboard, you will be prompted for a username and password. 
The first access can only be done with the super user created during the installation. Then it is possible to create other users and projects. The super user password is set while installing the platform.

### Roles and projects

Open Baton security model consists of different users, roles and projects.

A project can be used for isolating a group of users from the others and/or VNFs. Users can be assigned to projects and adopt a different role per project. Changes made in a project's environment are not visible from another project. 
When the NFVO starts a default project is created. Every project has a **unique** name and a project-id.  

A user can have the role *USER* or *GUEST* in a project. Administrators with the role *ADMIN* has control over the whole system. He may add and delete users and projects, assign roles and he has access to all the projects. When starting the NFVO there will be already one super user (with the role of an *ADMIN*) defined by default with the user name *admin* and the password chosen during installation (**openbaton** by default)

The password can be changed in the top right corner of the dashboard, by clicking on the username drop down menu.

A user with the role *USER* in some specific projects, can create, delete and update PoPs, NSD, VNFD, VNFPackages, NSR and VNFR only inside his projects. He cannot access or modify other projects or users.

A user with the role *GUEST* can just see the components (PoPs, NSD, NSR etc.) of the project he is assigned to but he cannot create, update or delete them. Furthermore he does not see other projects and users.

### Enabling SSL

The NFVO can use SSL to encrypt communication on the norhbound REST APIs. To enable this feature set

```properties
server.ssl.enabled = true
server.port: 8443
server.ssl.key-store = /etc/openbaton/keystore.p12
server.ssl.key-store-password = password
server.ssl.keyStoreType = PKCS12
server.ssl.keyAlias = tomcat
```
in the *openbaton.properties* file.  

Start the NFVO and it will use SSL from now on and run on port 8443 instead of 8080, but port 8080 is redirected to 8443. To access the dashboard the use of https is required.
It is also possible to specify different key store file or even third part authorities. For a deep documentation of this feature please refer to [the Spring Doc and Tutorials](https://spring.io/guides/tutorials/bookmarks/)

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
