<img src="../images/docker-logo.png" alt="Vagrant" style="width: 100px;"/>

# Install Open Baton using Docker

This repository contains a number of deployment templates and instructions how to install Open Baton in containers.

The [Quick Start](#quick-start) provides the easiest and fastest way to bring up a working Open Baton framework without caring about any configuration. 
In addition, there are some other templates provided for additional scenarios in [this repository][github-bootstrap] allowing a better way of configuration and versioning.

## System Requirements
You will need:
- [Docker](https://www.docker.com/community-edition#/download) (>=18.03)
- [Docker Compose](https://docs.docker.com/compose/install/) (>=1.20)

## Quick Start
In one command you can start Open Baton by using docker-compose and the docker-compose.yml in this repository. 

It downloads the docker-compose.yml in the current folder via `curl` and executes `docker-compose up`. 
All configurations are contained in this compose file. Only the **HOST_IP** must be set to the actual IP of your host machine so that the virtual machines' Generic EMS can connect to the Generic VNFM via RabbitMQ. 

Install the latest release **6.0.0**:
```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/openbaton/bootstrap/6.0.0/docker-compose.yml | env HOST_IP=$YOUR_LOCAL_IP docker-compose up -d
``` 

Install the **latest** development version:
```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/openbaton/bootstrap/master/docker-compose.yml | env HOST_IP=$YOUR_LOCAL_IP docker-compose up -d
``` 

This basic deployment setup is there for a quick start and contains the following components:
* NFVO
* Generic VNFM
* Openstack4j driver
* Docker VNFM
* Docker driver
* RabbitMQ
* MySQL

These components are enough to make deployments in OpenStack and Docker.

After few minutes the Open Baton NFVO should be started, then you can open a browser and go on [localhost:8080]. To log in, the default credentials for the administrator user are:

```
user: admin
password: openbaton
```

[docker]: https://www.docker.com/
[docker-compose]: https://github.com/openbaton/bootstrap/tree/develop/distributions/docker/compose
[spring]: https://spring.io
[localhost:8080]:http://localhost:8080/
[use-openbaton]:use.md
[dummy-NSR]:dummy-NSR.md
[reference-to-rabbit-site]:https://www.rabbitmq.com/
[reference-to-op-repo-on-public-docker-hub]:https://hub.docker.com/r/openbaton/standalone/tags/
[github-bootstrap]: https://github.com/openbaton/bootstrap/

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
