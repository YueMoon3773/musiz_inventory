const { body, query, validationResult, matchedData } = require('express-validator');

const db = require('../db/queries');

const songsPageGet = async (req, res) => {
    const beData = await db.getAllSongsAndInfo();
    // console.log({ beData });
    res.json({ beData });
};

const genresPageGet = async (req, res) => {
    const beData = await db.getAllGenres();
    // console.log(beData);
    res.json({ beData });
};

const artistsPageGet = async (req, res) => {
    const beData = await db.getAllArtists();
    // console.log(beData);
    res.json({ beData });
};

module.exports = {
    songsPageGet,
    genresPageGet,
    artistsPageGet,
};
