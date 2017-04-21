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

            //console.log('headers =>' + JSON.stringify(socket.request.headers));

            if (socket.request.headers.cookie)return next();

            next(new Error('Authentication error'));

        });

        this.connect((socket) => {

            socket.use((packet, next)=>{
                try {

                    //console.log('packet =>'+JSON.stringify(packet));

                    //console.log('rooms =>'+JSON.stringify(this.io.sockets.adapter.rooms));

                    //console.log('sids =>'+JSON.stringify(this.io.sockets.adapter.sids));

                    if (packet[0]=='login' || packet[1].roomId) return next();

                    next(new Error('param error'));

                }catch (e){
                    next(e);
                }
            });

//            socket.name = randomNames.getRandomName();

            //console.log('soket connection ['+socket.id+'] [ ' +socket.name + ' ]');

            this.on('message', socket.id, (data)=> {

                console.log('message..'+data.msg);

                socket.send(data.msg);
            });

            this.on('roomJoin', socket.id, (data)=> {

                if (!this.online(socket.id,data.roomId)) {

                    this.join(data.roomId, socket.id);

                    socket.halls = this.rooms(socket.id);

                    this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => join room [' + data.roomId+']', data.roomId);
                }
                else {

                    this.emit('msgReceived', ' [ ' + socket.name + ' ] => repeat to join the room [' + data.roomId+']', socket.id);

                }

            });

            this.on('roomAll',socket.id,()=>{

                let own = this.rooms(socket.id);

                let all = this.rooms();

                this.emit('msgReceived', ' [ ' + socket.name + ' ] 自己的房间: '+(own.length>0?own.join(','):'--')+';  所有的房间: '+(all.length>0?all.join(','):'--'),socket.id);
            });

            this.on('roomLeave', socket.id, (data)=> {

                if (this.online(socket.id,data.roomId)) {

                    this.leave(data.roomId, socket.id);

                    this.emit('msgReceived',  ' [ ' + socket.name + ' ] => leave room ['  + data.roomId+']', socket.id);

                    this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => leave room [' + data.roomId+']', data.roomId);
                }else{

                    this.emit('msgReceived', ' [ ' + socket.name + ' ] => you have not joined the room [' + data.roomId+']', socket.id);
                }


            });

            this.on('roomChat', socket.id, (data)=> {

                this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => ' + data.msg, data.roomId);

            });

            this.on('login', socket.id, (data)=> {
                socket.name = data.userName;
                socket.userId = data._id;
                this.emit('msgReceived', socket.name+',login success ! ', socket.id);

            });
            
            this.on('disconnect', socket.id, (obj) => {
                let $this = this;
                if(socket.halls){
                    socket.halls.forEach((roomId)=>{
                        $this.broadcast('msgReceived', ' [ ' + socket.name + ' ] => leave room [' + roomId+']', roomId);
                    });
                }

                console.log('client active disconnect  [  ' + socket.id + ' ]' +obj);

                this.disconnect(socket.id);

            });

        });
    }

}
module.exports = SocketServer;