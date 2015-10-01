# Install NFVO

The NFVO is implemented in java using the [spring.io] framework. For more details about the NFVO architecture, you can refer to the extend it section.

## install the latest NFVO version from the source code

The NFVO can be installed using different mechanisms. In this how to we will show you how to instantiate it using directly from the git repo. 

The NFVO uses the Java Messaging System for communicating with the VNFMs. Therefore it is a prerequisites to have ActiveMQ up and running. To facilitate the installation procedures we provide an installation script which can be used for installing the NFVO and the prerequired libraries. Considering that this script needs to install some system libraries, it is required to execute it as super user. 

```bash
sudo su -
curl -fsSkL https://gitlab.fokus.fraunhofer.de/openbaton/bootstrap/raw/develop/openbaton.sh |bash
```

At the end of the installation procedure, if there are no errors, the dashboard should be reachable at: [localhost:8080]. At this point the NFVO is ready to be used. Please refer to the NFVO user guide for how to start using it. 

## Let's move to the next step

Dependening on the approach used for deploying your VNF, you'll have either to install the generic-VNFM or install and register your own VNFM
 
[spring.io]:https://spring.io/
[localhost:8080]:http://localhost:8080/