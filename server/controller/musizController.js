const { body, query, validationResult, matchedData } = require('express-validator');

const db = require('../db/queries');

const songValidator = [
    body('song')
        .not()
        .isEmpty()
        .withMessage('Song name must be filled')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Song name must be between 2 and 30 characters'),
];
const genreValidator = [
    body('genre')
        .not()
        .isEmpty()
        .withMessage('Genre name must be filled')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Genre name must be between 2 and 30 characters'),
];
const artistValidator = [
    body('artist')
        .not()
        .isEmpty()
        .withMessage('Artist name must be filled')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Artist name must be between 2 and 30 characters'),
];

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

const createGenrePost = [
    genreValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({
                errors: errors.array(),
            });
        }
        const { genre: genreName } = matchedData(req);
        console.log({ genreName });
        db.insertNewGenre(genreName);
        res.json({ ok: true });
    },
];

const createArtistPost = [
    artistValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(404).json({
                errors: errors.array(),
            });
        }

        const { artist: artistName } = matchedData(req);
        db.insertNewArtist(artistName);
        res.json({ ok: true });
    },
];

const createSongPost = [
    songValidator,
    genreValidator,
    artistValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(404).json({
                errors: errors.array(),
            });
        }

        const { song: songName, genre: genreName, artist: artistName } = matchedData(req);

        // console.log({ songName, genreName, artistName });
        db.insertNewSongAndItsRelationship(songName, artistName, genreName);
        res.json({ ok: true });
    },
];

module.exports = {
    songsPageGet,
    genresPageGet,
    artistsPageGet,
    createGenrePost,
    createArtistPost,
    createSongPost,
};
