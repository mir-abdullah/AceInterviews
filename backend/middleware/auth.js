import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    // Get the token from cookies
    let token = req.cookies.token;

    if (token) {
      // Verify the token
      let decoded = jwt.verify(token, process.env.SECRET);
      req.userId = decoded?.id;
    }

    // If the userId is not set, return unauthenticated
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ message: "Unauthenticated" });
  }
};
