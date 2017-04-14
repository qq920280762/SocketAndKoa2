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

    getSockets(room) {

        return room ? this.io.sockets.adapter.rooms[room] : this.io.sockets.adapter.rooms;

    };

    hasSocket(room, socketId) {

        let rooms = (this.getSockets(room) || {}).sockets || {};

        let flag  = false;

        for (let key in rooms) {

            if (socketId == key && !!rooms[key]) {

                flag = true;

                break;

            }

        }

        return flag;

    };

    disconnect(socketId) {

        let socket = this.io.sockets.sockets[socketId];

        if (socket) {

            socket.disconnect();

        }

    };

}
module.exports = SocketBase;