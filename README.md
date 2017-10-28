# dmdiiportal

[![Greenkeeper badge](https://badges.greenkeeper.io/dmc-uilabs/dmdiiportal.svg)](https://greenkeeper.io/)

##Building project locally
Navigate to the jsonserver folder and run:

    node server.js

Navigate to the root of the dmdiiportal project and run:

    gulp serve
    
**************

 




##Building docker image on deployment server

    docker build -t dmdii-front .

##Creating and running docker container on demployment server

    docker container run -d -p 8080:80 dmdii-front