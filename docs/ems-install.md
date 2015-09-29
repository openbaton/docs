In order to install EMS manually, you need to clone the debian from the git repository and install the package. You can do it by issuing the following commands in the
terminal:

sudo apt-get install git
git clone -b develop https://gitlab.fokus.fraunhofer.de/openbaton/ems-public.git /opt/debian/ems
dpkg -i /opt/debian/ems/ems/ems_1.0-1.deb