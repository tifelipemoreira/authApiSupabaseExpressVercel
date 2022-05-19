const jwt = require("jsonwebtoken");
const accessValidation = require("../helpers/accessValidation");
require("dotenv/config");

module.exports = async function tokenLogin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing Token" });
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY);
    console.log(decode)
    const method = req.method
    endPoint = req.route.path.split('/')[1]
    userId = decode.id
    acessoPermitido = await accessValidation({method,endPoint,userId});
    if (!acessoPermitido) {
      return res.status(401).json({ message: "User is not authorized" });
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: "token validation fail", error: e });
  }
};
