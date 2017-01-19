#!/bin/bash

#importing devUtil
source ./devUtil.sh

#location of the dist folder after created locally with gulp build
sendFile="/home/t/Desktop/DMC/staFrontEnd/frontend/dist"
#key for frontend machine
front_ssh_keyC="/home/t/Desktop/keys/portalid1032_rsa.pem"
#front machine user do not chnage for aws
front_userC=dmcAdmin
#ip of frontend machine
front_hostC="23.96.185.244"
serverURL="portal.opendmc.org"


scpSend() {
   timestamp=`date --rfc-3339=seconds`
    echo "Version created $timestamp" > "DeployedVersion.txt";
    scp -i $front_ssh_keyC -r DeployedVersion.txt $front_userC@$front_hostC:~
    scp -i $front_ssh_keyC -r $sendFile $front_userC@$front_hostC:~
    scp -i $front_ssh_keyC -r deployMe_front_functions_azure.sh $front_userC@$front_hostC:~

    updateFront
}

updateFront() {
  ssh -tti $front_ssh_keyC $front_userC@$front_hostC <<+
    printf "Updating frontend Code Base"
    # sudo yum update -y

    cd /tmp
    rm -rf rando
    mkdir rando
    cd rando

    cp -r ~/dist/ .
    cp ~/deployMe_front_functions_azure.sh .

    source deployMe_front_functions_azure.sh

    unzip *.zip
    #code is now in /tmp/rando/dist


    #update the loginURL
    cd /tmp/rando/dist/templates/common/header
    echo "set loginURL to $serverURL "
    setLoginUrl

    #update the keys
    cd /tmp/rando/dist/scripts/common/models/
    frontendUpload

    #update the serverURL
    cd /tmp/rando/dist/
      setWindowApiUrl

    sudo systemctl stop httpd.service

    # remove old code from apache
    sudo rm -rf /var/www/html/*
    #moving files to web forlder
    sudo mv /tmp/rando/dist/* /var/www/html/.
    #restart apache
    sudo systemctl start httpd.service
    exit

+
}

scpSend
echo "done updating -- back on local and done :)"
