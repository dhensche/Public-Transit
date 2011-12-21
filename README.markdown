#Installating and Building

This project uses node.js to attempt to create the feed needed for google public transit. 
To build the feed you will need:

* node.js (I have version 0.6.5)
* dateformat module
* async module
* sprintf module

One way of getting the required tools is the following list of commands (run either unix, OSX or cygwin)

```shell
git clone git://github.com/creationix/nvm.git ~/.nvm
```

Then add the following to either ~/.bashrc (unix) or ~/.bash_profile (OSX)

```shell
. ~/.nvm/nvm.sh
```

The rest of the commands are:

```shell
nvm install v0.6.5 #or any version you know is compatible
nvm use v0.6.5

npm install dateformat
npm install async
npm install sprintf

node google_transit.js
```

###Disclaimer:

I did not pay very much attention to packages used or installation procedures. Most of the information I provide can be found online in better tutorials.