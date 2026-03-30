import jwt from "jsonwebtoken";

// USER AUTH CHECK
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

    // ✅ Verify — invalid hone par automatically catch mein jayega
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({
      success: false,
      msg: "Token invalid ya expire ho gaya ❌",
    });
  }
};

// ADMIN CHECK
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated ❌",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Admin access only ❌",
      });
    }

    next();

  } catch (err) {
    console.error("ADMIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      msg: "Server error ❌",
    });
  }
};