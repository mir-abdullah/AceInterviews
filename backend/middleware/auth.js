import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (token) {
      let decoded = jwt.verify(token, process.env.SECRET);
      req.userId = decoded?.id;
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    next();
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ message: "Unauthenticated" });
  }
};
