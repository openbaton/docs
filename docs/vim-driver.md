# VIM Drivers

Open Baton uses the Remote Procedure Call (RPC) mechanism for implementing VIM drivers. It offers an implementation of an interface that is used by the NFVO. 

## What are the supported VIM types?

By default the NFVO is installed with the two following VIM drivers: 

* [openstack]: for deploying virtualized resources on top of OpenStack
* [amazon]: for deploying virtualized resources on top of Amazon AWS  
* [docker]: for deploying virtual containers on top of Docker or Docker Swarm
* [test]: for testing purposes implementing a VIM mockup

The NFVO uses a driver mechanism for interacting with VIMs. 
Inside the NFVO folder is a folder called `plugins` where the binary file that implements the interface to your VIM ( i.e. [Openstack][openstack-link] ) should be placed (you can change the folder where Open Baton searches for the plugins by changing the variable `nfvo.plugin.installation-dir` in the `openbaton.properties` file under /etc/openbaton).  
This binary file is the implementation of the interface that communicates with your VIM.

**Note**: You can implement your own interface just follow the documentation on writing your own [VIM driver][vim-driver].

[amazon]: amazon-driver.md
[docker]: docker-driver.md
[marketplace-drivers]: http://marketplace.openbaton.org/#/
[openstack-link]:https://www.openstack.org/
[vim-driver]:vim-driver-create.md
[openstack]: openstack-driver.md
[test]: test-driver.md