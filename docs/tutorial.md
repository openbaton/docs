# Open Baton Tutorials

This section provides you a set of tutorials for facilitating your first contact with Open Baton. Those tutorials makes use of VNF Packages and Network Service Descriptors that could also be downloaded directly from the Open Baton [Marketplace]

Each tutorial is organised in the following way: 

1. It describes the scenario that is going to be deployed
2. It provides a list of required components. Considering the specific scenario which will be deployed following the tutorial, it will specify what are the Open Baton components which are required for executing this specific tutorial
3. It specifies the list of steps which needs to be executed in order to run the tutorial

Below you can find a list of all the available tutorials including the list of components which are validated: 


| Name           | Description                            |  Components  |        
|----------------|----------------------------------------|--------------|
| Dummy NS       | Deploy a Network Service Record composed of Dummy VNFs. Kind of "hello-world" scenario  |   test VIM Driver, test VNFM |
| Iperf NS       | Deploy a network service that uses iPerf client and server    |   OpenStack VIM Driver, Generic VNFM |
| SIPp  NS       | Deploy a network service that uses SIPp client and server  |   OpenStack VIM Driver, Generic VNFM |
| OpenIMSCore NS | Deploy the OpenIMSCore Network Service |   OpenStack VIM Driver, Generic VNFM |
| OpenIMSCore NS with Juju VNFM      |   Deploy the OpenIMSCore Network Service using Juju as VNFM   |   OpenStack VIM Driver, Juju VNFM |
| Fault Management System      |  Deploy a network service that uses SIPp client and server showcasing the FMS    |   OpenStack VIM Driver, Generic VNFM, Zabbix Plugin, FMS |
| Docker Tutorial      |  Deploy a network service running as docker container     |   Docker VIM Driver, Docker VNFM |


[Marketplace]: http://marketplace.openbaton.org
