const crypto = require('crypto');

//Generating a random session String for security and logout purpose
function generateSession() {
  const sessionLength = 20; // Length of the session string in bytes 
  const session = crypto.randomBytes(sessionLength).toString('hex');
  return session;
}

module.exports = {
  generateSession,
};





