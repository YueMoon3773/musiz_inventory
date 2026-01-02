const { body, query, validationResult, matchedData } = require('express-validator');

const db = require('../db/queries');

const homePageGet = async (req, res) => {
    // res.render('index', { pageTitle: 'Home' }); // in case render ejs
    // res.json({ animals: ['bird', 'cow', 'tiger'] });
    const data = await db.getAllData();
    // console.log({ data });

    res.json({ data });
};

module.exports = {
    homePageGet,
};
