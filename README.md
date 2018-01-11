#Whitesuithacking Offline Docs

*README v0.0.1/31 DECEMBER 2017*

##CHANGING THE DATABASE

1. Goto mlab.com. signin and create a database and a user with read and write access.
2. Copy the mongodb client url
3. Open the source code you cloned from bitbucket. https://reactpro@bitbucket.org/reactpro/whitesuithacking.git. it contains the build folder      for your react app and the api server.
4. Change the working directory to config. open mongoose.js
5. Look for
```mongoose.connect("mongodb://reactpro:reactpro@ds033760.mlab.com:033760/whitesuitapp", { useMongoClient: true }).then((success)=>console.log("Connection to DB was successful!")).catch((error)=>console.log(error))``` and subtitute the first parameter of mongoose.connect with your       mongoclient url with valid username n password
6. Reload the app. goto your mongodb dashboard and select the admins collection.
7. Add a record with 
{"username": "any username",
 "password": "any password",
 "priviledge":"admin"}
8. save and login to your admin panel. using "your server ip"/admin

##CHANGING YOUR SERVER.

1. Clone the react app from https://github.com/habeebtheprogrammer/lms.git
2. Change directory to src and Open the config file.
3. Assign the new server ip to the host variable.


##Note
Whenever your server is down or you feel like shutting it down or restarting it. use the following command
1. pm2 stop app.js (this will stop the server from running)
2. pm2 start app.js (this will start the server and keep it running even if it crashes it will restart itself automatically).
3. pm2 status (to check the working condition of your server and the cpu consumption/usage. when its getting high you should know its time to scale)

HAPPY HACKING!!!