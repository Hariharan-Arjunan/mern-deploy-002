import jwt from "jsonwebtoken";

const verifyJwt = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
  try {
    jwt.verify(token, "SECTRET");

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default verifyJwt;
