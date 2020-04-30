'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./dist/main');
const server = awsServerlessExpress.createServer(app.default);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

console.log(exports.handler);
