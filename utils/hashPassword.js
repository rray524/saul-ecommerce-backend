const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = { hashPassword, comparePassword };