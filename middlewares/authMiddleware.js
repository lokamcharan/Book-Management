const jwt = require("jsonwebtoken");
const verify = async (req, res, next) => {

// console.log(createError)
  if (req.headers.authorization.startsWith("Bearer")) {
    
    try {
      let token = req.headers.authorization.split(" ")[1];
    
      const decoded = jwt.verify(token, "secretKey123");
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({
      status: "Fail",
      message: "Not authorized, no token",
    });
  }
};

const restrict = (role) => {
    return (req, res, next) => {
      // console.log("restrict")
      if (req.user.role !== role) {
      return res.status(400).json({message:"unauthorized user denied access"})
      }
      next();
    };
  };

module.exports = {verify,restrict};
