exports.requireFarmer = (req, res, next) => {
  if (req.user.role !== "FARMER" && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: Farmers only" });
  }
  next();
};

exports.requireAgronomist = (req, res, next) => {
  if (req.user.role !== "AGRONOMIST" && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: Agronomists only" });
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
