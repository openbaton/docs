<img src="../images/docker-logo.png" alt="Vagrant" style="width: 100px;"/>

# Install Open Baton using Docker

This tutorial will guide towards the installation of a minimal Open Baton environment composed by the following components: 

* The NFVO implemented in java using the [spring.io][spring] framework. For more details about the NFVO architecture, you can refer to the next sections
* [RabbitMQ][reference-to-rabbit-site] as messaging system
* Test plugin for being able to execute the [hello world][dummy-NSR] tutorial without needing an OpenStack instance. 
* Generic VNFM for the instantiation of VNFs part of the Open Baton ecosystem 
* OpenStack plugin: for deploying VNFs on OpenStack. 

To have a running standalone Open Baton Docker container type the following commands:

```bash
sudo docker pull openbaton/standalone:<Open Baton version>
sudo docker run -d -h openbaton-rabbitmq -p 8080:8080 -p 5672:5672 -p 15672:15672 -p 8443:8443 -e RABBITMQ_BROKERIP=<RabbitMQ IP> openbaton/standalone:<Open Baton version>
```

*\*VERY IMPORTANT NOTE - You should put the Open Baton version which you would like to run. You can see which ones
  are available from [this][reference-to-op-repo-on-public-docker-hub] list \**

*\*VERY IMPORTANT NOTE - You should put as input for the RABBITMQ_BROKERIP the RabbitMQ IP making sure that this IP can be
  reached by external components (VMs, or host where will run other VNFMs) otherwise you will have runtime issues. 
  In particular, you should select the external IP of your host on top of which the docker container is running \**
  
After running the container you should see as output an alphanumeric string (which represents the Open Baton container's full ID running) similar to the following:

```bash
cfc4a7fb23d02c47e25b447d30f6fe7c0464355a16ee1b02d84657f6fba88e07
```

To verify that the container is running you can type the following command:

```bash
sudo docker ps -a
```

which output should be similar to the following:

```bash
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS                   PORTS                                                                                              NAMES
cfc4a7fb23d0        openbaton/standalone:2.1.1   "/usr/bin/supervisord"   49 seconds ago      Up 49 seconds            0.0.0.0:5672->5672/tcp, 0.0.0.0:8080->8080/tcp, 0.0.0.0:8443->8443/tcp, 0.0.0.0:15672->15672/tcp   admiring_lalande
```

To connect to the running container containing Open Baton you can type the following command:

```bash
sudo docker exec -ti cfc4a7fb23d02c47e25b447d30f6fe7c0464355a16ee1b02d84657f6fba88e07 bash
```

After few minutes the Open Baton NFVO should be started, then you can open a browser and go on localhost:8080.
To log in, the default credentials for the administrator user are:

```
user: admin
password: openbaton 
```

To stop and delete the running Open Baton container you can type respectively the following commands:

```bash
sudo docker stop cfc4a7fb23d02c47e25b447d30f6fe7c0464355a16ee1b02d84657f6fba88e07
sudo docker rm cfc4a7fb23d02c47e25b447d30f6fe7c0464355a16ee1b02d84657f6fba88e07
```


[spring]:https://spring.io
[localhost:8080]:http://localhost:8080/
[vim_plugin_doc]:vim-plugin
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[zabbix-server-configuration]:zabbix-server-configuration.md
[reference-to-op-repo-on-public-docker-hub]:https://hub.docker.com/r/openbaton/standalone/tags/

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
