# Open Baton
Open Baton is an open source platform providing a comprehensive implementation of the ETSI NFV Management and Orchestration (MANO) specification.

![Open Baton architecture][architecture-release-4]

## Main components

Open Baton provides many different features and components:

* A Network Function Virtualisation Orchestrator (NFVO) completely designed and implemented following the ETSI MANO specification. Read more [here][nfvo]
* A generic Virtual Network Function Manager (VNFM) and Generic Element Management System (EMS) able to manage the lifecycle of VNFs based on their descriptors. Read more [here][vnfm-generic]
* A Juju VNFM Adapter in order to deploy Juju Charms or Open Baton VNF Packages using the Juju VNFM. Read more [here][juju-vnfm]
* A driver mechanism supporting different type of VIMs without having to re-write anything in the orchestration logic. Read more [here][vim-driver]
* A powerful event engine based on a pub/sub mechanism for the dispatching of the lifecycle events execution. Read more [here][events]
* An autoscaling engine which can be used for automatic runtime management of the scaling operation operations of your VNFs. Read more [here][autoscaling-system]
* A fault management system which can be used for automatic runtime management of faults which may occur at any level. Read more [here][fm-system]
* A network slicing engine which can be used to ensure a specific QoS for your NS. Read more [here][network-slicing-engine]
* A monitoring plugin integrating Zabbix as monitoring system. Read more [here][zabbix-plugin]
* A [Marketplace][marketplace] useful for downloading VNFs compatible with the Open Baton NFVO and VNFMs. Read more at [here][marketplace-doc]
* A set of libraries (in Java, Go and Python) which could be used for building your own VNFM. Read more [here][openbaton-libs]

## Get started
In order to get started, first step is to install the framework. You can follow the [installation guide][install-guide] for getting started immediately on several different Operating Systems / virtualization platforms.

## Learn more
Please refer to the "Tutorials" and "Learn More" sections for having more information on what you can do with Open Baton. You can also learn more via our video tutorials published on the Open Baton [Youtube Channel][youtube].

## Few words about ETSI NFV  
ETSI NFV represents a concerted telco operator initiative fostering the development of virtual network infrastructures by porting and further adapting network functions to the specific cloud environment.
ETSI NFV has defined a large set of virtualisation use cases, spanning from the cloudification of the main core network functions such as IMS, Evolved Packet Core, and Radio Access Networks, as well as providing on demand and complete virtualised infrastructures as IaaS or PaaS to third parties, such as enterprises and professional radio.
That enables providing elastic deployments of cost efficient network infrastructures.
One of the main concerns of ETSI NFV is to prove the feasibility of the cloud deployments of the typical network functions through proof of concept trials and prototypes as well as providing indications for further standardization in the areas of underlying infrastructures, software architectures, networking and management, and orchestration to improve performance and grant security of the overall infrastructure.
ETSI NFV limits itself to this level of indications, considering that other standardization bodies and de-facto open source standards should finalize the specific implementation work.

## Get in touch with the support teams

* Via twitter: [twitter][openbaton]
* Subscribing to our mailing list: [users-at-openbaton-dot-org]
* Sending us an email to: [info-at-openbaton-dot-org]

## Supported by
Open Baton is a project developed by Fraunhofer FOKUS and TU Berlin. It is supported by different European publicly funded projects: [NUBOMEDIA][nubomedia], [Mobile Cloud Networking][mcn], and [SoftFIRE][softfire]. Open Baton represents also one of the main components of the [5G Berlin][5g-berlin] initiative.  

[5g-berlin]: http://www.5g-berlin.org/
[autoscaling-system]: https://github.com/openbaton/autoscaling
[fm-system]: https://github.com/openbaton/fm-system
[network-slicing-engine]: https://github.com/openbaton/network-slicing-engine
[info-at-openbaton-dot-org]: mailto:info@openbaton.org
[architecture-release-4]:images/openbaton-arch-1.png
[install-guide]:nfvo-installation
[juju-vnfm]:vnfm-juju
[marketplace]: http://marketplace.openbaton.org
[marketplace-doc]: marketplace
[mcn]: http://mobile-cloud-networking.eu/site/
[nfvo]: nfvo-installation
[nfvo-intro]: use
[nubomedia]: https://www.nubomedia.eu/
[openbaton-libs]: https://github.com/openbaton/openbaton-libs
[openbaton]:https://twitter.com/openbaton
[softfire]: https://www.softfire.eu/
[users-at-openbaton-dot-org]: mailto:listen@openbaton.org?subject=subscribe%20users
[youtube]: https://www.youtube.com/channel/UCYXY4rGKrKbBNheClFEKaAw
[zabbix-plugin]: zabbix-plugin
[vim-driver]: vim-driver
[vnfm-generic]: vnfm-generic
[events]: how-to-register-event

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
