const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = process.env.JWT_SECRET || 'development-secret-change-me';

function hashPassword(password) { return bcrypt.hashSync(password, 10); }
function comparePassword(password, hash) { return bcrypt.compareSync(password, hash); }
function signToken(user) {
  return jwt.sign({ id:user.id, role:user.role, name:user.name, email:user.email }, secret, {expiresIn:'8h'});
}
function verifyToken(token) { return jwt.verify(token, secret); }

module.exports = {hashPassword, comparePassword, signToken, verifyToken};
