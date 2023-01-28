const express = require('express');
const postRoutes = require('./posts/posts-router');

const server = express();

server.use('/api/posts', postRoutes);

server.use('/', (req, res) => res.send('projectAPI up and running!'));

module.exports = server