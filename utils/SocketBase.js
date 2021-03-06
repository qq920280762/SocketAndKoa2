'use strict';


class SocketBase {

    constructor(io) {

        this.io = io;

        this.io.set('heartbeat interval', 5*1000);//心跳间隔

        this.io.set('heartbeat timeout',5*1000);//心跳超时

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

            //this.io.to(roomId).emit(event, data);
            this.io.sockets.in(roomId).emit(event, data);

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
        //判断是否正常连接 socket.connected==true
        let socketIds = [];
        if (room) {
            let sockets = (this.io.sockets.adapter.rooms[room] || {}).sockets;
            if (sockets) {
                for (let socketId in sockets) {
                    if (sockets.hasOwnProperty(socketId) && sockets[socketId]) {
                        socketIds.push(socketId);
                    }
                }

            }
        }
        else {
            let sockets = this.io.sockets.adapter.sids;
            if(sockets){
                for (let socketId in sockets) {
                    if (sockets.hasOwnProperty(socketId) && sockets[socketId][socketId]) {
                        socketIds.push(socketId);
                    }
                }
            }
        }
        return socketIds;

    };

    rooms(socketId) {
        let roomIds = [];
        if (socketId) {
            let rooms = this.io.sockets.adapter.sids[socketId];
            if (rooms) {
                for (let id in rooms) {
                    if (rooms.hasOwnProperty(id) && socketId != id) {
                        roomIds.push(id);
                    }
                }
            }

        }
        else {
            let rooms = this.io.sockets.adapter.rooms;
            if (rooms) {
                for (let id in rooms) {
                    if (rooms.hasOwnProperty(id) && undefined == (rooms[id].sockets[id])) {
                        roomIds.push(id);
                    }
                }
            }
        }
        return roomIds;
    };

    online(socketId, room) {

        return this.clients(room).indexOf(socketId) > -1;

    };

    disconnect(socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (socket) {

            socket.disconnect();

        }

    };

}
module.exports = SocketBase;