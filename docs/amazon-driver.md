# Amazon VIM Driver

The Amazon VIM Driver allows instantiating VMs on top of Amazon EC2. 
It uses the plugin-sdk allowing the NFVO to interoperate with this plugin using AMQP. 
This plugin uses Amazon Java SDK as implementation of the Amazon Cloud API. The Amazon VIM Driver source code is available at [this GitHub repository](https://github.com/openbaton/plugin-vimdriver-amazon)
   
## Prerequisites

In general, we expect that you are familiar with Amazon AWS EC2. Those are the list of prerequisites to follow when you want to use the Amazon VIM Driver: 

* First and most important, choose a region you want to work in, as most of the changes you make are only available in the region you choose. The region name ()without the letter in the end, for example us-east-2) will be used as part of your PoP JSON file.
* Create a VPC or use a default one. Do not forget to assign a name to the VPC. It is a requirement for aws plugin This is also referred as the tenant name in the PoP json file. 
* Create a security group or use default one. In both cases make sure that the instances can communicate through the ports that you need for both messaging with broker (rabbitmq) and your specific services. Security groups should have access to internet.
* Disable quota-check the NFVO properties in case you enabled it, since the Amazon VIM Driver can't collect information about quota.  
* Makes sure that the subnets that you already have on VPC have names, especially if you want to connect your VMs to those ones. 
* Make sure that the main route table on the VPC is connected to non-NAT gateway if you want to assign public IPs to your instances. 
* Get your access key and access secret key from your aws account. Those will be used as username and password in the PoP JSON file.
* Due to the high number of images in AWS system the plugin filters the image by ids and names, these can be provided inside the plugin properties:

```properties
type = amazon
external-properties-file = /etc/openbaton/plugin/amazon/driver.properties
image-key-word = ami-10547475,ami-8a7859ef,ami-f990b69c,ami-43391926
```

In particular, image-key-word property provides an ability to filter only the images that you are interested in. 

A step-by-step tutorial on how to make those changes is available [here for the dashboard](how-to-ec2-dashboard.md) and [here for the CLI](how-to-ec2-cli.md)

**Disclaimer:** Please be careful while writing your NSD or creating packages, pay attention to the types of instances that you are using, plugin does not keep
track of the charges that may apply.
* If you want to use generic-vnfm and EMS that it is coupled with be aware that rabbitmq-host should be reachable from AWS instances. 
One of the options in this case is to manually create an instance inside AWS amd install rabbitmq there. The rabbitmq may be reached with instances public DNS after it by all the components.

## Limitations

Security groups have to be created in advance, and same rules are applied to all the network services that are deployed on that PoP. 

[pop-registration]: pop-registration.md