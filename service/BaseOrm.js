const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');

const mongoLink = 'mongodb://'+
    config.mongodb.user+':'+
    config.mongodb.password+'@'+
    config.mongodb.host+':'+
    config.mongodb.port+'/'+
    config.mongodb.database;

class BaseOrm {

    constructor(collectionName) {

        this.collectionName = collectionName;

    };

    insert(obj) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);
                var collection = db.collection($this.collectionName);

                collection.insert(obj, {w: 1}, function(err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res[0]);
                });
            });
        });
    };
    update(obj) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);
                var collection = db.collection($this.collectionName);
                collection.update({_id: new ObjectID(obj._id)}, obj, {upsert: true,w: 1}, function(err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        });
    };

    findOne (query, option) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);

                var collection = db.collection($this.collectionName);

                if(option==undefined || option==null)
                {
                    collection.findOne(query, function(err, res) {
                        db.close();
                        if (err) reject(err);
                        else resolve(res);
                    });
                }else{
                    collection.findOne(query, option, function(err, res) {
                        db.close();
                        if (err) reject(err);
                        else resolve(res);
                    });
                }
            });
        });
    };

    find(query, option) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);

                var collection = db.collection($this.collectionName);
                if(option==undefined || option==null)
                {
                    collection.find(query).toArray(function(err, res) {
                        db.close();
                        if (err) reject(err);
                        else resolve(res);
                    });
                }else{
                    collection.find(query, option).toArray(function(err, res) {
                        db.close();
                        if (err) reject(err);
                        else resolve(res);
                    });
                }
            });
        });
    };

    remove(query) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);
                var collection = db.collection($this.collectionName);

                collection.remove(query, {w: 1}, function(err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        });
    };

    count(query, option) {
        let $this = this;
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongoLink, function(err, db) {
                if (err) reject(err);
                var collection = db.collection($this.collectionName);
                if(query==undefined || query==null)
                    query = {};
                if(option==undefined || option==null)
                {
                    collection.count(query, function(err, count) {
                        db.close();
                        if (err) reject(err);
                        else resolve(count);
                    });
                }else{
                    collection.count(query, option, function(err, count) {
                        db.close();
                        if (err) reject(err);
                        else resolve(count);
                    });
                }
            });
        });
    };

}



module.exports = BaseOrm;