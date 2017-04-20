'use strict';

const randomNames = require('./utils/randomNames');
const SocketBase = require('./utils/SocketBase');

class SocketServer extends SocketBase {

    constructor(server) {
        super(require('socket.io')(server));
    }

    init() {

        this.io.set('heartbeat interval', 5*1000);//心跳间隔
        this.io.set('heartbeat timeout',5*1000);//心跳超时

        this.io.use((socket,next)=>{
            //可以检查请求是否合法
            console.log('headers =>' + JSON.stringify(socket.request.headers));
            if (socket.request.headers.cookie) return next();
            next(new Error('Authentication error'));
        });

        this.connect((socket) => {

            socket.use((packet, next)=>{
                try {

                    this.io.sockets.adapter.clientRooms(socket.id,function(err,data){

                        console.log('socket online =>'+JSON.stringify(data));
                    });
                    this.io.sockets.adapter.clients(function(err,data){
                        console.log('online socket array =>'+JSON.stringify(data));
                    });

                    console.log('rooms=>'+JSON.stringify(this.io.sockets.adapter.rooms));
                    console.log('sids=>'+JSON.stringify(this.io.sockets.adapter.sids));
                    console.log('packet =>'+JSON.stringify(packet));
                    if (packet[1].roomId) return next();
                    next(new Error('param error'));
                }catch (e){
                    next(e);
                }
            });

            socket.name = randomNames.getRandomName();

            console.log('soket connection [ ' + socket.id + ' ] ');

            this.on('message', socket.id, (data)=> {
                console.log('message..'+data.msg);
                socket.send(data.msg);
            });

            this.on('roomJoin', socket.id, (data)=> {

                this.online(socket.id,data.roomId)
                    .then((results)=>{
                        if (!results) {

                            this.join(data.roomId, socket.id);

                            this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => JOIN ROOM ' + data.roomId, data.roomId);
                        }
                        else {

                            this.emit('msgReceived', ' [ ' + socket.name + ' ] => Repeat to join the room ' + data.roomId, socket.id);

                        }
                    });

            });

            this.on('roomAll',socket.id,()=>{
                this.rooms(socket.id)
                    .then((result)=>{
                        this.emit('msgReceived', ' [ ' + socket.name + ' ] '+result.join(','),socket.id);
                    });
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