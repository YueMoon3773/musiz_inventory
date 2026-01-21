const { body, query, validationResult, matchedData } = require('express-validator');

const db = require('../db/queries');

const normalizeArray = (value) => {
    if (typeof value === 'string') {
        return [value.trim()];
    }

    return value.map((item) => item.trim());
};

const songValidator = [
    body('song')
        .not()
        .isEmpty()
        .withMessage('Song name must be filled.')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Song name must be between 2 and 30 characters.'),
];

const genreValidator = [
    body('genre').custom((value) => {
        // in case genre is bland string from inp
        if (typeof value === 'string') {
            if (value.trim().length < 2 || value.trim().length > 30) {
                throw new Error('Genre name must be between 2 and 30 characters.');
            }
            return true;
        }
        // in case genre is an array of selection from create song value
        else if (Array.isArray(value)) {
            if (value.length <= 0) {
                throw new Error('Genres values list must not be empty.');
            }

            value.forEach((item) => {
                if (typeof item !== 'string') {
                    throw new Error('Invalid genre elements. Genre elements must be string');
                } else if (item.trim().length < 2 || item.trim().length > 30) {
                    throw new Error('Genre name must be between 2 and 30 characters.');
                }
            });
            return true;
        }

        throw new Error('Genre must be a string or array.');
    }),
];

const artistValidator = [
    body('artist').custom((value) => {
        // in case genre is bland string from inp
        if (typeof value === 'string') {
            if (value.trim().length < 2 || value.trim().length > 30) {
                throw new Error('Artist name must be between 2 and 30 characters.');
            }
            return true;
        }
        // in case genre is an array of selection from create song value
        else if (Array.isArray(value)) {
            if (value.length <= 0) {
                throw new Error('Artists values list must not be empty.');
            }

            value.forEach((item) => {
                if (typeof item !== 'string') {
                    throw new Error('Invalid artist elements. Artist elements must be a ');
                } else if (item.trim().length < 2 || item.trim().length > 30) {
                    throw new Error('Artist name must be between 2 and 30 characters.');
                }
            });
            return true;
        }

        throw new Error('Artist must be a string or array.');
    }),
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
        const { genre: genreValue } = matchedData(req);
        console.log({ genreValue });
        db.insertNewGenre(genreValue);
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

        const { artist: artistValue } = matchedData(req);
        db.insertNewArtist(artistValue);
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
            console.log(errors.array());

            return res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }

        const { song: songName, genre, artist } = matchedData(req);
        const genreValue = normalizeArray(genre);
        const artistValue = normalizeArray(artist);

        console.log({ songName, genreValue, artistValue });

        db.insertNewSong(songName, artistValue, genreValue);
        res.json({ ok: true });
        // res.json({ ok: true, songName, genreValue, artistValue });
    },
];

const oneSongDetailsGet = async (req, res) => {
    console.log(req.params.id);
    const beData = await db.getOneSongAndInfoBySongId(req.params.id);
    res.json({ beData });
};

module.exports = {
    songsPageGet,
    genresPageGet,
    artistsPageGet,
    createGenrePost,
    createArtistPost,
    createSongPost,
    oneSongDetailsGet,
};
