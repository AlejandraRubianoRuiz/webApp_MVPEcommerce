//Crea un servidor
const express = require('express');
const app = express();

//Permite peticiones desde el frontend
const cors = require('cors');
app.use(cors());


const port = 3000;

app.use(express.json());


// Import routes
const userRoutes = require('./routes/users');
const stockRoutes = require('./routes/stocks');
const invoiceRoutes = require('./routes/invoices');
const invoiceItemsRoutes = require('./routes/invoiceItems');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/invoiceItems', invoiceItemsRoutes);
app.use('/auth', authRoutes);

app.use('/images', express.static('public/images'));

/*app.get("/test-image", (req, res) => {
  res.sendFile(__dirname + "/public/images/1761459936846.png");
});*/

app.listen(port,()=>{console.log(`Servidor corriendo en el puerto: ${port}`)});