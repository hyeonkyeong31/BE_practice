const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    //비밀번호 암호화
    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("base64");

    let sql = "INSERT INTO users (email, password) VALUES (?,?)";
    let values = [email, password];

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.CREATED).json(results);
    });
};

const login = (req, res) => {
    const { email, password } = req.body;
    let sql = "SELECT * FROM users WHERE email =?";
    let values = [email, password];

    conn.query(sql, email, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        const loginUser = results[0];

        if (loginUser && loginUser.password == password) {
            //토큰발행
            const token = jwt.sign(
                {
                    id: loginUser.id,
                    email: loginUser.email,
                },
                process.env.PRIVATE_KEY,
                {
                    expiresIn: "5m",
                    issuer: "gaeng",
                }
            );
            //토큰 쿠키에 담기
            res.cookie("token", token, {
                httpOnly: true,
            });
            console.log(token);
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.ststus(StatusCodes.UNAUTHORIZED).end();
        }
    });
};
const passwordResetRequest = (req, res) => {
    const { email } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";
    conn.query(sql, email, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        //이메일로 유저가 있는지 찾아보기
        const user = results[0];
        if (user) {
            return res.status(StatusCodes.OK).json({
                email: email,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    });
};
const passwordReset = (req, res) => {
    const { email, password } = req.body;

    let sql = `UPDATE users SET password=?, salt=? WHERE email=?`;

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("base64");

    let values = [password, salt, email];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.affectedRows == 0)
            return res.status(StatusCodes.BAD_REQUEST).end();
        else return res.status(StatusCodes.OK).json(results);
    });
};
module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset,
};
