#!/bin/bash
if [ "$EUID" -ne 0 ]
	then echo "Please run as root"
	exit
fi

IS_YUM=$(which yum)
IS_APT=$(which apt-get)
REG_USER=${SUDO_USER:-${USERNAME:-unknown}}

if [[ ! -z $IS_YUM ]]; then
	INSTALL_CMD="yum"
elif [[ ! -z $IS_APT ]]; then
	INSTALL_CMD="apt-get"
else
	echo "Don't know how to install PHP"
	exit 1;
fi

#$INSTALL_CMD install php5 php5-cli
#npm install -g bower gulp babel browser-sync
sudo -u ${REG_USER} bower install
