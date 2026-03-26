import jwt from "jsonwebtoken";

//  USER AUTH CHECK
export const isAuthenticatedUser = (req, res, next) => {
  try {
    let token = req.headers.authorization;


    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided ❌",
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token ❌",
      });
    }

    req.user = decoded;

    next(); 

  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      success: false,
      msg: "Token failed ",
    });
  }
};


//  ADMIN CHECK
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "User not authenticated ❌",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Admin access only ",
      });
    }

    next();

  } catch (err) {
    console.log("ADMIN ERROR:", err.message);

    return res.status(500).json({
      msg: "Server error ",
    });
  }
};