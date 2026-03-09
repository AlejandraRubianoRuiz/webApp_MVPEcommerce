const express = require('express');
const router = express.Router();

const controller = require('../controllers/invoicesController');

router.get('/details', controller.getInvoicesWithDetails); // ✅ primero
router.get('/:id', controller.getInvoiceById);     // ✅ restringido a números
router.get('/', controller.getAllInvoices);
router.post('/', controller.createInvoice);
router.put('/:id', controller.updateInvoice);
router.delete('/:id', controller.deleteInvoice);

module.exports = router;