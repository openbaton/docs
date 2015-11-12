## Install OpenBaton

This how-to will walk you through getting started with OpenBaton. In particular it will show you how you can setup and configure its main components. It will also show you how to write your Network Service Descriptor and create your own Virtual Network Function Package and deploy it on your PoPs. 

OpenBaton comprises different components:

* the Network Function Virtualisation Orchestrator (NFVO), always required for creating a composition of differnet Virtual Network Function Descriptors
* generic-VNFM, needed only when the VNFP approach is used. Using the generic-VNFM implies also the usage of the EMS which is automatically installed on the VDUs where VNF are to be installed. 

![Setup architecture][install-architecture]


### Before you start 

First of all it is important to clarify the different deployment options. Depending on your requirements OpenBaton, using a plugin mechanism, supports different VIM implementations. In particular, in this relesae, two different vim plugins are available: 

* test-plugin: it is a mockup of the VIM interface which is quite useful for development. It basically does not create any real virtual resources and it can be used for developing new features on the NFVO without having to always deploy new services;
* openstack-plugin: it provides an implementation of the VIM interface to OpenStack for requesting resources. 

Depending on which one is your target provider, you will need to configure runtime different Point of Presence (PoP). This is something which will be explained later on in this user guide. 

### Let's move on

Next step is to [install the NFVO][nfvo-installation].

[nfvo-installation]:nfvo-installation
[install-architecture]:images/install-architecture.png

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
