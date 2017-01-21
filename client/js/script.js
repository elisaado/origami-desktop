$(function(){
    var socket = io();
    // --- Socket.io ---
    
    $('#signin').on('click', function(e){
        e.preventDefault();
        // set up json request
        var json = {
            schoolName: $('#school').val(),
            username: $('#username').val(),
            password: $('#password').val()
        }
        // emit request
        socket.emit('signin', json)
    });
    
    socket.on('signin', function(res){
        if (res['result'] == 'fail') {
            alert('Error: ' + res['error'])
        } else {
            // save to localStorage
            localStorage.setItem('userInfo', JSON.stringify(res['session']));
            alert('Successfully logged in.')
            window.location.href = 'dashboard.html'
        }
    });
});