# On board Network Service Descriptor

After saving the NSD (giving json as format to the file) you could easily upload it via the [Dashboard][dashboard] or the [Command Line Interface][cli].

## On boarding NSD via the dashboard

You have three options for on boarding a new NS Descriptor:

1. Composing VNFs selected from the catalogue
2. Uploading the JSON file
3. Uploading the TOSCA CSAR in case you choose the TOSCA descriptor format

### Option 1
Create a NSD by using the VNFD from the Packages, just click on the button "Create NSD".
This is the form which allows you to choose the VNFDs to be used in the NSD come from the Catalogue (and contained inside the VNFPackages)

![NSD create by VNFDs][NSDcreateSelect]

In the picture below you can see how to add a VNF Dependency to the NSD and possible parameters by clicking on *Add new dependency*

![Add VNF Dependency NSD][NSDcreateDependency]

### Option 2

Upload a JSON file that contains the NSD

![NSD create by File][NSDcreateFile]


<!---
References
-->

[dashboard]:nfvo-how-to-use-gui.md
[cli]:nfvo-how-to-use-cli.md
[launchNSD1]:images/gui-launch-pop.png
[launchNSD2]:images/gui-launch-key.png
[NSDcreateFile]:images/nfvo-how-to-use-gui-NSD-create-file.png
[NSDcreateFile]:images/nfvo-how-to-use-gui-NSD-create-file.png
[NSDcreateForm]:images/nfvo-how-to-use-gui-NSD-create-form.png
[NSDcreateSelect]:images/form-create-NSD.png
[NSDcreateDependency]:images/form-add-dependecy-pkg.png

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
