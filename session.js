// *********************************************
// author: hdev1
// this files handles the sessions for the users
// *********************************************

exports.sessions = [] // magister sessions

exports.pushSession = function(session) {
    
    // check if session exists
    if (exports.sessions.indexOf(session) > -1) {
        return "err:99";
    }
    
    // push
    exports.sessions.push(session)
}

exports.getSession = function(school,name,pass) {
    var e = "none";
    // setup magister session
    var session = new Magister.Magister({
        school: school,
        username: name,
        password: pass})
    
    return session;
}