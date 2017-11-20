# Step-By-Step guide using dashboard:
 Login into your Amazon account and select the region you want to work in. Go to [AWS regions catalogue][aws-regions]
   and find the code of the region you have selected. For example: EU (Ireland) is eu-west-1. Add as a location inside
   you VIM instance information.
   
 Go to the VPCs menu and assign name to the default VPC you have or create a new one and assign name to it. Name is 
important for the VPC identification. Fill in the the tenant in your VIM data with this name. 
  ![VPC](../../plugin-vimdriver-amazon/docs/pictures/VPC.png)
   
   Please, make sure that VPC is not connected to NAT router. 
   
Configure security group. All the ports that you are planning to use for your service should be open. 
![ports](../../plugin-vimdriver-amazon/docs/pictures/securitygroup.png)

Create an SSH key pair: albeit not mandatory it is recommended to create an aws ssh key pair in order to easily 
ssh inside the VNF instances created by the openbaton. For this go to the key pairs menu and create a key:
![key-pair](../../plugin-vimdriver-amazon/docs/pictures/key-paris.png)

**Only in case you are using the generic VNFM and generic EMS you will need a RabbitMQ instance reachable from the VNF instances**

One of the solutions is to create an instance inside AWS because it will have a public ip. For this go to create instance menu and choose the necessary 
image, we recommend Ubuntu 14 or 16., t2.micro type is enough for it. In the tags menu assign name to the machine via:
key: Name and tag: rabbitmq. Assigning correct security group is very important. Make sure that SHH port is open for 
you to get access inside the machine. 

| Name                        | Protocol | Port  | IP range                                  |
|-----------------------------|----------|-------|-------------------------------------------|
| SSH                         | TCP      | 22    | Ip of the machine you are using or any ip |
| Rabbitmq communication port | TCP      | 5672  | Anywhere                                  |
| Rabbitmq management port    | TCP      | 15672 | Administration IP                         |

![rabbit-summary](../../plugin-vimdriver-amazon/docs/pictures/rabbit-instance.png)
After you have launched the instance, ssh into it with:
```bash
chmod 400 aws-key.pem
ssh -i "aws-key.pem" ubuntu@<rabbitmq-ip-or-dns>
```
From here you have multiple ways of installing rabbitmq server
the most basic one is to install it directly with these bash commands:
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
```
Create a user for openbaton with these commands:
```bash
sudo rabbitmqctl add_user <user-name> <user-password>
sudo rabbitmqctl set_user_tags <user-name> administrator
sudo rabbitmqctl set_permissions -p / <user-name> ".*" ".*" ".*"
```
You can also enable rabbitmq management plugin if you want to use rabbitmq web GUI:
```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

You can also use [rabbitmq docker container](https://hub.docker.com/_/rabbitmq/). 

Once the rabbitmq instance is up and running you can set the correct broker ip in the properties of NFVO 
and generic. 
 ```properties
nfvo.rabbit.brokerIp=<url or ip>
 ```
```properties
vnfm.rabbitmq.brokerIp=<url or ip>
```

After this find an images you would like to use and copy it inside the properties of the plugin
```properties
type = amazon
external-properties-file = /etc/openbaton/plugin/amazon/driver.properties
image-key-word = ami-10547475,ami-8a7859ef,ami-f990b69c,ami-43391926
```
Please, be aware that identical images most likey will have different AMI IDs in different regions.
Once all the properties are correctly set, launch the Open Baton components and open the NFVO dashboard and upload the VIM, 
if you choose to use JSON file then the content should look like this
```json
{
  "name":"amazon",
  "authUrl":"http://google.com",
  "tenant":"VPC1",
  "username":"<key>",
  "password":"<secret-key>",
  "keyPair":"aws-key",
  "securityGroups": [
    "default"
  ],
  "type":"amazon",
  "location":{
	"name":"eu-west-1",
	"latitude":"52.525876",
	"longitude":"13.314400"
  }
}
```
Upload it and look through the retrieved resources. 


In order to test if the system is deployment ready you can use a simple iperf-scenario. You do not need to change anything but the image
name in the basic scenario provided by the Openbaton documentation. It is recommended to provide IDs of the images inside VNFDs insread
of name due to how long most names in the AWS are.


[aws-offguide]: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
[aws-regions]: http://docs.aws.amazon.com/general/latest/gr/rande.html   
[create-vpc]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-vpc.html
[create-tags]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html 
[create-secg]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-security-group.html
[ingress]: http://docs.aws.amazon.com/cli/latest/reference/ec2/authorize-security-group-ingress.html
[describe-secg]: http://docs.aws.amazon.com/cli/latest/reference/ec2/describe-security-groups.html
