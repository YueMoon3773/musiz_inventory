const { body, query, validationResult, matchedData } = require('express-validator');

const db = require('../db/queries');

const normalizeArray = (value) => {
    if (typeof value === 'string') {
        return [value.trim()];
    }
    if (typeof value[0] === 'string') {
        return value.map((item) => item.trim());
    }
    if (typeof value[0] === 'object') {
        return value.map((item) => {
            return { ...item, value: item.value.trim() };
        });
    }
};

const getDeletedArtistOrGenreItems = (originArr, newArr, arrType) => {
    const seen = new Set();
    newArr.forEach((item) => {
        if (typeof item[`${arrType}_id`] === 'number' && !seen.has(item[`${arrType}_id`])) {
            seen.add(item[`${arrType}_id`]);
        }
    });

    const deletedItems = originArr.filter((item) => !seen.has(item));
    return deletedItems;
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

const songIdValidator = [
    body('songId')
        .not()
        .isEmpty()
        .withMessage('Song id must be provided.')
        .isNumeric()
        .withMessage('Song id must be a number'),
];

const genreIdValidator = [
    body('genreId')
        .not()
        .isEmpty()
        .withMessage('Genre id must be provided.')
        .isNumeric()
        .withMessage('Genre id must be a number'),
];

const artistIdValidator = [
    body('artistId')
        .not()
        .isEmpty()
        .withMessage('Artist id must be provided.')
        .isNumeric()
        .withMessage('Artist id must be a number'),
];

const originalArtistIdsValidator = [
    body('originalArtistIds').isArray({ min: 1 }).withMessage('Original artist ids must be an array'),
    body('originalArtistIds.*').isNumeric().withMessage('Original artist id element must be a number'),
];

const originalGenreIdsValidator = [
    body('originalGenreIds').isArray({ min: 1 }).withMessage('Original genre ids must be an array'),
    body('originalGenreIds.*').isNumeric().withMessage('Original genre id element must be a number'),
];

const genreValidator = [
    body('genres').custom((value) => {
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
                if (typeof item === 'string') {
                    if (item.trim().length < 2 || item.trim().length > 30) {
                        throw new Error('Genre name must be between 2 and 30 characters.');
                    }
                } else if (typeof item === 'object' && item !== null && typeof item.value === 'string') {
                    if (item.value.trim().length < 2 || item.value.trim().length > 30) {
                        throw new Error('Genre name must be between 2 and 30 characters.');
                    }
                } else throw new Error('Invalid genre elements. Genre elements must be string or object');
            });
            return true;
        }

        throw new Error('Genre must be a string or array.');
    }),
];

const artistValidator = [
    body('artists').custom((value) => {
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
                if (typeof item === 'string') {
                    if (item.trim().length < 2 || item.trim().length > 30) {
                        throw new Error('Artist name must be between 2 and 30 characters.');
                    }
                } else if (typeof item === 'object' && item !== null && typeof item.value === 'string') {
                    if (item.value.trim().length < 2 || item.value.trim().length > 30) {
                        throw new Error('Artist name must be between 2 and 30 characters.');
                    }
                } else throw new Error('Invalid artist elements. Artist elements must be string or object');
            });
            return true;
        }

        throw new Error('Artist must be a string or array.');
    }),
];

const queryOrderTypes = {
    null: 'default',
    undefined: 'default',
    song: 's.song',
    artist: 'a.artists',
    genre: 'g.genres',
};

const queryOrderDirections = {
    null: 'default',
    undefined: 'default',
    asc: 'ASC',
    desc: 'DESC',
};

