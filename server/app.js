const express = require('express');
const path = require('node:path');
const cors = require('cors');
require('dotenv').config();

const populateDb = require('./db/populateDb');

const musizRouter = require('./routes/musizRouter');

const app = express();
const BE_PORT = process.env.PORT || 6600;
const corsOptions = {
    origin: [`${process.env.FE_URL}`, 'http://localhost:3300'],
};

// Populate DB
const setupDB = async () => {
    if (process.env.POPULATE_DB === 'true') {
        try {
            console.log('STARTING SETUP DB');
            await populateDb();
            console.log('SETUP DB DONE');
        } catch (err) {
            console.log('SETUP DB FAILED', err);
        }
    } else {
        console.log('POPULATE_DB not enabled - skipping DB population.');
    }
};

(async () => {
    await setupDB();
})();

// Set up to communicate with FE
app.use(cors(corsOptions));

// Set up static directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Use middleware to get post req, take all data from url and convert to an encoded object to use in req
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', musizRouter);

// Handle Not found Error
// app.use((err, req, res, next) => {
//     console.error(err);
//     console.error(err.message);

//     res.status(err.statusCode || 500).render('404', { pageTitle: 'Page not Found' });
// });

app.use((req, res) => {
    res.status(404).render('404', { pageTitle: 'Error' });
});

app.listen(BE_PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server's listening on PORT: ${BE_PORT}`);
});
