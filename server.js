const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const Config = require('./config');
const moment = require('moment');
const Routes = require('./network/routes');
const e = require('./helpers/errors');

mongoose.Promise = Promise;
mongoose.connect(Config.mongodb_uri, { useMongoClient: true });
mongoose.connection.on('error', (error) => { throw error; });

const server = express();

server.use(helmet());
server.use(cors());

server.use(morgan('[:date[iso]] :method :url :remote-user :status :response-time ms :user-agent'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

moment.locale(Config.moment_locale);

server.use((req, res, next) => {
    e.setLang(req.headers['accept-language']);
    next();
});

Routes(server);

server.listen(Config.server_port);