const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res
      .status(400)
      .json({ message: `${field} already exists.` });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token." });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token has expired." });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
};

module.exports = errorHandler;
