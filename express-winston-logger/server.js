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
const responseTime = require('response-time')
const responsePoweredBy = require('response-powered-by')
const http = require('http')
const bodyParser = require('body-parser')
const Logger = require('./logger')

module.exports = function createServer() {

  // Create your own logger
  let myLogger = new Logger()

  const app = express()
  
  // Sometimes one interesting strategy is to attach your logger to express app
  // so in your middleware or route controller you can access to it by req.app
  app.logger = myLogger

  // Set express server port
  app.set('port', process.env.PORT || 5000)
  
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(responsePoweredBy("@NickNaso"))
  app.use(responseTime())

  app.use(function myCustomLogger (req, res, next) {
    req.app.logger.info(`${req.ip} - /${req.method} ${req.protocol}://${req.hostname}:${req.app.get('port')}${req.path}`)
    // ... you can define your format to log the http request
    next()
  })

  /**
   * Routes for the application
   */
  app.use('/', require('./routes/mySubApp'))

  app.use(function errorhandler (err, req, res, next) {
    // Your error handler logic
    // ... here you log the error happened in request
    req.app.logger.error(`${req.ip} - /${req.method} ${req.protocol}://${req.hostname}:${req.app.get('port')}${req.path}`)
    // ... you can define your format to log the http request
    res.sendStatus(500)
  })

  // Create http server and attach express app on it
  return http.createServer(app).listen(app.get('port'), '0.0.0.0', () => {
    console.log("Server started at http://localhost:" + app.get('port') + "/")
  })

}