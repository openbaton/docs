# VIM Drivers

Open Baton uses the Remote Procedure Call (RPC) mechanism for implementing VIM drivers. It offers an implementation of an interface that is used by the NFVO. 

## What are the supported VIM types?

By default the NFVO is installed with the two following VIM drivers: 

* openstack: for interoperating with an OpenStack instance
* test: for testing purposes implementing a VIM mockup

For each of those types there is a different implementation of the VIM API. The NFVO uses a driver mechanism for interacting with VIMs. Inside the NFVO folder is a folder called `plugins` where the binary file that implements the interface to your VIM ( i.e. [Openstack][openstack-link] ) should be placed (you can change the folder where Open Baton searches for the plugins by changing the variable `plugin-installation-dir` in the `openbaton.properties` file under /etc/openbaton).  
This binary file is the implementation of the interface that communicates with your VIM.

**Note**: You can implement your own interface just follow the documentation on writing your own [VIM driver][vim-driver].

## Where do I find the open source plugins?

Open Baton platform provides an openstack and a test plugin. They are automatically download by the bootstrap. Anyway they can be found on our [Marketplace][marketplace-drivers]

[marketplace-drivers]: http://marketplace.openbaton.org:8082/#/
[openstack-link]:https://www.openstack.org/
[vim-driver]:vim-driver-create.md
