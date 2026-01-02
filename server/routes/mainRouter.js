const express = require('express');
const mainController = require('../controller/mainController');

const mainRouter = express.Router();

mainRouter.get('/', mainController.homePageGet);

module.exports = mainRouter;
