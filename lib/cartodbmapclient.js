'use strict';

var request = require('request');
var _ = require('lodash');

const defaultOptions = (options) => {
  const defaults = {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if(!options) {
    options = defaults;
  } else {
    options = _.assign(defaults, options);
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
    this.existsNamedMap(options.name).then(() => {

    });
  }

  existsNamedMap(name, options) {
    var $this = this;
    options = defaultOptions(options);
    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
        },
        json: {}
      }), (error, response, body) => {
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

  searchDatasets(text, page, size, options) {
    var $this = this;
    page = page || 1;
    size = size || 20;
    options = defaultOptions(options);
    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + 'api/v1/viz/',
        qs: {
          'api_key': $this.apiKey,
          deepInsights: false,
          'exclude_shared': false,
          types: 'table,remote',
          shared: 'yes',
          q: text,
          page,
          'per_page': size
        },
        json: {}
      }), (error, response, body) => {
        if(error) {
          reject(error);
        }
        resolve(body);
      });
    });
    return promise;
  }

  searchMaps(text, page, size, options) {
    var $this = this;
    page = page || 1;
    size = size || 20;
    options = defaultOptions(options);
    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + 'api/v1/viz/',
        qs: {
          'api_key': $this.apiKey,
          deepInsights: false,
          'exclude_shared': false,
          types: 'derived',
          shared: 'yes',
          q: text,
          page,
          'per_page': size
        },
        json: {}
      }), (error, response, body) => {
        if(error) {
          reject(error);
        }
        resolve(body);
      });
    });
    return promise;
  }

  getGroupID(name, options) {
    var $this = this;
    options = defaultOptions(options);

    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'POST',
        uri: $this.baseURL + 'tiles/template/' + name,
        qs: {
          'api_key': $this.apiKey,
        },
        json: {}
      }), (error, response, body) => {
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
    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'GET',
        uri: $this.baseURL + suffixUrl,
        qs: params,
        json: {}
      }), (error, response, body) => {
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
    const promise = new Promise((resolve, reject) => {
      request(_.assign(options, {
        method: 'POST',
        uri: $this.baseURL + suffixUrl,
        qs: params,
        json: body
      }), (error, response, body) => {
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
