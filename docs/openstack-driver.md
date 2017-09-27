# OpenStack VIM Driver

The OpenStack driver allows the NFVO and/or the VNFM to interact with the a PoP managed by OpenStack. 
The OpenStack driver source code is available at [this GitHub repository](https://github.com/openbaton/openstack4j-plugin)

It uses the [OpenStack4J][openstack4j] library providing a set of Java APIs for calling OpenStack REST APIs. 
 
## Prerequisites

There are no major prerequisites for deploying VNFs on top of OpenStack, unless you want to start making use of dynamic floating IPs allocation, etc. 

First important assumption is that you have configured an external network which could be associated via a router to any private network of your tenant. 

The best would be to use the user account of an admin, while registering the PoP ([refer to PoP registration section][pop-registration]), so that the NFVO 
has full rights to create new routers, new networks, and attach them together. In case of no-admin user rights, the NFVO should still be able to use the networks 
which have been already created for that tenant, and allocate floating IPs. 

## Limitations

Security groups have to be created in advance, and same rules are applied to all the network services that are deployed on that PoP. 


[openstack4j]: http://www.openstack4j.com/
[pop-registration]: pop-registration.md