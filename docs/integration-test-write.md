# Write your own integration tests

## Description
The integration tests are defined in .ini files which are in the directory *integration-tests/src/main/resources/integration-test-scenarios*. If you want to add an integration test, just add its ini file to this folder. 

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

| class-name          				| purpose                                                       | fields | field purpose |
| -------------   				| -------------:			                        | -----: | ------------: |
| GenericServiceTester  			| Test the network service itself                               | script-1 | The first script to be executed on the VM       |
|||...||
|||script-n| The n-th script to be executed on the VM|
|||vnf-type|The type of the VNFs that shall be tested|
|||user-name|The user account on the VM on which the scripts will be executed|
|||vm-scripts-path|The path to the directory of the VM where the scripts will be stored before execution|
|||net-name|Specifies the network/virtual-link to which the VMs that shall be tested are connected|
| NetworkServiceDescriptorCreate		| Store a NSD on the NFVO | expected-to-fail | If set to true the task will fail if the onboarding of the NSD is successful                   |
|||name-file| The name of the json file which contains the NSD|
| NetworkServiceDescriptorCreateFromPackage	| Create a NSD by using a VNFPackage that was uploaded beforehand | expected-to-fail | If set to true the task will fail if the onboarding of the NSD is successful            |
|||name-file| The name of the json file which contains the NSD|
| NetworkServiceDescriptorDelete                | Delete a NSD from the NFVO |  |  |
| NetworkServiceDescriptorWait			| Used for waiting for the deletion of a NSD from the NFVO |  |  |
| NetworkServiceRecordCreate  			| Deploy a network service from a NSD and create the NSR |  |  |
| NetworkServiceRecordDelete			| Delete the NSR | |  |
| NetworkServiceRecordGetLatest			| Expects to get passed a NSR from its preceding task, retrieves the latest version of this NSR from the NFVO and passes it to the following task | |  |
| NetworkServiceRecordWait			| Wait for a specific action of the NFVO to happen that is related to NSRs | action | The action which will be waited for to happen |
|||timeout| After this time (in seconds) the task will fail if the action did not occur yet |
| PackageDelete                                 | Delete a VNFPackage | package-name | The name of the package that will be deleted |
| PackageUpload					| Upload a VNFPackage | package-upload | The name of the package that will be uploaded |
| Pause					        | Used to elapse time until the next task will start | duration | The time (in seconds) that this task shall do nothing and after which it will finish |
| ScaleIn					| Triggers one scale in operation on a VNFR specified in the ini file | vnf-type | The type of VNFR that shall be scaled in |
| ScaleOut					| Triggers one scale out operation on a VNFR specified in the ini file | floating-ip | The floating IP which shall be assigned to the new instance |
|||virtual-link| The network/virtual-link to which the new instance shall be connected |
|||vnf-type| The type of the VNFR on which the scale out shall be performed |
| ScalingTester					| Verifies if the number of VNFCInstances is equal to a given number and passes an updated NSR to the next task, which can be important after a scaling operation | vnfc-count | The expected number of instances of this VNF |
|||vnf-type| The type of the VNFR whose number of VNFCs should be checked |
| VimInstanceCreate  				| Store a vim instance on the NFVO from a json file | name-file | The name of the json file that contains the VimInstance |
| VimInstanceDelete				| Delete a vim instance |  |  |
| VirtualNetworkFunctionDescriptorDelete        | Delete the VNFDs of a NSD passed from the preceding task, filtered by vnfd name and/or type; if no name and type are passed, all the VNFDs associated to the passed NSD will be deleted | vnf-type | The type of the VNFDs that shall be deleted; this field can be omitted if the type is not important for the choice of VNFDs to delete |
||| vnf-name | The name of the VNFDs that shall be deleted; this field can be omitted if the name is not important for the choice of VNFDs to delete |
| VirtualNetworkFunctionRecordWait		| Wait for an action sent by the NFVO which is related to a VNFR | action | The action which will be waited for to happen |
|||timeout| After this time (in seconds) the task will fail if the action did not occur yet |
|||vnf-type| The type of the VNFR that should produce the awaited action |
| VNFRStatusTester				| Checks if the status of a specified VNFR is as expected | status | The expected status in which the VNFR should be |
|||vnf-type| The type of the VNFR whose status shall be checked |


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
successor-remover = vnfp-d-1

;package-delete
[it/vim-c-1/vnfp-c-1/vnfp-d-1]
class-name = PackageDelete
package-name = iperfServerPackage

;nsd-create
[it/vim-c-1/vnfp-c-1/nsd-c-1]
class-name = NetworkServiceDescriptorCreateFromPackage
name-file = NetworkServiceDescriptor.json
successor-remover = nsd-d-1

;nsd-delete
[it/vim-c-1/vnfp-c-1/nsd-c-1/nsd-d-1]
class-name = NetworkServiceDescriptorDelete
```

This example begins by storing a vim instance. Then the package iperf-server-package.tar is stored by specifying the package file name in the package-name attribute. 
The packages have to be in the directory /etc/openbaton/integration-test/vnf-packages/. 
Afterwards a NSD is created from the VNFDs in the package and right after that deleted (to keep this example short we did not create a NSR from the NSD and so on). Be aware that you 
have to use the class NetworkServiceDescriptorCreateFromPackage to store a NSD from a package. 
Then also the package will be deleted. You have to provide the name of the package you want to delete (not the file name this time but the name of the package defined in the Metadata.yaml). 
At the end the vim instance is deleted. 

If you create a NSD from a VNFPackage, the VNFD field of the NSD file would look something like this: 

```json
"vnfd":[
{
      "type":"server"
},
{
      "type":"client"
}

   ],
```

The integration test will search for VNFDs with these types that were previously stored by a VNFPackage and use them for creating the NSD. 

## Scaling
There are three testers for Scaling already implemented. The first one is *ScaleOut*. In the ini file this tester needs some additional attributes. Besides the normal *class-name* you should also specify the VNFR type on which the scale out should be performed in the field *vnf-type*. Then you can also specify the virtual-link to which the new instance should be connected using *virtual-link*. 
And you can determine a floating ip for the new instance using the field *floating-ip*. 
Here is an example of a ScaleOut task in the ini file:

```ini
[it/.../sc-o-1]
class-name = ScaleOut
vnf-type = client
virtual-link = private
floating-ip = random
```

The second tester is *ScaleIn*. Here you can just specify on which VNFR type the scale in should be executed. An example: 

```ini
[it/.../sc-i-1]
class-name = ScaleIn
vnf-type = client
```

And the third tester is used to see if after the scaling operation there is the right number of instances running. 
Specify the VNFR type you want to test by providing *vnf-type* in the ini file and specify the number of expected VNFC instances by using *vnfc-count*. For example: 

```ini
[it/.../sc-t-1]
class-name = ScalingTester
vnf-type = client
vnfc-count = 2
```

Furthermore note that the ScalingTester passes the updated NSR to the next tester. If you trigger a scaling function the NSR will change, but if you do not use ScalingTester (or NetworkServiceRecordGetLatest) the NSR used by the integration test will remain the old one before the scaling operation. 
So the recommended proceeding after a scale out or scale in is to wait until the operation finishes and then use the *ScalingTester* or at least the *NetworkServiceRecordGetLatest* to have the updated NSR. 


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

