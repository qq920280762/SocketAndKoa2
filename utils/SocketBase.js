'use strict';


class SocketBase {

    constructor(io) {

        this.io = io;

    };


    connect(fn) {

        this.io.on('connection', fn);

    };

    on(event, socketId, fn) {

        let socket = this.io.sockets.sockets[socketId];

        if (event && socket) {

            socket.on(event, fn);

        }

    };

    join(roomId, socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (roomId && socket) {

            socket.join(roomId);

        }

    };

    leave(roomId, socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (roomId && socket) {

            socket.leave(roomId);

        }

    };

    broadcast(event, data, roomId) {

        if (roomId) {

            this.io.to(roomId).emit(event, data);

        }
        else {

            this.io.sockets.emit(event, data);

        }

    };

    emit(event, data, socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (socket) {

            socket.emit(event, data);

        }

    };

    clients(room) {
        return new Promise((resolve,reject)=>{
            try{
                let socketIds = [];
                if (room) {
                    let sockets = (this.io.sockets.adapter.rooms[room] || {}).sockets;
                    if (sockets) {
                        for (let socketId in sockets) {
                            if (sockets.hasOwnProperty(socketId)) {
                                socketIds.push(socketId);
                            }
                        }

                    }
                    resolve(socketIds);
                }
                else {
                    this.io.sockets.adapter.clients( (err, data)=> {
                        if (!err) {
                            socketIds = data;

                        }
                        resolve(socketIds);
                    });
                }
            }catch(err){
                reject(err);
            }
        });

    };

    rooms(socketId) {
        return new Promise((resolve,reject)=>{
            try{
                if(socketId){
                    this.io.sockets.adapter.clientRooms(socketId,  (err, data)=> {
                        if (!err) {
                            let i = data.indexOf(socketId);
                            if(i>-1){
                                data.splice(i,1);
                            }
                            resolve(data);
                        }else{
                            resolve([]);
                        }
                    });
                }else{
                    let rooms = this.io.sockets.adapter.rooms;
                    let results = [];
                    for(let id in rooms){
                        if(rooms.hasOwnProperty(id) && rooms[id]['sockets'] && !(rooms[id]['sockets'][id]) ){
                            results.push(id);
                        }
                    }
                    resolve(results);
                }
            }catch(err){
                reject(err);
            };
        })
    };

    online(socketId, room) {
        return new Promise((resolve,reject)=>{
           try{
               this.clients(room)
               .then((results)=>{
                   resolve(results.indexOf(socketId)>-1);
               })
           }catch(err){
               reject(err);
           }
        });



    };

    disconnect(socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (socket) {

            socket.disconnect();

        }

    };

}
module.exports = SocketBase;