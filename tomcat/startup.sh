#!/bin/sh

.  root.sh

java \
-Xms128m -Xmx400m -XX:MaxPermSize=400m \
-DISIS_ROOT=$ISIS_ROOT \
-DSYSTEM=DEV -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5086 \
-Dorg.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true \
-Dcatalina.home=/usr/local/tomcat \
-Dcatalina.base=$ISIS_ROOT/tomcat \
-jar /usr/local/tomcat/bin/bootstrap.jar \
start