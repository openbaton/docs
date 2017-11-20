# Launch your first Network Service 

After completing the installation, you should be able to reach the dashboard of the NFVO at the following url: http://your-ip-here:8080

When accessing the dashboard, you will be prompted for a username and password. The first access can only be done with the super user ("admin") created during the installation process (the default value is "openbaton"). Please refer to the [Identity Management][security] section for more information about security mechanisms. 
Please refer to the following documentation for learning how to use the [Open Baton dashboard][dashboard] or the [Command Line Interface][cli]

In order to use Open Baton for launching your own Network Service, assuming that you have followed the installation guide and you have the different components up and running, you will need to follow these steps:

1. Register one or more Point of Presences (PoPs). [Learn more here][vim-registration]
2. Build or download one or more VNF Packages. [Learn more here][vnf-pacakge]
3. On board VNF Packages. [Learn more here][onboard-vnf-pacakge]
3. Prepare the Network Service Descriptor (NSD). [Learn more here][ns-descriptor]
4. Launch the NSD, either using the [Learn more here][dashboard] or the [CLI][cli]

You can also follow one of the tutorials provided in the [next][tutorials] section to get started immediately. 

[cli]: nfvo-how-to-use-cli
[dashboard]: nfvo-how-to-use-gui
[generic]: vnfm-generic
[juju]: vnfm-juju
[ns-descriptor]: ns-descriptor
[onboard-vnf-pacakge]: vnf-package-onboard.md
[vim-driver]: vim-driver
[vim-registration]: pop-registration.md
[vnfm-intro]: vnfm-intro
[vnf-pacakge]: vnf-package
[rest-api]: http://get.openbaton.org/openbaton-nfvo-api/
[security]: security
[tutorials]: tutorial.md


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
