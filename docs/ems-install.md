EMS(Element Management System) is a tool that is needed in order to process and issue the commands on behalf of the orchestrator. It takes the messages in json format
from the ActiveMQ-server, which serves as a broker between EMS and VNFM (Virtual Network Funktion Manager). EMS connects to a specific queue that is derived from the hostname
that was given to it. Hostname can be updated in the /etc/openbaton/ems/conf.ini file. There you can also update ip of the broker and port, through which EMS addreses it.

There are 2 ways to install EMS manually on your computer, the first one uses apt-get repository, you need to issue following commands in the command line:

echo "deb http://193.175.132.176/repos/apt/debian/ ems main" >> /etc/apt/sources.list

wget -O - http://193.175.132.176/public.gpg.key | apt-key add -

apt-get update

apt-get install ems

The second way revolves around manually downloading the debian package and installing it. For this the following commands need to be issued:

wget - http://193.175.132.176/ems_1.0-1.deb

dpkg -i ems_1.0-1.deb