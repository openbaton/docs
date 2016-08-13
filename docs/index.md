## Open Baton
Open Baton is an open source project providing a comprehensive implementation of the ETSI Management and Orchestration (MANO) specification. 

## What is NFV  
ETSI NFV represents a concerted telco operator initiative fostering the development of virtual network infrastructures by porting and further adapting network functions to the specific cloud environment. 
ETSI NFV has defined a large set of virtualisation use cases, spanning from the cloudification of the main core network functions such as IMS, Evolved Packet Core, and Radio Access Networks, as well as providing on demand and complete virtualised infrastructures as IaaS or PaaS to third parties, such as enterprises and professional radio. 
That enables providing elastic deployments of cost efficient network infrastructures.
One of the main concerns of ETSI NFV is to prove the feasibility of the cloud deployments of the typical network functions through proof of concept trials and prototypes as well as providing indications for further standardization in the areas of underlying infrastructures, software architectures, networking and management, and orchestration to improve performance and grant security of the overall infrastructure.
ETSI NFV limits itself to this level of indications, considering that other standardization bodies and de-facto open source standards such as 3GPP and OpenStack should finalize the specific implementation work. 

## Its main components
Open Baton rel.2 provides the many different features and components. 

* A Network Function Virtualisation Orchestrator (NFVO) completely designed and implemented following the ETSI MANO specification. Read more [here][nfvo]
* A generic Virtual Network Function Manager (VNFM) able to manage the lifecycle of VNFs based on their descriptors. Read more [here][vnfm-generic]
* A plugin mechanism for adding and removing different type of VIMs without having to re-write anything in your orchestration logic. Read more [here][vim-plugin]
* A powerful event engine useful based on a pub/sub mechanism for the dispatching of lifecycle events execution
* An autoscaling engine which can be used for automatic runtime management of the scaling operation operations of your VNFs. Read more [here][autoscaling-system]
* A fault management system which can be used for automatic runtime management of faults which may occur at any level. Read more [here][fm-system]
* It integrates with the Zabbix monitoring system. Read more [here][zabbix-plugin]
* A set of libraries (the openbaton-libs) which could be used for building your own VNFM. Read more [here][openbaton-libs]

![Setup architecture][install-architecture]

## Can I plug in my Network Functions?
Yes, this is possible using two different approaches:

* integrating your own VNFM. In this case you can use either the REST interface, or the AMQP one for interoperating with the NFVO
* implementing a set of scripts which can be executed as part of the lifecycle event of your Virtual Network Function Descriptor. We provide a generic VNFM and EMS which can be used for executing them

## Can I use Open Baton to build my own Network Service?
Yes! Open Baton provides a NFVO which can interoperate with VNFMs implemented by third parties. In this project we provide also a set of tools (like the vnfm-sdk) which supports developers in building their own VNFM. 

## Get started 
In order to get started you can follow the [installation guide][install-guide]

## Get in contact 

* Via twitter: [twitter][openbaton]
* Subscribing to our mailing list: [users-at-openbaton-dot-org]
* Sending us an email to: [info-at-openbaton-dot-org]

## Supported by
Open Baton is a project developed by Fraunhofer FOKUS and TU Berlin. It is supported by different European publicly funded projects: [NUBOMEDIA][nubomedia], [Mobile Cloud Networking][mcn], [CogNet][cognet], [SoftFIRE][softfire].

[install-guide]:nfvo-installation
[openbaton]:https://twitter.com/openbaton
[users-at-openbaton-dot-org]: mailto:listen@openbaton.org?subject=subscribe%20users
[info-at-openbaton-dot-org]: mailto:info@openbaton.org
[nubomedia]: https://www.nubomedia.eu/
[mcn]: http://mobile-cloud-networking.eu/site/
[cognet]: http://www.cognet.5g-ppp.eu/cognet-in-5gpp/
[fm-system]: https://github.com/openbaton/fm-system
[autoscaling-system]: https://github.com/openbaton/autoscaling
[zabbix-plugin]: zabbix-plugin
[softfire]: https://www.softfire.eu/
[openbaton-libs]: https://github.com/openbaton/openbaton-libs
[vim-plugin]: vim-plugin
[vnfm-generic]: vnfm-generic
[nfvo]: nfvo-installation
[install-architecture]:images/install-architecture-rel.2.png

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
