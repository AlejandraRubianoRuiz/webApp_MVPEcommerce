const express = require('express');
const router = express.Router();

const controller = require('../controllers/invoiceItemsController');

router.get('/', controller.getAllInvoicesItems);
router.get('/:id', controller.getInvoiceItemById);
//Por numero de factura
router.get('/invoiceId/:id', controller.getItemsByInvoiceId);
router.post('/', controller.createInvoiceItems);
router.put('/:id', controller.updateInvoiceItems);
router.delete('/:id', controller.deleteInvoiceItems);

module.exports = router;