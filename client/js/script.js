$(function(){
    var socket = io();
    // --- Socket.io ---
    $('#signin').on('click', function(){
        // set up json request
        var json = {
            schoolName: $('#school').val(),
            username: $('#username').val(),
            password: $('#password').val()
        }
        // emit request
        socket.emit('signin', json)
    })
    
    socket.on('signin', function(res){
        if (res['result'] == 'fail') {
            alert('Error: ' + res['error'])
        } else {
            alert('Successfully logged in.')
            alert('TODO: Add to localStorage')
        }
    })
});