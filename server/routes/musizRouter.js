const express = require('express');
const musizController = require('../controller/musizController');

const musizRouter = express.Router();

musizRouter.get('/songs', musizController.songsPageGet);
musizRouter.get('/genres', musizController.genresPageGet);
musizRouter.get('/artists', musizController.artistsPageGet);

module.exports = musizRouter;
