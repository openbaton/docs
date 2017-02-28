# Zabbix server (2.2) installation and configuration

## On Ubuntu 14.04 

While performing the installation on the same host where the NFVO was installed, remember that both systems are heavily consuming CPU and Memory resources, therefore you'll need a powerful machine in order to satisfy both requirements

During the installation the installer will request to put a password for the user root of the mysql server. You can choose the password you like, however make sure you use the same password while configuring zabbix components
```sh
sudo su
wget http://repo.zabbix.com/zabbix/2.2/ubuntu/pool/main/z/zabbix-release/zabbix-release_2.2-1+trusty_all.deb
dpkg -i zabbix-release_2.2-1+trusty_all.deb
apt-get update && apt-get -y install mysql-server zabbix-server-mysql zabbix-frontend-php
```

Once done, you should configure the file /etc/php5/apache2/php.ini file with the following parameters: 

```
[PHP]
.....
max_execution_time = 300
memory_limit = 128M
post_max_size = 16M
upload_max_filesize = 2M
max_input_time =  300
......
[Date]
date.timezone = Europe/Berlin
```


Restart the apache service and you are almost done:

```sh
/etc/init.d/apache2 restart
```

At this point the Zabbix frontend should be available at http://your-ip/zabbix in the browser. Default username/password is Admin/zabbix. It will pop up a wizard window which will guide you through the final configuration of the server. 

Additionally, you need to configure the auto registration action so that VNFs hosts are added automatically into zabbix db when they are started. For doing it you can either do it via the zabbix dashboard reachable at  http://your-ip/zabbix/actionconf.php or using the provided sql file. Both options are explained below

## Configure the auto registration using the dashboard

First of all you need to open the actions tab

![zabbix-create-action-1][zabbix-create-action-1]

Then you need to create an action:

![zabbix-create-action-2][zabbix-create-action-2]

Finally you need to add two operations:

* add host
* link to template: you can select the template you prefer

![zabbix-create-action-3][zabbix-create-action-3]

Remember to save all the changes in all tabs.

## Configure the auto registration importing the sql file
In order to facilitate the configuration of the Zabbix Server, we also provide a zabbix.sql file with all the configuration already done. The file can be found in the folder zabbix-configuration of the zabbix-plugin project.
You should run the following command into the host: 

```sh
# Please note that this will overwrite whatever configuration or data is stored into the existing zabbix db.
mysql -u root -p zabbix < zabbix.sql
```

After that, the zabbix server is ready to monitor your VNFs!


[zabbix-create-action-1]:images/zabbix-add-action-1.png
[zabbix-create-action-2]:images/zabbix-add-action-2.png
[zabbix-create-action-3]:images/zabbix-add-action-3.png


