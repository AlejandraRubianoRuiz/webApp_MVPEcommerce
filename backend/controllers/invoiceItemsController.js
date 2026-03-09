const db = require('../db/connection');

exports.getAllInvoicesItems = (req, res) => {
  db.query('SELECT * FROM invoice_items WHERE status = TRUE', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.getInvoiceItemById = (req, res) => {
  db.query('SELECT * FROM invoice_items WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
};

exports.getItemsByInvoiceId = (req, res) => {
  const invoiceId = req.params.id;
  db.query(
    'SELECT * FROM invoice_items WHERE invoice_id = ?',
    [invoiceId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
};

exports.createInvoiceItems = (req, res) => {
  const {invoice_id, product_id, quantity, unit_price, subtotal} = req.body;
  db.query(
    'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
    [invoice_id, product_id, quantity, unit_price, subtotal],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId });
    }
  );
};

exports.updateInvoiceItems = (req, res) => {
  const { invoice_id, product_id, quantity, unit_price, subtotal} = req.body;
  db.query(
    'UPDATE invoice SET invoice_id = ?, product_id = ?, quantity = ?, unit_price = ?, subtotal = ?, status = ? WHERE id = ?',
    [nvoice_id, product_id, quantity, unit_price, subtotal, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
};

exports.deleteInvoiceItems = (req, res) => {
  db.query('UPDATE invoice_items SET status = FALSE WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
};