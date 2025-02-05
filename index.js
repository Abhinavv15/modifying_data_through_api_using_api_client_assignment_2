const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const MenuItem = require('./MenuItem')
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));


mongoose.connect(process.env.mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


app.put('/menu/:id', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Menu item not found');
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).send('Error updating menu item');
    }
});

app.delete('/menu/:id', async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send('Menu item not found');
        }
        res.send('Menu item deleted successfully');
    } catch (error) {
        res.status(400).send('Error deleting menu item');
    }
});

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
