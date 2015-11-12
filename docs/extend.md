# Extend OpenBaton
Being an open source implementation, OpenBaton can be easily extended for supporting additional features or capabilities.

### Extend the NFVO
The NFVO has been implemented as a java modular application using the Spring.io framework. It is pretty easy to add a new module for extending the supported features. Please refer to the [NFVO documentation][nfvo-documentation] for learning a bit more about the NFVO architecture.

It is possible to extend the NFVO by implementing new plugins. The options available is to implement a new Monitoring plugin or a new VIM plugin. The procedure is the same so we will explain how to write a VIM plugin, please see the [plugin sdk documentation page][vim-plugin]

Before doing that you can have a look inside the architecture of the NFVO in the [following page][nfvo-architecture]
<!---
References
-->

[nfvo-architecture]:nfvo-architecture
[vim-plugin]:vim-plugin
[nfvo-documentation]:nfvo-architecture


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