$(function(){
    var socket = io();
    
    // server validates sign-in
    socket.on('signin', function(res){
        if (res['result'] == 'fail') {
            alert('Error: The username/password combo is invalid. This is probably due to the server having restarted. Press OK to log in again.')
            window.location.href = "login.html";
        } else {
            alert("Successfully logged in!")
            window.location.href = "dashboard.html";
        }
    });
    
    // redirect
    if (localStorage.getItem("userInfo") != null) {
        var json = JSON.parse(localStorage.getItem("userInfo"));
        json['encrypted'] = true;
        socket.emit('signin', json)
    } else {
        window.location.href = 'login.html';
    }
});