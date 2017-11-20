# Step-By-Step guide using aws python client:

Install python pip with command:
```bash
sudo apt-get install python-pip
```
Install aws client:
```bash
sudo pip install awscli --upgrade
```
After you have installed the client check if it was properly installed by calling:
```bash
aws --version
```
Next you can configure your AWS profile with the command:
```bash
aws configure
AWS Access Key ID [None]: <your key id, which later will be used as username in PoP descriptor>
AWS Secret Access Key [None]: <your secret key which will be used as password>
Default region name [None]:< default region name which will go inside desciptor as location name>
Default output format [None]: json
```
The code of the regions can be found [here][aws-regions]. You can also find region names by typing:
```bash
aws ec2 describe-regions --output table
```
After you have setup your account you can start setting up your service environment. For more information about setting up your credentials, please, visit the official Amazon guide [here][aws-offguide].



You can work with default VPC or create a new one. You can list the VPCs existing in your default region by typing
```bash
aws ec2 describe-vpcs --output table
---------------------------------------------------------------------------------------------------
|                                          DescribeVpcs                                           |
+-------------------------------------------------------------------------------------------------+
||                                             Vpcs                                              ||
|+---------------+----------------+------------------+------------+-------------+----------------+|
||   CidrBlock   | DhcpOptionsId  | InstanceTenancy  | IsDefault  |    State    |     VpcId      ||
|+---------------+----------------+------------------+------------+-------------+----------------+|
||  172.31.0.0/16|  ------------- |  default         |  True      |  available  |  ------------  ||
|+---------------+----------------+------------------+------------+-------------+----------------+|
|||                                   CidrBlockAssociationSet                                   |||
||+--------------------------------------------------------+------------------------------------+||
|||                      AssociationId                     |             CidrBlock              |||
||+--------------------------------------------------------+------------------------------------+||
|||  ---------------                    |  172.31.0.0/16                                        |||
||+--------------------------------------------------------+------------------------------------+||
||||                                      CidrBlockState                                       ||||
|||+----------------------------------+--------------------------------------------------------+|||
||||  State                           |  associated                                            ||||
|||+----------------------------------+--------------------------------------------------------+|||

```
If you want to create a new VPC use this command:
```bash
aws ec2 create-vpc --cidr-block <your-cidr-block>
```
In both cases you will need to assign the name to the VPC in order for Open Baton to identify it. You can do it via creating tags with a command like this
```bash
aws ec2 create-tags --resource <VpcId from the table> --tags Key=Name,Value=<your VPC name, will be used as tenant name in PoP description>
```
For more information about the customization of VPCs during creation and by using tags, please, visit the official documentation for [create-vpc command][create-vpc] and [create-tags command][create-tags].

Create a security group and use the default one. You can list the groups with the command:
```bash
aws ec2 describe-security-groups --output table
```
You can also filter the groups by using the Vpc ID like this:
```bash
aws ec2 describe-security-groups --filters Name=vpc-id,Values=<your VPC ID> --output table
----------------------------------------------------------------------------------------------
|                                   DescribeSecurityGroups                                   |
+--------------------------------------------------------------------------------------------+
||                                      SecurityGroups                                      ||
|+-----------------------------+--------------+------------+---------------+----------------+|
||         Description         |   GroupId    | GroupName  |    OwnerId    |     VpcId      ||
|+-----------------------------+--------------+------------+---------------+----------------+|
||  default VPC security group |  sg-d337e4b9 |  default   |  _-----------|| -------------  ||
|+-----------------------------+--------------+------------+---------------+----------------+|
|||                                      IpPermissions                                     |||
||+----------------------------------------------------------------------------------------+||
|||                                       IpProtocol                                       |||
||+----------------------------------------------------------------------------------------+||
|||  -1                                                                                    |||
||+----------------------------------------------------------------------------------------+||
||||                                   UserIdGroupPairs                                   ||||
|||+-----------------------------------------+--------------------------------------------+|||
||||                 GroupId                 |                  UserId                    ||||
|||+-----------------------------------------+--------------------------------------------+|||
||||  -----------                            |  894307506440                              ||||
|||+-----------------------------------------+--------------------------------------------+|||
|||                                   IpPermissionsEgress                                  |||
||+----------------------------------------------------------------------------------------+||
|||                                       IpProtocol                                       |||
||+----------------------------------------------------------------------------------------+||
|||  -1                                                                                    |||
||+----------------------------------------------------------------------------------------+||
||||                                       IpRanges                                       ||||
|||+--------------------------------------------------------------------------------------+|||
||||                                        CidrIp                                        ||||
|||+--------------------------------------------------------------------------------------+|||
||||  0.0.0.0/0                                                                           ||||
|||+--------------------------------------------------------------------------------------+|||

```
You can create a new group by using the command:
```bash
aws create-security-group --group-name <name> --description <description> 
#Which will return group id that can be used to modify the group
{
    "GroupId": "-----"
}

```
You can use the ID of the group to set the correct permissions and open the correct ports for your services. For example:
```bash
aws ec2 authorize-security-group-ingress --group-name <group-name> --protocol tcp --port 22 --cidr 0.0.0.0/0
```
will enable inbound SSH traffic. You will need it to SSH into the instances. For more information about security group create and customisation you can visit following documentation pages: [creating][create-secg], [traffic rules][ingress] and [description][describe-secg] of the security groups.

Now you can create key-pair in order to SSH inside the created instances. You can do it by issuing the following command

