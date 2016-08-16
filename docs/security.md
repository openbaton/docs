# First access to the Open Baton platform

When accessing the dashboard, you will be prompted for a username and password. The first access can only be done with the super user created during the installation. Then it is possible to create other users and projects. For the configuration of the first access please follow this guide.

### Roles and projects

Openbaton's security model consists of different user roles and projects.

A project is a separate realm in which permitted users can work. Users can be assigned to projects and adopt different roles. Changes made in a project's environment are not visible from another project. When the NFVO starts a default project is created. Every project has a **unique** name and a project-id.  

A user can have the role *USER* or *GUEST* in a project. Administrators with the role *ADMIN* has control over the whole system. He may add and delete users and projects, assign roles and has access to all the projects. When starting the NFVO there will be already the super user (with the role of an *ADMIN*) defined by default with the user name *admin* and the default password *openbaton*.

The default password can be changed by setting 
```properties
nfvo.security.admin.password = 
```
in *openbaton.properties*.  

The next available role is *USER*. If a user is the *USER* of a project he can create, delete and update PoPs, NSD, VNFD, VNFPackages, NSR and VNFR in his projects. He cannot access or see other projects or users.

The last role is the *GUEST*. He can just see the components (PoPs, NSD, NSR etc.) of the project he is assigned to but he cannot create update or delete them. Furthermore he does not see other projects and users.

### SSL

The NFVO can use SSL to encrypt communication. To enable this feature set 
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
