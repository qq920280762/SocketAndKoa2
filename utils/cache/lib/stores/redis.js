/**
 * Created by matri on 2016-12-16.
 */

'use strict';

/**
 * Imports
 */
const util  = require('util');
const redis = require('redis');
const base  = require('./store');

function RedisStore(opts) {
    base.Store.call(this);
    let db       = opts.db || 0;
    let dbClient = redis.createClient(opts.port, opts.host, opts.opts);
    dbClient.select(db, (error, data) => {
        if (!!error) {
            console.error(error);
        }
    });

    this.db       = db;
    this.dbClient = dbClient;
}

util.inherits(RedisStore, base.Store);

/**
 * clear all data
 */
RedisStore.prototype.clear = function () {
    this.dbUtils.keys('*', (err, keys) => {
        if (!!err) {
            console.error(err);
        }
        else {
            this.dbUtils.del(keys, (err, result) => {
                if (!!err) {
                    console.error(err);
                }
            });
        }
    });
};

/**
 * remove data by key
 */
RedisStore.prototype.remove = function (key, field) {
    let args = [];
    return new Promise((resolve, reject) => {
        let func = (err, res) => {
            if (!!err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(res);
            }
        };

        if (!field) {
            args.push(key);
            args.push(func);
            this.dbClient.del.apply(this.dbClient, args);
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            args.push(func);
            this.dbClient.hdel.apply(this.dbClient, args);
        }
    });
};

/**
 * remove data by regex key
 */
RedisStore.prototype.removeByRegex = function (regex) {
    this.dbClient.hkeys(regex, (err, keys) => {
        if (!!err) {
            console.error(err);
        }
        else if (keys.length > 0) {
            this.dbClient.del(keys, (err, result) => {
                if (!!err) {
                    console.error(err);
                }
            });
        }
    });
};

/**
 * 设置缓存数据
 * @param key
 * @param field
 * @param data
 * @param ttl
 */
RedisStore.prototype.set = function (key, field, data, ttl) {
    if (ttl === null || ttl === undefined) {
        ttl   = data;
        data  = field;
        field = null;
    }
    let strData = JSON.stringify(data) || '';
    return new Promise((resolve, reject) => {
        if (!!field) {
            this.dbClient.hset(key, field, strData, (err, res) => {
                if (!!err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        }
        else {
            this.dbClient.set(key, strData, (err, res) => {
                if (!!err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        }
        this.dbClient.expire(key, ttl);
    });
};

/**
 * 获取缓存数据
 * @param key
 * @param field
 * @returns {*}
 */
RedisStore.prototype.get = function (key, field) {
    return new Promise((resolve, reject) => {
        if (!!field) {
            this.dbClient.hget(key, field, (err, res) => {
                if (!!err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    let data = JSON.parse(res);
                    resolve(data || null);
                }
            });
        }
        else {
            this.dbClient.get(key, (err, res) => {
                if (!!err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    let data = JSON.parse(res);
                    resolve(data || null);
                }
            });
        }
    });
};

/**
 * 获取缓存数据
 * @param key
 * @returns {*}
 */
RedisStore.prototype.getAll = function (key) {
    return new Promise((resolve, reject) => {
        this.dbClient.hgetall(key, (err, res) => {
            if (!!err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(res || null);
            }
        });
    });
};

module.exports = RedisStore;