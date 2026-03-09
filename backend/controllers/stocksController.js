const db = require('../db/connection');

exports.getAllStocks = (req, res) => {
  const isAdmin = req.user?.role === "admin";
   //console.log("Usuario autenticado:", req.user); // 👈 agrega esto
   //console.log("¿Es admin?:", isAdmin); // 👈 y esto

  const query = isAdmin
    ? "SELECT * FROM stock WHERE status = TRUE"
    : "SELECT * FROM stock WHERE status = TRUE AND quantity > 0";

  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getStockById = (req, res) => {
  db.query('SELECT * FROM stock WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
};

exports.createStock = (req, res) => {
  const { name, description, reference, quantity, price, brand } = req.body;
  console.log(req.file)
  const image_url = req.file ? `/images/${req.file.filename}` : null;


  db.query(
    'INSERT INTO stock (name, description, reference, quantity, price, brand, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, reference, quantity, price, brand, image_url],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, image_url });
    }
  );
};

exports.updateStock = (req, res) => {
  const { name, description, reference, quantity, price, brand, status } = req.body;
  const { id } = req.params;

  const image_url = req.file ? `/images/${req.file.filename}` : null;

  const fields = [];
  const values = [];

  if (name) { fields.push("name = ?"); values.push(name); }
  if (description) { fields.push("description = ?"); values.push(description); }
  if (reference) { fields.push("reference = ?"); values.push(reference); }
  if (quantity !== undefined) {
  fields.push("quantity = ?");
  values.push(quantity);
}
  if (price) { fields.push("price = ?"); values.push(price); }
  if (brand) { fields.push("brand = ?"); values.push(brand); }
  if (status !== undefined) { fields.push("status = ?"); values.push(status); }
  if (image_url) { fields.push("image_url = ?"); values.push(image_url); }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron campos para actualizar." });
  }

  values.push(id);

  const sql = `UPDATE stock SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Producto actualizado correctamente", image_url });
  });
};

exports.deleteStock = (req, res) => {
  db.query('UPDATE stock SET status = FALSE WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
};

exports.increaseStock = (req, res) => {
  const productId = req.params.id;
  db.query(
    'UPDATE stock SET quantity = quantity + 1 WHERE id = ?',
    [productId],
    (err, result) => {
      if (err) return res.status(500).send({ error: 'Error, stock not updated' });
      res.send({ message: 'Update stock!' });
    }
  );
};