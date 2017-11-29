# Docker VIM Driver

This Vim Driver is able together with the [Docker VNFM][docker-vnfm] to deploy NS on top of a Docker engine.

Both VNFM and VIM Driver are necessary in order to be able to deploy NS over Docker.

It uses the [go-openbaton go sdk](https://github.com/openbaton/go-openbaton) allowing the NFVO to interoperate with this plugin using AMQP.
This plugin uses Docker go SDK as implementation of the Docker Engine API. The Docker VIM Driver source code is available at [this GitHub repository](https://github.com/openbaton/go-docker-driver)

## Download the VNFM

You can download the VNFM for docker [here](https://github.com/openbaton/go-docker-driver/releases/). Choose the appropriate distribution.

```bash
wget https://github.com/openbaton/go-docker-driver/releases/download/5.0.0/go-docker-driver-darwin-amd64 -O docker-driver
chmod +x docker-driver
```

Then run it as:

```bash
./docker-driver -conf config.toml
```

where the config.toml looks like:
```toml
type        = "docker"
workers     = 5
username    = "openbaton-manager-user"
password    = "openbaton"
logLevel    = "DEBUG"
brokerIp    = "localhost"
brokerPort  = 5672
```

or as:
```bash
./docker-driver
```
and the default values will be used.

Or you can skip all the code installation using docker:

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock openbaton/driver-docker-go driver-docker-go
```

## How to use the Docker VIM Driver

In order to upload a VimInstance using the docker driver, you need to upload a Vim Instance as follows:

```json
{
  "name": "vim-instance",
  "authUrl": "unix:///var/run/docker.sock",
  "tenant": "notenant",
  "username": "admin",
  "password": "openbaton",
  "type": "docker",
  "location": {
    "name": "Berlin",
    "latitude": "52.525876",
    "longitude": "13.314400"
  }
}
```

* **name** The Name of the Vim Instance
* **authUrl** either you pass the unix socket, in this case will use the socket running locally to the vim driver or the host connection string for remote execution
* **type** is _docker_

after uploading this Vim Instance, you should be able to see all images and networks in the PoP page of the NFVO dashbaord

## Prerequisites

In general, we expect that you are familiar with Docker Engine/Swarm. Those are the list of prerequisites to follow when you want to use the Docker VIM Driver:
The _go_ compiler has to be installed, please follow the go documentation on how to [download and install](https://golang.org/dl/) it.
The _dep_ command has to be installed in order to install also dependencies. [Go dependency management tool](https://github.com/golang/dep)


## Limitations

[docker-vnfm]: docker-vnfm.md
[fokus-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/fokus.png
[openbaton]: http://openbaton.org
[openbaton-doc]: http://openbaton.org/documentation
[openbaton-github]: http://github.org/openbaton
[openbaton-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/openBaton.png
[openbaton-mail]: mailto:users@openbaton.org
[openbaton-twitter]: https://twitter.com/openbaton
[tub-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/tu.png
[dummy-vnfm-amqp]: https://github.com/openbaton/dummy-vnfm-amqp
[get-openbaton-org]: http://get.openbaton.org/plugins/stable/
[pop-registration]: pop-registration.md
