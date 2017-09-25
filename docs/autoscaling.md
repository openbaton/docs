# AutoScaling Engine

This external component provides an NFV-compliant AutoScaling Engine (ASE). In the following fundamentals are described such as installing the ASE, configuring it and how to use it such as creating AutoScaling policies.

The `autoscaling-engine` is implemented in java using the [spring.io] framework. It runs as an external component and communicates with the NFVO via Open Baton's SDK.

Additionally, the AutoScaling Engine uses the plugin mechanism to allow whatever Monitoring System you prefer. We use [Zabbix][zabbix] as the monitoring system in the following that must be preinstalled and configured. Additional information about [zabbix-plugin] can be found [here][zabbix-plugin].

Before starting this component you have to do the configuration of the AutoScaling Engine that is described in the [next chapter](#manual-configuration-of-the-autoscaling-engine) followed by the guide of [how to start](#starting-the-autoscaling-engine) and [how to use](#how-to-use-the-autoscaling-engine) it.

# Technical Requirements

* Preconfigured Open Baton environment (NFVO, VNFMs, VIM drivers)
* Running Zabbix server (if Zabbix is the monitoring system of choice) 
* Preconfgiured and running zabbix plugin either located in the folder `NFVO/plugins` or `autoscaling/plugins` to let it start automatically; or started manually. (if Zabbix is the monitoring system of choice)

# How to install AutoScaling Engine
If you installed this component already with the general bootstrap of Open Baton, the ASE is already installed, configured and running. In this case you can jump directly to this section [How to use AutoScaling Engine](#how-to-use-autoscaling-engine). If the NSE is not yet installed please continue with this section.

Different options are available for the installation of the AutoScaling Engine. Either you use the fully automated bootstrap where all configurations are done automatically where you can choose between the installation based on the debian package or on the source code which is suggested for development. Apart from the bootstrap you can also use the debian or the source code installation where you need to configure the AutoScaling Engine manually. 

## Installation via bootstrap

Using the bootstrap gives a fully automated installation of this component including installation and configuration. If you use the bootstrap you should place your monitoring plugin of choice directly in the `NFVO/plugins` folder before starting the orchestrator to have it already available when starting the AutoScaling Engine.

The only thing to do is to execute the following command and follow the configuration process: 

```bash
bash <(curl -fsSkl https://raw.githubusercontent.com/openbaton/autoscaling-engine/master/bootstrap)
```

Once you started the bootstrap you can choose between different options, such as installing this component via debian packages or via the source code (mainly for development)

## Installation via debian package

When using the debian package you need to add the apt-repository of Open Baton to your local environment with the following command if not yet done:
 
```bash
wget -O - http://get.openbaton.org/keys/public.gpg.key | apt-key add -
echo "deb http://get.openbaton.org/repos/apt/debian/ stable main" >> /etc/apt/sources.list
```

Once you added the repo to your environment you should update the list of repos by executing:

```bash
apt-get update
```

Now you can install the NSE by executing:

```bash
apt-get install openbaton-ase
```

## Installation from the source code

The latest stable version AutoScaling Engine can be cloned from this [repository][autoscaling-repo] by executing the following command:

```bash
git clone https://github.com/openbaton/autoscaling.git
```

Once this is done, go inside the cloned folder and make use of the provided script to compile the project and start as done below:

```bash
./autoscaling-engine.sh compile start
```

# Manual configuration of the AutoScaling Engine

This chapter describes what needs to be done before starting the AutoScaling Engine. This includes the configuration file and properties, and also how to make use of monitoring plugin.

## Configuration file
The configuration file must be copied to `etc/openbaton/openbaton-ase.properties` by executing the following command from inside the repository folder:

```bash
cp etc/ase.properties /etc/openbaton/autoscaling.properties
```

If done, check out the following chapter in order to understand the configuration parameters.

## Configuration properties

This chapter describes the parameters that must be considered for configuring the AutoScaling Engine.

| Params          				| Meaning       																|
| -------------   				| -------------																|
| logging.file					| location of the logging file |
| logging.level.*               | logging levels of the defined modules  |
| autoscaling.server.ip         | IP where the AutoScaling Engine is running. localhost might fit for most in the case when the System is running locally. If the System is running on another machine than the NFVO, you have to set the external IP here in order to subscribe for events towards the NFVO properly.      	|
| autoscaling.server.port       | Port where the System is reachable |
| autoscaling.rabbitmq.brokerIp | IP of the machine where RabbitMQ is running. This is needed for communicating with the monitoring plugin.	|
| spring.rabbitmq.username      | username for authorizing towards RabbitMQ |
| spring.rabbitmq.password      | password for authorizing towards RabbitMQ |
| nfvo.ip                       | IP of the NFVO |
| nfvo.port                     | Port of the NFVO |
| nfvo.username                 | username for authorizing towards NFVO |
| nfvo.password                 | password for authorizing towards NFVO |

## Monitoring plugin

The montoring plugin must be placed in the folder `plugins`. The zabbix plugin can be found [here][zabbix-plugin] with additional information about how to use and how to compile it.
If the plugin is placed in the folder mentioned before, it will be started automatically when starting the AutoScaling Engine. Additionally, you can place the plugin also in the `NFVO/plugins` folder to let it start automatically. 

**Note** If the NFVO is already in charge of starting the plugin, you should avoid to start it a second time from the AutoScaling Engine. Once started it can be used by all components.

# Starting the AutoScaling Engine

How to start the ASE depends on the way you installed this component.

### Debian packages

If you installed the ASE with the debian packages you can start it with the following command:

```bash
openbaton-ase start
```

For stopping it you can just type:

```bash
openbaton-ase stop
```

### Source code

If you are using the source code you can start the ASE easily by using the provided script with the following command:

```bash
./autoscaling-engine.sh start
```

Once the AutoScaling Engine is started, you can access the screen session by executing:

```bash
screen -r openbaton
```

For stopping you can use:
```bash
./autoscaling-engine.sh kill
```


**Note** Since the AutoScaling Engine subscribes to specific events towards the NFVO, you should take care about that the NFVO is already running when starting the AutoScaling Engine. Otherwise, the AutoScaling Engine will wait for 600 seconds for the availability of the NFVO before terminating automatically.

# How to use the AutoScaling Engine

This guide shows you how to make use of the AutoScaling Engine. In particular, it describes how to define AutoScaling Policies.

## Creating AutoScaling Policies

A AutoScaling Policy defines conditions and actions in order to allow automatic scaling at runtime. The list of AutoScalePolicies are defined at the level of the VNFD/VNFR.
An example of an AutoScalePolicy can be found below followed by descriptions for each parameter.

```json
"auto_scale_policy":[
  {
    "name":"scale-out",
    "threshold":100,
    "comparisonOperator":">=",
    "period":30,
    "cooldown":60,
    "mode":"REACTIVE",
    "type":"WEIGHTED",
    "alarms": [
      {
        "metric":"system.cpu.load[percpu,avg1]",
        "statistic":"avg",
        "comparisonOperator":">",
        "threshold":0.70,
        "weight":1
      }
    ],
    "actions": [
      {
        "type":"SCALE_OUT",
        "value":"2",
        "target":"<target>"
      }
    ]
  }
]
```
An example using the **TOSCA YAML descriptors** can be found [here][tosca-as].

This AutoScalePolicy indicates a scaling-out operation of two new VNFC Instances if the averaged value of all measurement results of the metric `cpu load` is greater than the threshold of 0.7 (70%).
This condition is checked every 30 seconds as defined via the period. Once the scaling-out is finished it starts a cooldown of 60 seconds. For this cooldown time further scaling requests are rejected by the AutoScaling Engine.

The following table describes the meanings of the parameters more in detail.

| Params          				| Meaning      |
| -------------   				| -------------
| name | This is the human-readable name of the AutoScalePolicy used for identification. |
| threshold | Is a value in percentage that indicates how many sub alarms have to be fired before firing the high-alarm of the AutoScalePolicy. For example, a value of 100 indicates that all sub alarms have to be fired in order to execute the actions of this AutoScalePolicy. |
| comparisonOperator | This comparison operator is used to check the percentages of thrown alarms. 100% means that all weighted alarms must be thrown. 50% would mean that only half of the weighted alarms must be thrown in oder to trigger the scaling action.|
| period | This is the period of checking conditions of AutoScalePolicies. For example, a value of 30 indicates, that every 30 seconds all the conditions of the defined AutoScalePolicy are checked. |
| cooldown | This is the amount of time the VNF needs to wait between two scaling operations to ensure that the executed scaling action takes effect. Further scaling actions that are requested during the cooldown period are rejected. |
| mode | This defines the mode of the AutoScalePolicy. This is mainly about the way of recognizing alarms and conditions, like: `REACTIVE`, `PROACTIVE`, `PREDICTIVE`. At this moment `REACTIVE` is provided only. |
| type | The type defines the meaning and the way of processing alarms. Here we distinguish between `VOTED`, `WEIGHTED`, `SIMPLE`. Currently supported is `WEIGHTED` |
| alarms | The list of alarms defines all the alarms and conditions that belongs to the same AutoScalePolicy. The list of alarms is affected by the mode and the type of the AutoScalePolicy and influences the final check towards the threshold that decides about the triggering of the AutoScalePolicy. Each alarm is composed as defined [here](#alarms). |
| actions | The list of actions defines the actions that shall be executed once the conditions (alarms) of the AutoScalePolicy are met and the corresponding actions of the AutoScalePolicy are triggered. Actions are defined as show [here](#actions). |

### Alarms

An alarm defines the conditions in order to trigger the automatic scaling.

| Params          				| Meaning     	|
| -------------   				| -------------
| metric | This is the name of the metric that is considered when checking the conditions, e.g., cpu idle time, memory consumption, network traffic, etc. This metric must be available through the Monitoring System. |
| statistic | This defines the way of calculating the final measurement result over the group of instances. Possible values are: avg, min, max, sum, count. |
| comparisonOperator | The comparisonOperator defines how to compare the final measurement result with the threshold. Possible values are: `=`, `>`, `>=`, `<`, `<=`, `!=`. |
| threshold | The threshold defines the value that is compared with the final measurement of a specific metric. |
| weight | The weight defines the weight of the alarm and is used when combining all the alarms of an AutoScalePolicy to a final indicator that defines how many alarms must be fired. In this way prioritized alarms can be handled with different weights. For example, there is an alarm with the weight of three and another alarm with the weight of one. If the Alarm with weight three is fired and the second one is not fired, the final result would be 75\% in the meaning of three quarters of the conditions are met. |

### Actions

An Action defines the operation that will be executed (if possible) when the scaling conditions are met that are defined in the Alarms.

| Params          				| Meaning       	|
| -------------   				| -------------
| type | The type defines the type of the action to be executed. For example, `SCALE_OUT` indicates that resources shall be added and `SCALE_IN` means that resources shall be released. Currently provided types of actions are listed [here](#action-types). |
| value | The value is related to the type of action. `SCALE_OUT` and `SCALE_IN` expects a value that defines how many instances should be scaled-out or scaled-in, `SCALE_OUT_TO` and `SCALE_IN_TO` expects a number to what the number of instances shall be scaled in or out. Supported types of actions are shown [here](#action-types) |
| target| [OPTIONAL] The target allows scaling of other VNFs when conditions are met of the considered VNF that includes the policy. The target points to the type of the VNF that should be scaled. If multiple VNFs has the same type, it will be chosen one of them to execute the scaling action. If the target is not defined, it will be executed scaling actions on the same VNF that includes the policy. |

#### Action types

Actions types are the operations that can be executed when defined conditions are met. The following list shows which actions are supported at the moment and what they will do.

| Params          				| Meaning |
| -------------   				| -------------
|SCALE_OUT | scaling-out a specific number of instances |
|SCALE_IN | scaling-in a specific number of instances |
|SCALE_OUT_TO | scaling-out to a specific number of instances |
|SCALE_IN_TO | scaling-in to a specific number of instances |

[autoscaling-repo]: https://github.com/openbaton/autoscaling
[zabbix-plugin]: http://openbaton.github.io/documentation/zabbix-plugin/
[zabbix]: http://www.zabbix.com/
[spring.io]:https://spring.io/
[openbaton]: http://openbaton.org
[openbaton-doc]: http://openbaton.org/documentation
[tosca-as]:tosca-asp.md
