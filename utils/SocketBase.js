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
            let sids = this.io.sockets.adapter.sids;
            for (let id in sids) {
                if (sids.hasOwnProperty(id) && sids[id][id]) {
                    socketIds.push(id);
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