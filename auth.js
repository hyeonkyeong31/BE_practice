const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];
        console.log("received jwt :", receivedJwt);

        if (receivedJwt) {
            let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            return decodedJwt;
        } else {
            throw new ReferenceError("jwt must be provided");
        }
    } catch (err) {
        console.log(err.name);
        return err;
    }
};

module.exports = ensureAuthorization;
