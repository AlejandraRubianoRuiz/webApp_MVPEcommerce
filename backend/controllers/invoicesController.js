const db = require("../db/connection");

exports.getAllInvoices = (req, res) => {
  db.query("SELECT * FROM invoice WHERE status = TRUE", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getInvoiceById = (req, res) => {
  const id = req.params.id;   // ✅ aquí defines la variable

  if (isNaN(id)) {
    return res.status(400).send({ error: 'ID not valid, it must be a number' });
  }

  db.query(
    "SELECT * FROM invoice WHERE id = ?",
    [id],   // ✅ usas la variable id
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) {
        return res.status(404).send({ error: 'Invoice not found' });
      }
      res.json(results[0]);
    }
  );
};

exports.createInvoice = (req, res) => {
  const { user_id, date_invoice, total_price } = req.body;
  db.query(
    "INSERT INTO invoice (user_id, date_invoice, total_price) VALUES (?, ?, ?)",
    [user_id, date_invoice, total_price],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId });
    }
  );
};

exports.updateInvoice = (req, res) => {
  const { user_id, date_invoice, total_price } = req.body;
  db.query(
    "UPDATE invoice SET user_id = ?, date_invoice = ?, total_price = ?, status = ? WHERE id = ?",
    [user_id, date_invoice, total_price, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
};

exports.deleteInvoice = (req, res) => {
  db.query(
    "UPDATE invoice SET status = FALSE WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
};

exports.getInvoicesWithDetails = (req, res) => {

  //console.log("prueba de ruta");
  const sql = `
    SELECT 
      i.id AS invoice_id,
      i.date_invoice AS invoice_date,
      c.id AS client_id,
      c.name AS client_name,
      c.email AS client_email,
      s.id AS stock_id,
      s.name AS stock_name,
      s.price,
      ii.quantity,
      ii.unit_price,
      ii.subtotal
    FROM invoice i
    JOIN users c ON i.user_id = c.id
    JOIN invoice_items ii ON i.id = ii.invoice_id
    JOIN stock s ON ii.product_id = s.id
    ORDER BY i.id DESC;
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al obtener facturas:', err);
      return res.status(500).send({ error: 'Error al obtener facturas' });
    }

    const invoices = {};

    rows.forEach(row => {
      if (!invoices[row.invoice_id]) {
        invoices[row.invoice_id] = {
          id: row.invoice_id,
          date: row.invoice_date,
          client: {
            id: row.client_id,
            name: row.client_name,
            email: row.client_email
          },
          stocks: []
        };
      }

      invoices[row.invoice_id].stocks.push({
        id: row.stock_id,
        name: row.stock_name,
        price: row.price,
        quantity: row.quantity,
          unit_price: parseFloat(row.unit_price),
  subtotal: parseFloat(row.subtotal)
      });
    });

    res.json(Object.values(invoices));
  });
};
