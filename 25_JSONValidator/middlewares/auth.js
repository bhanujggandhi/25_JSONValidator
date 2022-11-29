const jwt = require("jsonwebtoken");
const config = require("config");

const authenticate = (req, res, next) => {
  const token = req.header("token");
  if (!token)
    return res.status(401).json({ message: "User is not authenticated" });

  try {
    const decryptpass = jwt.verify(token, config.get("secretOrKey"));
    req.user = decryptpass;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid token" });
  }
};

module.exports = authenticate;
