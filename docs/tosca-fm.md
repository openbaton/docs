#Fault Management in TOSCA
This is an example of how to use the Fault Management system with the yaml descriptor. 
The Fault Management specifics must be placed in the properties of the VDU node. 

This is an example of a VDU Node with a Fault Management Policy:

```yaml
VDU1:
  type: tosca.nodes.nfv.VDU
  properties:
    scale_in_out: 1
    fault_management_policy:
      fm1:                                      # Name of the Policy
        isVNFAlarm: true
        criteria:
          criteria1:                            # Criteria name
            parameter_ref: "net.tcp.listen[80]"
            function: "last()"
            comparison_operator: "="
            threshold: "0"
        period: 5
        severity: CRITICAL
  requirements:
    - virtual_link: CP1

```

More about Fault Management and how to se it up: [Fault Management][fm]


<!------------
References
-------------->
[TOSCA-simple-yaml-lifecycle]:http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766
[csar-tosca]:https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjVyb-Ll5PLAhXCDCwKHTh3AEAQFggdMAA&url=https%3A%2F%2Fwww.oasis-open.org%2Fcommittees%2Fdownload.php%2F46057%2FCSAR%2520V0-1.docx&usg=AFQjCNG-Xqjz_D4ZY8TbJGls58Hp7LdNBg&sig2=w7waCIxRy_-ODL7GyZNFUg

[tosca-iperf]:tosca-iperf-scenario
[metadata]:vnf-package
[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[tosca-vnf]:tosca-vnfd
[fm]:fault-management


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