const songsPageGet = async (req, res) => {
    const { orderType, orderDirection } = req.query;
    const queryOrderType = queryOrderTypes[orderType];
    const queryOrderDirection = queryOrderDirections[orderDirection];
    // console.log({ orderType, orderDirection });
    // console.log({ queryOrderType, queryOrderDirection });

    try {
        const beData = await db.getAllSongsAndInfo(queryOrderType, queryOrderDirection);
        // console.log({ beData });
        res.json({ beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const genresPageGet = async (req, res) => {
    const { orderDirection } = req.query;
    const queryOrderDirection = queryOrderDirections[orderDirection];
    // console.log({ orderDirection });
    // console.log({ queryOrderDirection });

    try {
        const beData = await db.getAllGenres(queryOrderDirection);
        // console.log(beData);
        res.json({ beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const artistsPageGet = async (req, res) => {
    const { orderDirection } = req.query;
    const queryOrderDirection = queryOrderDirections[orderDirection];
    // console.log({ orderDirection });
    // console.log({ queryOrderDirection });

    try {
        const beData = await db.getAllArtists(queryOrderDirection);
        // console.log(beData);
        res.json({ beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const createGenrePost = [
    genreValidator,
    async (req, res) => {
        // console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }
        const { genres: genreValue } = matchedData(req);
        console.log({ genreValue });
        try {
            await db.insertNewGenre(genreValue);
            res.json({ ok: true });
        } catch (err) {
            res.json({ ok: false });
        }
    },
];

const createArtistPost = [
    artistValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }

        const { artists: artistValue } = matchedData(req);

        try {
            await db.insertNewArtist(artistValue);
            res.json({ ok: true });
        } catch (err) {
            res.json({ ok: false, errors: err });
        }
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
                ok: false,
                errors: errors.array(),
            });
        }

        const { song: songName, genres, artists } = matchedData(req);
        const genreValue = normalizeArray(genres);
        const artistValue = normalizeArray(artists);

        console.log({ songName, genreValue, artistValue });
        try {
            await db.insertNewSong(songName, artistValue, genreValue);
            res.json({ ok: true });
        } catch (err) {
            res.status(500).json({
                ok: false,
                errors: err,
            });
        }
    },
];

const oneSongDetailsGet = async (req, res) => {
    try {
        const beData = await db.getOneSongAndInfoBySongId(req.params.id);
        res.json({ beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const genreDelete = async (req, res) => {
    try {
        await db.deleteGenreOrArtistById('genre', Number(req.params.id));
        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const artistDelete = async (req, res) => {
    try {
        await db.deleteGenreOrArtistById('artist', Number(req.params.id));
        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const songDelete = async (req, res) => {
    try {
        await db.deleteSongById(Number(req.params.id));
        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const editSongPatch = [
    songValidator,
    songIdValidator,
    genreValidator,
    artistValidator,
    originalGenreIdsValidator,
    originalArtistIdsValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }

        const { songId, song: songName, genres, artists, originalGenreIds, originalArtistIds } = matchedData(req);
        const genreValue = normalizeArray(genres);
        const artistValue = normalizeArray(artists);
        const deletedGenreIds = getDeletedArtistOrGenreItems(originalGenreIds, genreValue, 'genre');
        const deletedArtistIds = getDeletedArtistOrGenreItems(originalArtistIds, artistValue, 'artist');

        // console.log({ songId, songName, genreValue, artistValue, originalGenreIds, originalArtistIds });
        // console.log({ deletedGenreIds, deletedArtistIds });

        try {
            db.updateSongAndAllRelationships(
                songId,
                songName,
                artistValue,
                deletedArtistIds,
                genreValue,
                deletedGenreIds,
            );

            res.json({ ok: true });
        } catch (err) {
            res.status(500).json({
                ok: false,
                errors: err,
            });
        }
    },
];

const oneGenreDetailsGet = async (req, res) => {
    try {
        const beData = await db.getOneGenreOrArtistDetailsById('genre', req.params.id);
        res.json({ ok: true, beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const editGenrePatch = [
    genreIdValidator,
    genreValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }

        const { genreId, genres } = matchedData(req);
        // console.log({ genreId, genres });

        try {
            db.updateGenreOrArtistById('genre', genreId, genres);
            res.json({ ok: true });
        } catch (err) {
            res.json({ ok: false, errors: err });
        }
    },
];

const oneArtistDetailsGet = async (req, res) => {
    try {
        const beData = await db.getOneGenreOrArtistDetailsById('artist', req.params.id);
        console.log({ beData });

        res.json({ ok: true, beData });
    } catch (err) {
        res.json({ ok: false, errors: err });
    }
};

const editArtistPatch = [
    artistIdValidator,
    artistValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(404).json({
                ok: false,
                errors: errors.array(),
            });
        }

        const { artistId, artists } = matchedData(req);
        // console.log({ artistId, artists });

        try {
            db.updateGenreOrArtistById('artist', artistId, artists);
            res.json({ ok: true });
        } catch (err) {
            res.json({ ok: false, errors: err });
        }
    },
];

module.exports = {
    songsPageGet,
    genresPageGet,
    artistsPageGet,
    createGenrePost,
    createArtistPost,
    createSongPost,
    oneSongDetailsGet,
    genreDelete,
    artistDelete,
    songDelete,
    editSongPatch,
    oneGenreDetailsGet,
    editGenrePatch,
    oneArtistDetailsGet,
    editArtistPatch,
};
