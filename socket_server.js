'use strict';

/**

// 加入manager分组
// socket.on('group1', function () {
//            socket.join('group1');
//            //包括自己
//            io.sockets.in('group1').emit('msgReceived',  ' Welcome '+socket.id+' to join group1');
//            //不包括自己
//            socket.broadcast.to('group1').emit('msgReceived', ' Welcome '+socket.id+' to join group1');
//            //获取所有房间（分组）信息,返回{socket_id:true,...}
//            io.sockets.adapter.rooms
//            //获取group1中的客户端，返回{socket_id:true,...}
//            io.sockets.adapter.rooms('group1');
//            //移除房间
//            socket.leave('group1');
//   });

// exports.start = function(server){
//
//    var io  = require('socket.io')(server);
//
//    io.on('connection', function(socket) {
//
//        socket.name = randomNames.getRandomName(2);
//
//        console.log('soket connection [ '+socket.id+' ] ');
//
//        //加入employee分组
//        socket.on('roomJoin',function(data){
//            socket.join(data.id);
//            socket.emit('msgReceived', ' [ '+socket.name+' ] => JOIN ROOM '+data.id);
//            socket.broadcast.to(data.id).emit('msgReceived', ' [ '+socket.name+' ] => JOIN ROOM '+data.id);
//        });
//
//        socket.on('roomLeave',function(data){
//            socket.leave(data.id);
//            socket.emit('msgReceived', ' [ '+socket.name+' ] => LEAVE ROOM '+data.id);
//            socket.broadcast.to(data.id).emit('msgReceived', ' [ '+socket.name+' ] => LEAVE ROOM '+data.id);
//        });
//
//        socket.on('roomChat',function(data){
//            socket.emit('msgReceived',' [ '+socket.name+' ] => '+ data.msg);
//            socket.broadcast.to(data.id).emit('msgReceived',' [ '+socket.name+' ] => '+ data.msg);
//        });
//
//        //客户端断开事件
//        socket.on('disconnect', function () {
//            console.log('client active disconnect  [  '+socket.id+' ]');
//            socket.disconnect();
//        });
//
//    });
// }

 */


let randomNames = require('./utils/randomNames');
let socketUtils = require('./utils/SocketBase');

class socket_server extends socketUtils {

    constructor(server){
        super(require('socket.io')(server));
    }

    init(){
        this.connect( (socket) => {
            socket.name = randomNames.getRandomName(2);
            console.log('soket connection [ '+socket.id+' ] ');
            // 加入employee分组
            this.on('roomJoin',socket.id,(data)=>{
                if(!this.hasSocket(data.id,socket.id)){
                    this.join(data.id,socket.id);
                    this.broadcast('msgReceived',' [ '+socket.name+' ] => JOIN ROOM '+data.id ,data.id);
                }else{
                    this.emit('msgReceived',' [ '+socket.name+' ] => Repeat to join the room '+data.id,socket.id);
                }
            });

            this.on('roomLeave',socket.id,(data)=>{
                this.leave(data.id,socket.id);
                this.broadcast('msgReceived', ' [ '+socket.name+' ] => LEAVE ROOM '+data.id,data.id);
            });

            this.on('roomChat',socket.id,(data)=>{
                this.broadcast('msgReceived',' [ '+socket.name+' ] => '+ data.msg,data.id);
            });

            //客户端断开事件
            this.on('disconnect',socket.id,() => {
                console.log('client active disconnect  [  '+socket.id+' ]');
                this.disconnect(socket.id);
            });

        });
    }

}
module.exports = socket_server;