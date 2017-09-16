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
const errorhandler = require('errorhandler')
const morgan = require('morgan')
const cors = require('cors')

module.exports = function createServer() {

  const app = express()
  
  // Set express server port
  app.set('port', process.env.PORT || 5000)

  app.use(morgan('dev'))
  app.use(cors())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(responsePoweredBy("@NickNaso"))
  app.use(responseTime())

  // https://www.npmjs.com/package/cors#enabling-cors-pre-flight
  app.options('*', cors())

  /**
   * Routes for the application
   */
  app
    .get('/resources', (req, res) => {
      res.status(200).json([
        {
          id: 1,
          first_name: "Nicola",
          last_name: "Del Gobbo"
        },
        {
          id: 2,
          first_name: "Dennis",
          last_name: "Ritchie"
        }
      ])
    })
    .post('/resources', (req, res) => {
      res.status(201).json({
        id: 4,
        first_name: "Ryan",
        last_name: "Dahl"
      })
    })
    .put('/resources/:id', (req, res) => {
      res.status(200).json({
        id: 1,
        first_name: "Nick",
        last_name: "Naso"
      })
    })
    .delete('/resources/:id', (req, res) => {
      res.status(200).json({
        id: 1,
        first_name: "Nick",
        last_name: "Naso"
      })
    })
  
  app.use(errorhandler())

  // Create http server and attach express app on it
  return http.createServer(app).listen(app.get('port'), '0.0.0.0', () => {
    console.log("Server started at http://localhost:" + app.get('port') + "/")
  })

}