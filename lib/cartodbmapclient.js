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
    var $this = this;
    var promise = new Promise(function(resolve, reject) {
      request({
        method: 'GET',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
        },
        json: {}
      }, function(error, response, body) {
        if(error) {
          reject(error);
        }
        resolve({
          exists: response.statusCode !== 404,
          data: body
        });
      });
    });
    return promise;
  }

  getGroupID(name) {
    var $this = this;
    var promise = new Promise(function(resolve, reject) {
      request({
        method: 'POST',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
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
