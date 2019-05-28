# Image Repository

The image repository is part of the NFVO and contains images that can be uploaded to Open Stack VIMs. The purpose of this repository is to relieve the user of the need to upload images to Open Stack before launching a Network Service.


## How it works
Whenever a Network Service is launched, Open Baton checks if the required images are available on the chosen VIM instance. If the image is not available, it checks if a matching image is present inside the NFVO's image repository. If there is a suitable image, then the NFVO requests the Open Stack VIM Driver to upload the image to the Open Stack instance.


## Uploading images to the image repository
Images can be uploaded to the image repository via the dedicated page of the GUI or when [uploading VNF Packages][vnf-package-onboard]. VNF Packages can contain image descriptions that are automatically added to the image repository while uploading.

It is not possible to have two images with the same name inside the image repository.


## Images
The images inside the image repository contain properties which are needed in order to upload them to an Open Stack instance. For example the minimum amount of RAM or the disk format, but also the image file itself or a reference to it. You can either upload an image file together with the description of the image, or you can include a URL from where the image file can be fetched. In the former case, the image file is stored on the file system of the machine running the NFVO. The default directory used for storing the images is ```/etc/openbaton/nfvImages/```, but you can [configure][configure] this value to use a different directory. The file names in this directory correspond to the IDs of the images inside the image repository.




[iperf-link]:https://iperf.fr/
[iperf]: iperf-NSR.md
[dashboard-link]:nfvo-how-to-use-gui
[vnfd-link]:vnf-descriptor
[image-link]:http://cloud-images.ubuntu.com/trusty/current/trusty-server-cloudimg-amd64-disk1.img
[tosca-nfv]:https://docs.oasis-open.org/tosca/tosca-nfv/v1.0/tosca-nfv-v1.0.html
[csar-onboarding]:tosca-CSAR-onboarding
[cli]:nfvo-how-to-use-cli
[vim-driver]:vim-driver
[vnf-package-onboard]:vnf-package-onboard
[configure]:nfvo-configuration

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
