# Write your own integration tests

## Description
The integration tests are defined in .ini files which are in the directory *integration-tests/src/main/resources/integration-test-scenarios*. If you want to add a integration test, just add its ini file to this folder. 

### Ini file structure
In the ini file you can describe a graph or tree like execution plan of different tasks. 
We will implement here as an example the test which is found in the *scenario-real-iperf.ini* file step by step. 
First we need a base node and define the maximum time of the integration test and the maximum number of concurrent successors. 
```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10
```

After that the first step is to store a vim instance on the orchestrator. 
```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
```

The node we just added will create a vim instance. That is defined by the class-name field. 
The class VimInstanceCreate stores a vim instance from the *real-vim.json* file on the orchestrator. 
A complete list of classes you can use is provided later in this document. 
The file *real-vim.json* has to be stored either in */etc/openbaton/integration-test/vim-instances/real-vim.json* or in *.../integration-tests/src/main/resources/etc/json_file/vim_instances/real-vim.json*. 
The file in the first folder has a higher priority than the one in the second one.

We already know that we want to delete this vim from the orchestrator at the end of the test. 
So we can add the following:
```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete
```
The successor-remover field specifies, that the node *vim-d-1* will be executed after every child node/task of *vim-c-1* has finished. 
Every node can only have one successor-remover. 
A successor remover node cannot have child nodes. 
The new node gets the information which vim instance it should delete passed from the first node. 

The next step will be to create and delete a network service descriptor (NSD). 

