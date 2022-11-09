
const jwt = require('jsonwebtoken');

const verifyIsLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        // console.log(token)
        if (!token) {
            res.status(403).send("A token is required for authentication");
        }
        // validating correct token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).send("Unathorized token");
        }

    } catch (error) {
        next(error);
    }
}


const verifyIsAdmin = async (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401).send("Unathorized. Admin is allowed to access this only")
    }

}
module.exports = { verifyIsLoggedIn, verifyIsAdmin };