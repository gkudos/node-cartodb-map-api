'use strict';

var request = require('request');
var _ = require('lodash');

let defaultOptions = function(options) {
  if(!options) {
    options = {
      timeout: 30000
    };
  } else {
    options = _.assign({
      timeout: 3000
    }, options);
  }

  return options;
};

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

  existsNamedMap(name, options) {
    var $this = this;
    options = defaultOptions(options);
    var promise = new Promise(function(resolve, reject) {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
        },
        json: {}
      }), function(error, response, body) {
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

  getGroupID(name, options) {
    var $this = this;
    options = defaultOptions(options);

    var promise = new Promise(function(resolve, reject) {
      request(_.assign(options, {
        method: 'POST',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
        },
        json: {}
      }), function(error, response, body) {
        if(error) {
          reject(error);
        }
        resolve(body);
      });
    });
    return promise;
  }

  get(suffixUrl, params, options) {
    var $this = this;
    if(!params) {
      params = {};
    }
    options = defaultOptions(options);
    // jshint camelcase: false
    params.api_key = this.apiKey;
    var promise = new Promise(function(resolve, reject) {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + suffixUrl,
        qs: params,
        json: {}
      }), function(error, response, body) {
        if(error) {
          reject(error);
        }
        resolve(body);
      });
    });
    return promise;
  }

  post(suffixUrl, params, body, options) {
    var $this = this;
    if(!params) {
      params = {};
    }
    if(!body) {
      body = {};
    }
    options = defaultOptions(options);
    // jshint camelcase: false
    params.api_key = this.apiKey;
    var promise = new Promise(function(resolve, reject) {
      request(_.assign(options, {
        method: 'POST',
        uri: $this.baseURL + suffixUrl,
        qs: params,
        json: body
      }), function(error, response, body) {
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
