const jwt=require("jsonwebtoken");

 const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded;
      next();
    })
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};
function generateToken(user) {
  const posalji = {
    id: user.id,
    type: user.type // tip korisnika (profesionalac, pocetnik ili admin)
  };
  return jwt.sign(posalji, process.env.JWT_SECRET, { expiresIn: '1h' });
}
module.exports={
  authenticateToken:authenticateToken,
  verifyToken:verifyToken,
  generateToken:generateToken
}