# Docker VNFM for Open Baton

This VNF Manager, together with the [Docker Vim Driver](https://github.com/openbaton/go-docker-driver), allows Open Baton to deploy Container on top of a running [Docker](https://www.docker.com/) engine.
Both VNFM and VIM Driver are necessary in order to be able to deploy NS over Docker

## Requirements

The _go_ compiler has to be installed, please follow the go documentation on how to [download and install](https://golang.org/dl/) it.

The _dep_ command has to be installed in order to install also dependencies. [Go dependency management tool](https://github.com/golang/dep)


## Build the VNFM

If you installed Open Baton from source code and cloned the git repositories to your computer you will have to add the Docker VNFM to the NFVO by hand.  
You can build it by yourself by cloning the Docker VNFM's git repository as follows:
executing

```bash
git clone git@github.com:openbaton/go-docker-vnfm.git
cd go-docker-vnfm
dep ensure
cd main
go build -o docker-vnfm
```

Afterwards you will find the binary file in the _main_ folder.  
Just run it as

```bash
./docker-vnfm --help
Usage of ./docker-vnfm:
-conf string
      The config file of the Docker Vim Driver (default "config.toml")
-dir string
      The directory where to persist the local db (default "badger")
-level string
      The Log Level of the Docker Vim Driver (default "INFO")
-persist
      to persist the local database using badger (default true)
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
