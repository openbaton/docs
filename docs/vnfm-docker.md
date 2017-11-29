# Docker VNFM for Open Baton

This VNF Manager, together with the [Docker Vim Driver](https://github.com/openbaton/go-docker-driver), allows Open Baton to deploy Container on top of a running [Docker](https://www.docker.com/) engine.
Both VNFM and VIM Driver are necessary in order to be able to deploy NS over Docker

## Requirements

The _go_ compiler has to be installed, please follow the go documentation on how to [download and install](https://golang.org/dl/) it.

The _dep_ command has to be installed in order to install also dependencies. [Go dependency management tool](https://github.com/golang/dep)


## Download the VNFM

You can download the VNFM for docker [here](https://github.com/openbaton/go-docker-vnfm/releases/tag/5.0.0). Choose the appropriate distribution.

```bash
wget https://github.com/openbaton/go-docker-vnfm/releases/download/5.0.0/go-docker-vnfm-darwin-amd64 -O docker-vnfm
chmod +x docker-vnfm
```

Check the usage

```bash
./docker-vnfm --help

Usage of docker-vnfm:
  -allocate
    	if the docker vnfm must allocate resources (must be true)
        (default true)
  -cert string
    	Use Handler for docker swarm services
        (default "/Users/usr/.docker/machine/machines/myvm1/")
  -conf string
    	The config file of the Docker Vim Driver
  -desc string
    	The description of the Docker Vim Driver(default "The docker vnfm")
  -dir string
    	The directory where to persist the local db (default "badger")
  -ip string
    	The Broker Ip (default "localhost")
  -level string
    	The Log Level of the Docker Vim Driver (default "INFO")
  -name string
    	The docker vnfm name (default "docker")
  -password string
    	The registering password (default "openbaton")
  -persist
    	to persist the local database using badger (default true)
  -port int
    	The Broker Port (default 5672)
  -swarm
    	Use Handler for docker swarm services
  -tsl
    	Use docker client with tsl
  -type string
    	The type of the Docker Vim Driver (default "docker")
  -username string
    	The registering user (default "openbaton-manager-user")
  -workers int
    	The number of workers (default 5)
exit status 2
```

Then run it as:

```bash
./docker-vnfm -conf config.toml
```

where config.toml looks like:

```toml
type        = "docker"
endpoint    = "docker"
allocate    = true
workers     = 1
description = "The Vnfm description"
username    = "openbaton-manager-user"
password    = "openbaton"
logLevel    = "INFO"
brokerIp    = "localhost"
brokerPort  = 5672
```

_**NOTE**_: the _allocate_ field is set to true, in order to let the VNFM to allocate containers.

If you don't need special configuration you can use the default values just by running:

```bash
./docker-vnfm
```

Even better using the docker image of the _go-docker-vnfm_:

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock openbaton/vnfm-docker-go vnfm-docker-go
```

# How to use the Docker VNFM

The Docker VNFM works with the upstream Open Baton NFVO, so no changes are needed. Some fields of the VNFD could have a different meaning. An example of a MongoDB VNFPackage follows

### The VNFD

```json
{
  "name": "MongoDB",
  "vendor": "TUB",
  "version": "0.2",
  "lifecycle_event": [],
  "configurations": {
    "configurationParameters": [{
      "confKey":"KEY",
      "value":"Value"
    }],
    "name": "mongo-configuration"
  },
  "virtual_link": [{
    "name": "new-network"
  }],
  "vdu": [{
    "vm_image": [
    ],
    "scale_in_out": 2,
    "vnfc": [{
      "connection_point": [{
        "virtual_link_reference": "new-network"
      }]
    }]
  }],
  "deployment_flavour": [{
    "flavour_key": "m1.small"
  }],
  "type": "mongodb",
  "endpoint": "docker"
}
```

* The _**Virtual Link**_ will be a new Docker Network created if not existing.
* The _**flavour_key**_ must be set to _m1.small_ (at the moment)  
* The _**vm_image**_ will be filled by the _metadata_ image name (see next section)  

### The Metadata.yaml

```yaml
name: MongoDB
description: MongoDB
provider: TUB
nfvo_version: 4.0.0
vim_types:
- docker
image:
  upload: "check"
  names:
      - "mongo:latest"
  link: "mongo:latest"
image-config:
  name: "mongo:latest"
  diskFormat: QCOW2
  containerFormat: BARE
  minCPU: 0
  minDisk: 0
  minRam: 0
  isPublic: false
```

Here you can see some differences:
* **vim_types** must have docker (pointing to the Docker VIM Driver)
* **image upload** can be put to check in order to execute `docker pull` with the image link in case the image name is not available. _**NOTE: the image name must be the same as the link since in docker there is not distinction**_
* **image-config** the name must be the same as the link. the Disk Format and container format are ignored so you can use "QCOW2" and "BARE", as well as for the limits, everything can be 0,

## Build the VNFPackage

In order to build the VNF Package and to upload it please follow [our documentation](http://openbaton.github.io/documentation/vnf-package/)

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
