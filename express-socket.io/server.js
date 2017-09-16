/*******************************************************************************
 * Copyright (c) 2016 Nicola Del Gobbo 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY
 * IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing
 * permissions and limitations under the License.
 *
 * Contributors - initial API implementation:
 * Nicola Del Gobbo <nicoladelgobbo@gmail.com>
 ******************************************************************************/

'use strict'

/*!
 * Module dependencies
 */
const express = require('express')
const morgan = require('morgan')
const http = require('http')
const socketIO = require('socket.io')

module.exports = function createServer() {

  const app = express()

  const server = http.Server(app)
  const io = socketIO(server)

  const me = {
    firstName: 'Nicola',
    lastName: 'Del Gobbo'
  }

  server.listen(5000, function () {
    console.log("Server started on port 5000")
  })

  app.use(morgan('dev'))

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })

  app.get('/me', function (req, res) {
    res.status(200).json(me)
  })

  io.on('connection', function (socket) {
    const serverMessage = {message: "PING"}
    let count = 3;
    socket.emit("server-ping", serverMessage)
    socket.on("client-pong", (data) => {
      console.log(data.message)
      if (count > 0) {
        socket.emit("server-ping", serverMessage)
        count --
      }
    })
    socket.on("client-save", (data) => {    
      console.log("New data will be saved")
      console.log(data)
      me = {
        firstName: data.fisrtName,
        lastName: data.lastName
      }
      socket.broadcast.emit("server-save", me)
    })
  })
  
  return server

}