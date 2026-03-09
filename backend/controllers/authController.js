const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 👈 nuevo

const SECRET_KEY = 'JWTokenCTIpV01'; // 🔐 usa una clave fuerte o variable de entorno

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ? AND status = TRUE', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'User not found or inactive' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // ✅ Generar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      SECRET_KEY,
      { expiresIn: '2h' } // ⏱️ duración del token
    );

    res.status(200).json({
      message: 'Login successful',
      token, // 👈 incluir el token en la respuesta
      userId: user.id,
      role: user.role,
      name: user.name
    });
  });
};