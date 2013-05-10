/*
 * Module dependencies
 */
var express = require('express')
var app = express()
app.set('views', __dirname + '/views')
app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'))
app.listen(8080)


//for src dest----- combination
//fetch inventory details from rb
//fetch inventory details from ss
