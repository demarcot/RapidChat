# Rapid Chat
A chat application for the modern world.
Rapid Chat does not limit by users, messages sent, or the size of databases.
Rapid Chat is only limited by the hardware supplied.
For demo of application visit http://Rapidchat.today

last edited April 7 2017

## Installation
* Raspberry Pi/Linux
Clone Rapid Chat on Git

```
 $ git clone https://github.com/demarcot/RapidChat.git
```

On any Linux machine that is not a Rapid Chat box, perform the following command to install MongoDB

```
 $ sudo apt-get mongodb-server
```

To start the mongo service

```
 $ sudo service mongod start
```

Update our Debian apt package repository to include the NodeSource packages
- Note: The below script is run with root permissions review the code at https://deb.nodesource.com/setup_4.x to see the technical details behind this
- Note: Rapid Chat testing has been preformed on Node 4.x primarily and runs on Node 6.x, we cannot guarantee same quality of service if running on a higher version than Node 6.x

```
 $ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
```

Install Node

```
 $ sudo apt install nodejs
```

Install bower

```
 $ sudo npm install bower -g
```
Install node forever
- Note: This is an optional tool that Rapid Chat utilizes to host node server - check out their website at https://github.com/foreverjs/forever


```
 $ sudo npm install forever -g
```

Navigate to .forever folder within main directory

```

~/RapidChat/
|
├── .forever/
│   └── development.json
└── server.js

//customize this as you wish but leave the script attribute the same

{
    // Comments are supported
    "uid": "app",
    "append": true,
    "watch": true,
    "script": "server.js",
    "sourceDir": "/home/myuser/RapidChat"
}

```

Navigate to your main Rapid Chat directory

```
~/RapidChat/
```
Execute

```
 $ sudo npm install
```

Navigate to assets folder

```
~/RapidChat/frontend/app/assets/
```

Execute

```
 $ bower install
```


* Windows

Navigate to https://nodejs.org/dist/v4.4.5/node-v4.4.5-x64.msi to install node.js on a Windows machine

Navigate to https://www.mongodb.com/dr/fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.4.3-signed.msi/download to install Mongo on a Windows machine


Now clone Rapid Chat

```
 > git clone https://github.com/demarcot/RapidChat.git
```

To start the mongo service

```
 > mongod
```

Install bower

```
 > npm install bower -g
```

Install node forever
- Note: This is an optional tool that Rapid Chat utilizes to host node server - check out their website at https://github.com/foreverjs/forever


```
 > npm install forever -g
```

Navigate to .forever folder within main directory

```

~/RapidChat/
|
├── .forever/
│   └── development.json
└── server.js

//customize this as you wish but leave the script attribute the same

{
    // Comments are supported
    "uid": "app",
    "append": true,
    "watch": true,
    "script": "server.js",
    "sourceDir": "/home/myuser/RapidChat"
}

```

Navigate to your main Rapid Chat directory

```
C:\...\RapidChat\>
```
Execute

```
 > npm install
```

Navigate to assets folder

```
C:\...\RapidChat\frontend\app\assets\
```

Execute

```
 > bower install
```

## Operating Instructions

For Windows and linux to start the server inside your Rapid Chat directory Execute the following. While hosting the application at its default port(3000) this can be executed.

- Note: on linux systems if you are hosting out of a port less than 200 you need to preface the following command with sudo

```
forever start .forever/develop.json
```

To watch your server type

```
forever list
```

To stop server

```
forever stop all
```

## Components
- [Mongo DB](https://www.mongodb.com/) - Database
- [Express JS](https://expressjs.com/) - Node.js network app framework
- [Angular JS](https://angularjs.org/) - HTML enhanced for web apps
- [Node JS](https://nodejs.org/en/) - Evented I/O for the backend
- [Socket.io](https://socket.io/) - Database Communication

## Authors
* **Kyle Cabral**
* **Thomas DeMarco**
* **Albert Saunders**
* **Michael Withington**

## Future Plans
-Native Smartphone Application
-Native Desktop Application
-Voice Chat
-Video Chat
-File Transfer


## Contact (Submit Bugs)
contact Mike at mwithington1995@gmail.com

