# VNF Record States
-------------------

The states of a VNF Record are reflecting the [ETSI NFV states][etsi-state] and they are shown in the following picture.

![VNFR State Diagram][vnfr-states-diagram]

When the create NSR is called the VNF and the NSR are in state NULL. After the instantiate method is finished in the VNFManager, the corresponding VNFR state is set to INSTANTIATED. When all the VNFR are in state INSTANTIATED then also the NSR goes in state INSTANTIATED. Then in case the VNFR is target of a dependency, the MODIFY message is sent to the VNFManager and when it comes back to the NFVO, the VNFR status is set to INACTIVE. When all the VNFR are in state INACTIVE then also the NSR goes in state INACTIVE. In any case the START message is sent to the VNFManager and when it comes back, the NFVO set the VNFR state to ACTIVE. When all the VNFR are in state ACTIVE then also the NSR goes in state ACTIVE. Then when the terminate NSR is called, the NFVO sends to all the VNFManagers the TERMINATE message. When this message returns to the NFVO, the related VNFR state is set to TERMINATED. When all the VNFR are in state TERMINATED then the NSR is completely deleted from the database.

<!---
References
-->

[vnfr-states-diagram]: /images/state-diagram.png
[etsi-state]:http://www.etsi.org/deliver/etsi_gs/NFV-SWA/001_099/001/01.01.01_60/gs_NFV-SWA001v010101p.pdf

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