[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

```ini
;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;nsd-create
[it/vim-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreate
num_instances = 1
successor-remover = nsd-d-1
name-file = NetworkServiceDescriptor-iperf-real.json

;nsd-delete
[it/vim-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete
```

Here the new nodes are *nsd-c-1* and *nsd-d-1*. 
*nsd-d-1* is the successor remover of *nsd-c-1* and will be executed if every child node/task from *nsd-c-1* finished. 
*nsd-c-1* has some fields that need explanation. *num_instances* specifies how many of those tasks should be created. 
At the moment there is just one so only one NSD will be stored on the orchestrator. 
But if we would provide for example a 2, then this task would be executed twice concurrently. 
Every task would be independent and every child node which is defined for *nsd-c-1* would be executed for every instance separately. 
The name-file specifies the .json file that shall be used to create the NSD. 
It may be stored either in */etc/openbaton/integration-test/network-service-descriptors/NetworkServiceDescriptor-iperf-real.json* or in *.../integration-tests/src/main/resources/etc/json_file/network_service_descriptors/NetworkServiceDescriptor-iperf-real.json*. 
Again the former folder has a higher priority than the latter one. 

In the next step we will deploy the network service record (NSR) from the created NSDs and wait for its instantiation. 

```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;nsd-create
[it/vim-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreate
num_instances = 1
successor-remover = nsd-d-1
name-file = NetworkServiceDescriptor-iperf-real.json

;nsd-delete
[it/vim-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete

;nsr-create
[it/vim-c-1/nsd-c-1/nsr-c-1]
class-name = NetworkServiceRecordCreate
num_instances = 1

;nsr-wait for creation
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1]
class-name = NetworkServiceRecordWait
;the default timeout is 5 seconds
timeout = 600
action = INSTANTIATE_FINISH
```

*nsr-c-1* works similar to the creation of a NSD. It gets its information on which NSD it should use from the preceiding task, so it has to be the NSD creation node. 
The interesting part in this step is the *nsr-w-1* node. 
This waits for the orchestrator to send the action INSTANTIATE_FINISH. If it receives it, the task was successful and the integration test proceeds. 

Now we will show how to test, if the network service is actually running.
Therefore you can tell the integration test to ssh the instantiated virtual machines and execute commands.
Those commands have to be written in scripts which can be placed in two locations.
Either in **/etc/openbaton/integration-test/scripts/** or in **/integration-tests/src/main/resources/etc/scripts/** in the
project itself. The former directory is checked first for a script name. If it does not exist there the latter location is used. 
Bash sources the scripts on the remote machines. 
But where do I specify the Virtual Machines on which the scripts shall be executed?? Well, also in the .ini file.
Use the *GenericServiceTester*.

```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;nsd-create
[it/vim-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreate
num_instances = 1
successor-remover = nsd-d-1
name-file = NetworkServiceDescriptor-iperf-real.json

;nsd-delete
[it/vim-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete

;nsr-create
[it/vim-c-1/nsd-c-1/nsr-c-1]
class-name = NetworkServiceRecordCreate
num_instances = 1

;nsr-wait for creation
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1]
class-name = NetworkServiceRecordWait
;the default timeout is 5 seconds
timeout = 600
action = INSTANTIATE_FINISH

[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1]
class-name = GenericServiceTester
vnf-type = client
user-name = ubuntu
vm-scripts-path = /home/ubuntu
script-1 = iperf-running.sh
script-2 = iperf-clt-connection.sh
```

The class name specifies, that we want to use the GenericServiceTester to test our service.
The vnf-type is used to say on which virtual network functions the scripts should be executed and is equal to the one you wrote into the network service descriptor.
In our example the integration test would execute them on a virtual machine, which runs the iperfserver VNF which has the type 'server'. 
In user-name you have to specify the user name of the virtual machine, so that the integration test can ssh into the machine. 
And vm-scripts-path declares the directory in which the testing scripts should be stored on the virtual machine. Keep in mind that this directory has to already exist, it will not be created by the integration test. 
And finally you have to specify the script name. script-1 will be the first script executed in that task.
If you want to execute more than that, just add script-2, script-3 and so on.

Here is the script *iperf-running.sh* used to see if iperf is running:
```
#!/bin/bash

iperf_count=`exec ps -aux | grep -v grep | grep iperf | wc -l`
if [ $iperf_count -lt 1 ]
then
  exit 1
else
  exit 0
fi

```

As you can see the script exits with status 0 on success and otherwise on 1 like usual. 
Every script you write for the integration test should exit on a value not 0 if they fail. 
The integration test will just pass if all the scripts exit on 0.

So, now we know that iperf is running on the client virtual machine. But are the client and server really communicating at the moment?
To test that we added another script *iperf-clt-connection.sh* to the client task, that checks if there is an outgoing or incoming connection related to iperf and exits successfully if one exists. Here's the script:
```
#!/bin/bash

# this will return the ip of the remote partner of the communication, here the iperf-server
outgoing=`sudo netstat -npt | grep iperf | awk '{print $5}' | sed 's/:.*//'` 

# check if the communication partner is really the iperf-server
if [ $outgoing == ${server_ip} ]
then
  exit 0
else
  exit 1
fi
```

(You may wonder where '${server_ip}' comes from. It is a variable provided by the integration test as explained later. 
We use sudo for the netstat command, because the iperf command was started by the root user.)

We now also add a node in the ini file for the server. 

```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;nsd-create
[it/vim-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreate
num_instances = 1
successor-remover = nsd-d-1
name-file = NetworkServiceDescriptor-iperf-real.json

;nsd-delete
[it/vim-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete

;nsr-create
[it/vim-c-1/nsd-c-1/nsr-c-1]
class-name = NetworkServiceRecordCreate
num_instances = 1

;nsr-wait for creation
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1]
class-name = NetworkServiceRecordWait
;the default timeout is 5 seconds
timeout = 600
action = INSTANTIATE_FINISH

[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1]
class-name = GenericServiceTester
vnf-type = client
user-name = ubuntu
vm-scripts-path = /home/ubuntu
script-1 = iperf-running.sh
script-2 = iperf-clt-connection.sh


[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1/gst-2]
class-name = GenericServiceTester
vnf-type = server
net-name = private
user-name = ubuntu
vm-scripts-path = /home/ubuntu
script-1 = iperf-running.sh
script-2 = iperf-srv-connection.sh
```

The second script for the server task looks like this:
```
#!/bin/bash


incoming=`sudo netstat -npt | grep iperf | wc -l`

if [ $incoming -eq 0 ] 
then
  exit 1
else
  exit 0
fi
```

Here we just count if there are incoming connections to the server. 

After the iperf-running.sh script, the iperf-srv-connection.sh script will be executed on the server virtual machines 
and on the client one's also iperf-running.sh and then the script iperf-clt-conection.sh.

Now imagine, that you did not specify one virtual network function component in the client's NSD, but five. And you want to test them all.
Do you have to create five tasks for that?? No, if you define the task for the client as shown above, the integration test will execute
the scripts on every virtual machine, that was deployed by the vnfd with the type *client*.

And if you have some virtual network function components connected to two different networks but just want to test the ones connected
to one of them, you can add a *net-name* field to the task and just the ones connected to it will be involved like in the server task.

Afterwards we want to delete the NSDs and simutaniously wait for a message from the orchestrator, that it has been done. 
```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = real-vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;nsd-create
[it/vim-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreate
num_instances = 1
successor-remover = nsd-d-1
name-file = NetworkServiceDescriptor-iperf-real.json

;nsd-delete
[it/vim-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete

;nsr-create
[it/vim-c-1/nsd-c-1/nsr-c-1]
class-name = NetworkServiceRecordCreate
num_instances = 1

;nsr-wait for creation
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1]
class-name = NetworkServiceRecordWait
;the default timeout is 5 seconds
timeout = 600
action = INSTANTIATE_FINISH

[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1]
class-name = GenericServiceTester
vnf-type = client
user-name = ubuntu
vm-scripts-path = /home/ubuntu
script-1 = iperf-running.sh
script-2 = iperf-clt-connection.sh


[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1/gst-2]
class-name = GenericServiceTester
vnf-type = server
net-name = private
user-name = ubuntu
vm-scripts-path = /home/ubuntu
script-1 = iperf-running.sh
script-2 = iperf-srv-connection.sh

;nsr-wait for deletion
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1/gst-2/nsr-w-2]
class-name = NetworkServiceRecordWait
;the default timeout is 5 seconds
timeout = 360
action = RELEASE_RESOURCES_FINISH

;nsr-delete
[it/vim-c-1/nsd-c-1/nsr-c-1/nsr-w-1/gst-1/gst-2/nsr-d-1]
class-name = NetworkServiceRecordDelete
```

As you can see the nodes *nsr-w-2* and *nsr-d-1* are both child nodes of *gst-2*. 
This means that they are executed concurrently. 
The *nsr-w-2* node waits for the action RELEASE_RESOURCES_FINISH sent by the NFVO and finishes successfully if it receives it. 

Now are all the child nodes of *nsd-c-1* finished and its successor remover nsd-d-1 will be executed which deletes the stored NSDs. 
After that all the child nodes of *vim-c-1* finished and its successor remover *vim-d-1* starts to delete the stored vim instance. 

### A little more on scripts

Now we come back to the '${server_ip}' variable in the iperf-clt-connection script. As mentioned earlier this variable is provided 
by the integration test. It stores the ip of the server. If you wanted to access the IPs of the clients, you could use ${client_ip}. 
The problem is, that we could for example also have two or more instances of clients. Which ip is chosen? 
Actually the script, which contains this variable will be executed twice or more on the virtual machine until every possible substitution was handled. 
You have access to the IPs, floating IPs and configurations. 
You can access ips by writing ${vnfrtype_ip} or ${vnfrtype_network_ip} (don't forget the braces). The 'vnfrtype' in our example would be 'server' or 'client'. 
The 'network' is the virtual_link you specified in the VNFD for the VNF Component and will only retrieve the VNFC ips which are connected to this network. 
If you have more than one VNFC Instance which is deployed, so for example you have two iperf-servers 
deployed from one VNFD, then there would be two possibilities to substitute ${server_ip}. If you want to execute a script on the virtual machine of the 
iperf-client which contains this variable the integration test will do the following. Execute the script containing the 
variable with first the ip of one server. And then executing the same script, but now replacing the variable with the other ip. 
That way you just have to write one script and all the VNF Components of the VNF will be tested. 
You can access the floating ips of VNFCs by writing ${vnfrtype_fip} or ${vnfrtype_network_fip}. 
Of course, this will only work if there is a floating ip for that virtual machine. 
The configurations are accessible by typing ${vnfrtype_configurationkey}. 
For all the variables it is essential, that you enclose them with braces otherwise they won't work. 


## Other important information

For the integration test to be able to ssh to the virtual machines on openstack, you have to provide a .pem file of a key-pair you are using on openstack.
Download this file, name it *integration-test.pem* and put it into the directory **/etc/openbaton/integration-test/**.
Furthermore it has to have the correct permissions so you probably have to execute *chmod 400 integration-test.pem*.
And don't forget to make the scripts executable.
Do NOT use '-' in types of VNFDs or configuration names as you cannot use them in bash scripts it will not work for the integration test scripts. 


## The class-name types available

As mentioned earlier here is a summary of all the class-names available at the moment to use in a ini file node.

| class-name          				| purpose       																|
| -------------   				| -------------:																|
| GenericServiceTester  			| Test the network service itself |
| NetworkServiceDescriptorCreate		| Store a NSD on the NFVO |
| NetworkServiceDescriptorCreateFromPackage	| Create a NSD by using a VNFPackage that was uploaded beforehand |
| NetworkServiceDescriptorDelete                | Delete a NSD from the NFVO |
| NetworkServiceDescriptorWait			| Used for waiting for the deletion of a NSD from the NFVO |
| NetworkServiceRecordCreate  			| Deploy a network service from a NSD and create the NSR |
| NetworkServiceRecordDelete			| Delete the NSR |
| NetworkServiceRecordWait			| Wait for an specific action of the NFVO to happen that is related to NSRs |
| PackageDelete                                 | Delete a VNFPackage |
| PackageUpload					| Upload a VNFPackage |
| VimInstanceCreate  				| Store a vim instance on the NFVO from a json file |
| VimInstanceDelete				| Delete a vim instance |
| VirtualNetworkFunctionRecordWait		| Wait for an action sent by the NFVO which is related to a VNFR |


## Using VNFPackages

Here is an example on how to use VNFPackages in your tests. 

```ini
[it]
;set the maximum time (in seconds) of the Integration test. e.g. 10 min = 600 seconds
max-integration-test-time = 800
;set the maximum number of concurrent successors (max number of active child threads)
max-concurrent-successors = 10

;vimInstance-create
[it/vim-c-1]
class-name = VimInstanceCreate
name-file = vim.json
successor-remover = vim-d-1

[it/vim-c-1/vim-d-1]
class-name = VimInstanceDelete

;package-create
[it/vim-c-1/vnfp-c-1]
class-name = PackageUpload
package-name = iperf-server-package.tar

;nsd-create
[it/vim-c-1/vnfp-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreateFromPackage
name-file = NetworkServiceDescriptor.json

;nsd-delete
[it/vim-c-1/vnfp-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete

;package-delete
[it/vim-c-1/vnfp-c-1/nsd-c-1/nsd-d-1/vnfp-d-1]
class-name = PackageDelete
package-name = iperf-server-package
```

This example begins by storing a vim instance. Then the package iperf-server-package.tar is stored. 
The packages have to be in the directory /etc/openbaton/integration-test/vnf-packages/. 
Afterwards a NSD is created from the VNFDs in the package and right after that deleted. Be aware that you 
have to use the class NetworkServiceDescriptorCreateFromPackage to store a NSD from a package. 
Then also the package will be deleted. You have to provide the name of the package you want to delete. 
At the end the vim instance is deleted. 

If you create a NSD from a VNFPackage, the VNFD field of the NSD file would look something like this: 

```json
"vnfd":[
{
      "id":""
},
{
      "id":""
}

   ],
```

The integration test will automatically insert some IDs of VNFDs that were previously stored by a VNFPackage. 


## Parser
The class Parser looks for a configuration file with this syntax:

old_value = new_value

In the json file, passed to the method Parser.randomize(), all the old_value will be replace with new_value.
IMPORTANT: in the json file, the old_value must have the following sintax:

"some_parameter" = "<::old_value::>"

If we want to put random values:

old_value = new_value***

In the json file, passed to the method Parser.randomize(), all the old_value will be replace
with new_value plus 3 random characters (e.g. new_valuezxd).

### Simple parser example
Parser config file (parser.config):
```
admin=admin***
```
Json file:
```
{
"username":"<::admin::>"
}
```
Use of Parser class:
```java
String newJson = Parser.randomize(oldJson, "parser.config");
```
The string newJson will be:
```
{
"username":"adminxkz"
}
```

