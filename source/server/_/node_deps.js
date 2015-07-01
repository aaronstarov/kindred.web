var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    compress = require('compression'),
    stream = require('stream'),
    fs = require('fs');
