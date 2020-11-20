// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var ParseDashboard = require('parse-dashboard');
var AppConfig = require("./AppConfiguration");
var http = require('http')
var socketIo = require('socket.io')

var env = process.env.environment || "LOCALHOST";

// var env = "PRODUCTION";
var configuration = AppConfig.serverConfig[env + ""];
var databaseUri = configuration.databaseUri;

// var databaseUri = 'mongodb+srv://project:avinash1992@cluster0-egtfo.mongodb.net/hopperStore-Prod?retryWrites=true&w=majority' || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
console.log(databaseUri)
var api = new ParseServer({
  // databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:8081/parse',  // Don't forget to change to https if needed
  // liveQuery: {
  //   classNames: ["StoreDetails"] // List of classes to support for query subscriptions
  // }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/dashboard', ParseDashboard(AppConfig.dashboardConfig, true));
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 8081;
var httpServer = require('http').createServer(app);
const io = socketIo(httpServer);

// io.on("connection", (socket) => {
//   console.log("client Avinash connected")
//   socket.emit("message", new Date());
//   socket.emit("id", socket.id);
//   // Parse.Cloud.run("Socket");
// })

var numUsers = 0;
// const rootSocket = (io) => {
  io.on('connection', (socket) => {
    var addedUser = false;
    let customerId = socket.handshake.query['roomId'];
    const sessionToken = socket.handshake.query['sessionToken'];
    console.log("socket", customerId, sessionToken);
    // socket.join(customerId);
    // if(customerId && sessionToken) {
    //   Parse.Cloud.run("Notification", {customerId}, {sessionToken}).then(res => {
    //     // console.log("data", res);
    //     io.to(customerId).emit("message", res);
    //   });
    // }
    socket.join(customerId, (data)=> {
      if(customerId && sessionToken) {
        io.to(customerId).emit("message", "hello");
        Parse.Cloud.run("Notification", {customerId}, {sessionToken}).then(res => {
          console.log("Notification", res);
          io.to(customerId).emit("message", res);
        });
      }
    });
    // // io.in(customerId).emit('message', 'cool game');
    // io.to(customerId).emit("message", "hello");
    // when the client emits 'new message', this listens and executes
    socket.on('message', (data) => {
      // we tell the client to execute 'new message'
      console.log("Data", data);
      // Parse.Cloud.run("GetStore");
      io.sockets.in(data.receiver).emit('message', "hii");
      Parse.Cloud.run("AddNotification", data, {sessionToken}).then(res => {
        console.log("return data", res);
        // io.sockets.emit('message',res);
        io.sockets.in(data.receiver).emit('message', res);
      });
      // io.sockets.emit('message',customerId);
      // socket.broadcast.emit('message',data);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
      console.log("Add User", username);
      if (addedUser) return;

      // we store the username in the socket session for this client
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });

    // For Reading message
    socket.on('read', (data) => {
      console.log("Read", data);
      socket.broadcast.emit('read', data);
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
  });
// };

httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// exports.default = rootSocket;
// This will enable the Live Query real-time server
// console.log("httpServer", httpServer);
// ParseServer.createLiveQueryServer(httpServer);