```bash
#Create a key and write the data to file
aws ec2 create-key-pair --key-name aws-key --query 'KeyMaterial' --output text > aws-key.pem
#Set the proper permissions if on Linux
chmod 400 aws-key.pem
```
Use:
```bash
aws ec2 describe-key-pairs
``` 
to view the create keys and their fingerprint.

**Only in case you are using the generic VNFM and generic EMS you will need a RabbitMQ instance reachable from the VNF instances**

One of the solutions is to create an instance inside AWS because it will have a public ip. For this we recommend to create an instance on Ubuntu 14 or 16. and  t2.micro type. 
Due to the very high number of images on AWS marketplace it is not advised to attept describe-image command in order to find a suitable image for rabbitmq instance, we recommend using the command
```bash
aws ec2 describe-images --filters Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20170721 --output table

----------------------------------------------------------------------------------------------------------
|                                             DescribeImages                                             |
+--------------------------------------------------------------------------------------------------------+
||                                                Images                                                ||
|+--------------------+---------------------------------------------------------------------------------+|
||  Architecture      |  x86_64                                                                         ||
||  CreationDate      |  2017-07-24T20:27:25.000Z                                                       ||
||  Description       |  Canonical, Ubuntu, 16.04 LTS, amd64 xenial image build on 2017-07-21           ||
||  EnaSupport        |  True                                                                           ||
||  Hypervisor        |  xen                                                                            ||
||  ImageId           |  ami-996372fd                                                                   ||
||  ImageLocation     |  099720109477/ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20170721   ||
||  ImageType         |  machine                                                                        ||
||  Name              |  ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20170721                ||
||  OwnerId           |  099720109477                                                                   ||
||  Public            |  True                                                                           ||
||  RootDeviceName    |  /dev/sda1                                                                      ||
||  RootDeviceType    |  ebs                                                                            ||
||  SriovNetSupport   |  simple                                                                         ||
||  State             |  available                                                                      ||
||  VirtualizationType|  hvm                                                                            ||
|+--------------------+---------------------------------------------------------------------------------+|
|||                                         BlockDeviceMappings                                        |||
||+-----------------------------------------------------+----------------------------------------------+||
|||  DeviceName                                         |  /dev/sda1                                   |||
|||  VirtualName                                        |                                              |||
||+-----------------------------------------------------+----------------------------------------------+||
||||                                                Ebs                                               ||||
|||+---------------------------------------------+----------------------------------------------------+|||
||||  DeleteOnTermination                        |  True                                              ||||
||||  Encrypted                                  |  False                                             ||||
||||  SnapshotId                                 |  snap-04757784173dd4fc9                            ||||
||||  VolumeSize                                 |  8                                                 ||||
||||  VolumeType                                 |  gp2                                               ||||
|||+---------------------------------------------+----------------------------------------------------+|||
|||                                         BlockDeviceMappings                                        |||
||+---------------------------------------------------+------------------------------------------------+||
|||  DeviceName                                       |  /dev/sdb                                      |||
|||  VirtualName                                      |  ephemeral0                                    |||
||+---------------------------------------------------+------------------------------------------------+||
|||                                         BlockDeviceMappings                                        |||
||+---------------------------------------------------+------------------------------------------------+||
|||  DeviceName                                       |  /dev/sdc                                      |||
|||  VirtualName                                      |  ephemeral1                                    |||
||+---------------------------------------------------+------------------------------------------------+||

```
in order to retrieve information about the image which will contain the image-id. This image should be present in most regions. 
Assigning correct security group is very important. Make sure that SHH port is open for 
you to get access inside the machine. 
| Name                        | Protocol | Port  | IP range                                  |
|-----------------------------|----------|-------|-------------------------------------------|
| SSH                         | TCP      | 22    | Ip of the machine you are using or any ip |
| Rabbitmq communication port | TCP      | 5672  | Anywhere                                  |
| Rabbitmq management port    | TCP      | 15672 | Administration IP                         |
Create instance:
```bash
aws ec2 run-instance --image-id <retrieved-id> --security-groups "<group-name>" --instance-type t2.micro --key-name aws-key
```
After you have created the instance you will be presented with information about it. Find instance-id and use it to retrieve fully formed information include public DNS which we can use to ssh into system. 
```bash
 aws ec2 describe-instances --instance-ids "<instance-id>"
```
Give the name to the created instance:
```bash
aws ec2 create-tags --resource <instance-id> --tags Key=Name,Value=rabbitmq
```
Assigning correct security group is very important. Make sure that SHH port is open for 
you to get access inside the machine. 
Open the ports for the rabbitmq:
```bash
aws ec2 authorize-security-group-ingress --group-name <group-name> --protocol tcp --port 5672 --cidr <your components ips>
aws ec2 authorize-security-group-ingress --group-name <group-name> --protocol tcp --port 15672 --cidr <your-ip>
```
SSH into the created machine via
```bash
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
You can also use rabbitmq docker container. 

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

[aws-offguide]: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
[aws-regions]: http://docs.aws.amazon.com/general/latest/gr/rande.html   
[create-vpc]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-vpc.html
[create-tags]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-tags.html 
[create-secg]: http://docs.aws.amazon.com/cli/latest/reference/ec2/create-security-group.html
[ingress]: http://docs.aws.amazon.com/cli/latest/reference/ec2/authorize-security-group-ingress.html
[describe-secg]: http://docs.aws.amazon.com/cli/latest/reference/ec2/describe-security-groups.html
