'use strict';

const randomNames = require('./utils/randomNames');
const SocketBase = require('./utils/SocketBase');

class SocketServer extends SocketBase {

    constructor(server) {
        super(require('socket.io')(server));
    }

    init() {

        this.io.set('heartbeat interval', 5*1000);//心跳间隔
        this.io.set('heartbeat timeout', 5*1000);//心跳超时

        this.io.use((socket,next)=>{
            //可以检查请求是否合法
            console.log('headers =>' + JSON.stringify(socket.request.headers));
            if (socket.request.headers.cookie) return next();
            next(new Error('Authentication error'));
        });

        this.connect((socket) => {

            socket.use((packet, next)=>{
                console.log('packet =>'+JSON.stringify(packet));
                if (packet[1].roomId) return next();
                next(new Error('param error'));
            });

            socket.name = randomNames.getRandomName(2);

            console.log('soket connection [ ' + socket.id + ' ] ');

            this.on('message', socket.id, (data)=> {
                console.log('message..'+data);
            });
            this.on('anything', socket.id, (data)=> {
                console.log('anything..'+data);
            });

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
            
            this.on('disconnect', socket.id, (obj) => {

                console.log('client active disconnect  [  ' + socket.id + ' ]' +obj);

                this.disconnect(socket.id);

            });

        });
    }

}
module.exports = SocketServer;