# How to use OpenBaton

After completing the installation, you should be able to reach the dashboard of the NFVO at the following url: http://your-ip-here:8080

When accessing the dashboard, you will be prompted for a username and password. The first access can only be done with the super user ("admin") created during the installation process. Please refer to the [Identity Management][security] section for more information about security mechanisms.

In order to use Open Baton for launching your first Network Service, you will need to follow these steps:

1. Install a VIM driver. [Learn more here][vim-driver]
2. Register one or more Point of Presences (PoPs). [Learn more here][vim-registration]
3. Install a VNF Manager
4. Build or download one or more VNF Packages
5. Prepare the Network Service Descriptor (NSD)
6. Launch the NSD

Once these steps are completed you will be able to orchestrate your Network Service from the dashboard or via the [REST APIs][rest-api]. 

[dashboard]: nfvo-how-to-use-gui
[generic]: vnfm-generic
[juju]: vnfm-juju
[vim-driver]: vim-driver
[vim-registration]: vim-instance
[rest-api]: http://get.openbaton.org/api/ApiDoc.pdf
[security]: security


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
