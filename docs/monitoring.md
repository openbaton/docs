# Monitoring

Open Baton interfaces with monitoring systems using a plugin mechanism. 
The plugin mechanism allows Open Baton to easily use multiple monitoring system. The following figure shows how the monitoring plugin communicate with the NFVO.

![monitoring-pic][monitoring-pic]

As you can see from the picture above the Monitoring Plugin (or Driver) is an intermediate between Open Baton and the specific monitoring system. 
Monitoring Plugin implements a Standard interface in order to be used by Open Baton.
An example of monitoring plugin is Zabbix plugin which allows Open Baton to use Zabbix Server. 
The Zabbix Plugin is already available and you can find the documentation [here](zabbix-plugin)

[monitoring-pic]: images/monitoring.png
