'use strict';

var request = require('request');

class CartoDBMapClient {
  constructor(user, apiKey) {
    this.user = user;
  	this.apiKey = apiKey;
    this.baseURL = 'https://' + this.user + '.cartodb.com/';
  }

  createNamedMap(options) {
    this.existsNamedMap(options.name).then(function() {

    });
  }

  existsNamedMap(name) {
    var promise = new Promise(function(reject, resolve) {
      request({
        method: 'GET',
        uri: this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': this.apiKey,
        },
        json: {}
      }, function(error, response, body) {
        if(error) {
          reject(error);
        }
        resolve({
          notExists: response.status === 404,
          exists: response.status === 200,
          data: body
        });
      });
    });
    return promise;
  }

  getGroupID(name) {
    var promise = new Promise(function(reject, resolve) {
      request({
        method: 'POST',
        uri: this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': this.apiKey,
        },
        json: {}
      }, function(error, response, body) {
        if(error) {
          reject(error);
        }
        resolve(body);
      });
    });
    return promise;
  }
}

module.exports = CartoDBMapClient;
