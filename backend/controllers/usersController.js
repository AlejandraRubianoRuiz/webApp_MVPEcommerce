const db = require('../db/connection');
const bcrypt = require('bcrypt');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users WHERE status = TRUE', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;

   if (isNaN(id)) {
    return res.status(400).send({ error: 'ID not valid, it must be a number' });
  }
  
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
};

exports.createUser = async (req, res) => {
  const { name, email, password, phone, address, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query(
      'INSERT INTO users (name, email, password, phone, address, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, gender],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User created', userId: results.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error encrypting password' });
  }
};

exports.updateUser = (req, res) => {
  const { name, email, phone, address, gender, status } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ?, status = ? WHERE id = ?',
    [name, email, phone, address, gender, status, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
};

exports.deleteUser = (req, res) => {
  db.query('UPDATE users SET status = FALSE WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
};


exports.getClientSummary = (req, res) => {
  const sql = `
    SELECT 
      u.id AS client_id,
      u.name AS client_name,
      u.email AS client_email,
      u.phone AS client_phone,
      COUNT(i.id) AS total_invoices,
      SUM(i.total_price) AS total_buys,
      MAX(i.date_invoice) AS last_buy
    FROM users u
    JOIN invoice i ON u.id = i.user_id
    WHERE i.status = TRUE AND u.role = 'client'
    GROUP BY u.id
    ORDER BY last_buy DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);

    const clients = results.map(row => ({
      id: row.client_id,
      name: row.client_name,
      email: row.client_email,
      phone: row.client_phone,
      total_invoices: row.total_invoices,
      total_buys: parseFloat(row.total_buys),
      last_buy: row.last_buy
    }));

    res.json(clients);
  });
};