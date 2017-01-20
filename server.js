//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var imports = require('./imports.js');
var session = require('./session.js');

// Create server
var router = express();
var server = http.createServer(router); //http server
var io = socketio.listen(server); //socket.io server
var sockets = []

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (socket) {
  console.log('[i] A user has made a connection')
  sockets.push(socket)
  socket.on('signin', function(json){
    
    var s = session.getSession(json.schoolName, json.username, json.password); // get session
    var err = "none"; // validate session
    
    s.ready(function (error) { // validate session using .ready()
	    if (error) {
            err = "error: " + error
	    }
    });
    
    if (err == "none") { // check if session is valid
      socket.emit("signin", { // return session
        result: 'success',
        session: {
          schoolName: json.schoolName,
          username: json.username,
          password: json.password
        }
      });
    } else {
      console.log(err)
      socket.emit('signin', { // return fail
        result: 'fail',
        error: err
      })
    }
  })
});

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("[i] Started server on", addr.address + ":" + addr.port);
});
