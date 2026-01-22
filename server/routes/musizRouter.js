const express = require('express');
const musizController = require('../controller/musizController');

const musizRouter = express.Router();

musizRouter.get('/songs', musizController.songsPageGet);
musizRouter.get('/genres', musizController.genresPageGet);
musizRouter.get('/artists', musizController.artistsPageGet);

musizRouter.post('/create-genre', musizController.createGenrePost);
musizRouter.post('/create-artist', musizController.createArtistPost);
musizRouter.post('/create-song', musizController.createSongPost);

musizRouter.get('/song-details/:id', musizController.oneSongDetailsGet);
musizRouter.delete('/delete-genre/:id', musizController.genreDelete);
musizRouter.delete('/delete-artist/:id', musizController.artistDelete);

module.exports = musizRouter;
