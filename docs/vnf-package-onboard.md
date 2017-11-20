# On board VNF Package

Once you have finalized the creation of VNF Packages and packed them into a tar we can onboard them to the NFVO. Make sure that you also uploaded a VimInstance before onboarding the package. Onboarding can be done easily via the [Dashboard][dashboard-link] or the [Command Line Interface][cli].

## Onboarding VNF Packages via the dashboard

On this page you can upload the **VNF Package**. For more information about the VNF Package please read the [VNF Package documentation] 
For uploading a _.tar_ you can click on the button **Upload VNFPackage** and this window will be shown where you can drag & drop the file or just click on the white area and choose your file using your file manager. You can also upload csar package instead of usual tar one, for this, just click on "Use CSAR parser" before sending the packages. 

![Drag&Drop modal][drag_drop]

After you click on the button **Upload All** the packages will be sent to the _NFVO_ and once the process is finished you will see the package appearing in the list


[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[VNF Package documentation]: vnf-package.md

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
