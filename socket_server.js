'use strict';

const randomNames = require('./utils/randomNames');
const socketUtils = require('./utils/SocketBase');

class socket_server extends socketUtils {

    constructor(server) {

        super(require('socket.io')(server));
    }

    init() {

        this.connect((socket) => {

            socket.name = randomNames.getRandomName(2);

            console.log('soket connection [ ' + socket.id + ' ] ');

            this.on('roomJoin', socket.id, (data)=> {

                if (!this.hasSocket(data.roomId, socket.id)) {

                    this.join(data.roomId, socket.id);

                    this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => JOIN ROOM ' + data.roomId, data.roomId);
                }
                else {

                    this.emit('msgReceived', ' [ ' + socket.name + ' ] => Repeat to join the room ' + data.roomId, socket.id);

                }

            });

            this.on('roomLeave', socket.id, (data)=> {

                this.leave(data.roomId, socket.id);

                this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => LEAVE ROOM ' + data.roomId, data.roomId);

            });

            this.on('roomChat', socket.id, (data)=> {

                this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => ' + data.msg, data.roomId);

            });
            
            this.on('disconnect', socket.id, () => {

                console.log('client active disconnect  [  ' + socket.id + ' ]');

                this.disconnect(socket.id);

            });

        });
    }

}
module.exports = socket_server;