#Autoscaling in TOSCA
This is an example of how to create Auto-scale policies with the yaml descriptor. The whole Auto-scale policy goes in the **properties** of the Virtual Network Function node. 


```yaml
example-vnf:
  type: openbaton.type.VNF
  properties:
    # Other properties omitted for brevity
    auto_scale_policy:
      scale-out:                  # Policy name 
        threshod: 100
        comparisonOperator: ">="
        period: 30
        cooldown: 60
        mode: REACTIVE
        type: WEIGHTED
        alarms:
          alarm1:                 # Alarm name      
            metric: "system.cpu.load[percpu,avg1]"
            statistic: "avg"
            comparisonOperator: ">"
            threshold: 0.7
            weight: 1
        actions:
          action1:                # Action name
            type: SCALE_OUT
            value: "2"
            target: "<target>"

```

More about Autoscaling and how to se it up: [Autoscaling][as]


<!------------
References
-------------->
[TOSCA-simple-yaml-lifecycle]:http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html#_Toc430015766
[csar-tosca]:https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjVyb-Ll5PLAhXCDCwKHTh3AEAQFggdMAA&url=https%3A%2F%2Fwww.oasis-open.org%2Fcommittees%2Fdownload.php%2F46057%2FCSAR%2520V0-1.docx&usg=AFQjCNG-Xqjz_D4ZY8TbJGls58Hp7LdNBg&sig2=w7waCIxRy_-ODL7GyZNFUg

[tosca-iperf]:tosca-iperf-scenario
[metadata]:vnf-package
[drag_drop]:images/nfvo-how-to-use-gui-drag-drop.png
[tosca-vnf]:tosca-vnfd
[as]:autoscaling


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


