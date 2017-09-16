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
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')
const moment = require('moment')
const fs = require('fs-extra')

let logger = null

module.exports = Logger;

function Logger() {
  if (logger instanceof Logger) {
    return logger
  }
  function timeing() {
    return '### ' + moment().format('DD-MM-YYYY - HH:mm:ss') + ' ###'
  }
  const transports = []
  // ... do some stuff based on your configuration for example choice which the
  // winston tranport to use.
  const optsConsoleTransport = {
    colorize: true,
    timestamp: timeing
  }
  // Ensure that directory for logs exist otherwise create it
  fs.ensureDirSync('./logs')
  const consoleTransport = new (winston.transports.Console)(optsConsoleTransport)
  transports.push(consoleTransport)
  const optsFileTransportForError = {
    name: 'error-file-stransport',
    filename: path.join('./logs', 'express-winston' + '-ERROR'),
    level: 'error',
    json: false,
    timestamp: timeing,
    datePattern: '-dd-MM-yyyy.log'
  }
  const fileTransportForError = new (winston.transports.DailyRotateFile)(optsFileTransportForError)
  transports.push(fileTransportForError)
  const optsFileTransportForWarning = {
    name: 'warning-file-transport',
    filename: path.join('./logs', 'express-winston' + '-WARNING'),
    level: 'warn',
    json: false,
    timestamp: timeing,
    datePattern: '-dd-MM-yyyy.log'
  }
  const fileTransportForWarning = new (winston.transports.DailyRotateFile)(optsFileTransportForWarning)
  transports.push(fileTransportForWarning)
  const optsFileTransportForInfo = {
    name: 'info-file-transport',
    filename: path.join('./logs', 'express-winston' + '-INFO'),
    level: 'info',
    json: false,
    timestamp: timeing,
    datePattern: '-dd-MM-yyyy.log'
  }
  const fileTransportForInfo = new (winston.transports.DailyRotateFile)(optsFileTransportForInfo)
  transports.push(fileTransportForInfo)
  return new (winston.Logger)({transports: transports})
}