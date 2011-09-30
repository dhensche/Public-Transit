call ROOT.BAT
java -XX:MaxPermSize=256m -Xmx400M -DSYSTEM=DEV -DVIS_ROOT=%VIS_ROOT% -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5086 -Dcatalina.home=%CATALINA_HOME% -Dcatalina.base=%VIS_ROOT%\tomcat -jar %CATALINA_HOME%\bin\bootstrap.jar start
