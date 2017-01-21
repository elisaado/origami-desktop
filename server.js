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

// Credit to lollyrock.com for aes cipher code
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';
const password = new Date().getTime().toString();

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (socket) {
  console.log('[i] A user has made a connection')
  sockets.push(socket)
  socket.on('signin', function(json){
    // check if empty
    if (json.encrypted == true) {
      json.schoolName = decrypt(json.schoolName);
      json.username = decrypt(json.username);
      json.password = decrypt(json.password);
    }
    
    if (json.schoolName == "" || json.username == "" || json.password == "") {
      socket.emit('signin', { // return fail
        result: 'fail',
        error: 'No box can be empty.'
      });
      
    }
    try {
      // session checking
      var s = session.getSession(json.schoolName, json.username, json.password); // get session
      var err = "none"; // validate session
      
      s.ready(function (error) { // validate session using .ready()
  	    if (error) {
          err = "error: " + error
          socket.emit('signin', { // return fail
          result: 'fail',
          error: err
        }); } else {
  	      socket.emit("signin", { // return session
          result: 'success',
          session: {
            schoolName: encrypt(json.schoolName),
            username: encrypt(json.username),
            password: encrypt(json.password),
            encrypted: true
          }
        });
  	    }
      });
    } catch(error) {}
  });
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
