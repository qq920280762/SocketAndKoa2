/**
 * Created by matri on 2016-12-16.
 */
'use strict';

const autoCache = require('./lib');

module.exports            = autoCache;
module.exports.RedisStore = require('./lib/stores/redis');