# Zabbix server 3.0 installation and configuration

## On Ubuntu 14.04 

While performing the installation on the same host where the NFVO was installed, remember that both systems are heavily consuming CPU and Memory resources, therefore you'll need a powerful machine in order to have proper performances results.

During the installation the installer will request to put a password for the user root of the mysql server. You can choose the password you like (we'll refer from now on to this password as MYSQL_USER_PASSWORD_DEFAULT variable), however make sure you use the same password while configuring zabbix components later on.
```sh
sudo su
ZABBIX_PACKAGE="zabbix-release_3.0-1+trusty_all.deb"
ZABBIX_REPO="http://repo.zabbix.com/zabbix/3.0/ubuntu/pool/main/z/zabbix-release/${ZABBIX_PACKAGE}"
wget "${ZABBIX_REPO}"
dpkg -i "${ZABBIX_PACKAGE}"
rm "${ZABBIX_PACKAGE}"
apt-get update && apt-get -y install mysql-server zabbix-server-mysql zabbix-frontend-php
```

Once done, you should configure the file /etc/php5/apache2/php.ini file with the following commands: 

```
# choose the timezone you prefer
sed -i 's/;date.timezone =/date.timezone = "Europe\/Berlin"/' /etc/php5/apache2/php.ini
sed -i 's/# DBPassword=/DBPassword=/' /etc/zabbix/zabbix_server.conf
wget https://raw.githubusercontent.com/openbaton/juju-charm/develop/hooks/zabbix.conf.php
cp zabbix.conf.php /etc/zabbix/web/zabbix.conf.php 
rm zabbix.conf.php
```

Import all the related database tables: 

```
export MYSQL_USER_PASSWORD_DEFAULT=<put-your-root-mysql-password-here> 
mysql -uroot -e "create database zabbix character set utf8 collate utf8_bin;" -p"${MYSQL_USER_PASSWORD_DEFAULT}"
mysql -uroot -e "grant all privileges on zabbix.* to zabbix@localhost identified by '';" -p"${MYSQL_USER_PASSWORD_DEFAULT}"
zcat /usr/share/doc/zabbix-server-mysql/create.sql.gz | mysql -uroot -p"${MYSQL_USER_PASSWORD_DEFAULT}" zabbix
```

Restart services and you are almost done:

```sh
service apache2 reload
service zabbix-server restart
```

At this point the Zabbix frontend should be available at http://your-ip/zabbix in the browser. Default username/password is Admin/zabbix. It will pop up a wizard window which will guide you through the final configuration of the server. 

Additionally, you need to configure the auto registration action so that VNFs hosts are added automatically into zabbix db when they are started. 
For doing it you can either do it via the zabbix dashboard reachable at  http://your-ip/zabbix/actionconf.php or using the provided python script. Follow the below guidelines to understand this process.  

## Configure the auto registration using the provided helper script

In order to facilitate the configuration of the Zabbix Server, we also provide a zbx_helper.py script which executes all actions in once. 
You should run the following command into the host: 

```sh
wget https://raw.githubusercontent.com/openbaton/juju-charm/develop/hooks/zbx_helper.py
# modify any parameters like Zabbix username and password in the main function at the bottom of the script and execute the following: 
python zbx_helper.py -a
```

After that, the zabbix server is ready to monitor your VNFs!


[zabbix-create-action-1]:images/zabbix-add-action-1.png
[zabbix-create-action-2]:images/zabbix-add-action-2.png
[zabbix-create-action-3]:images/zabbix-add-action-3.png


