'use strict';

/**
        //加入manager分组
        socket.on('group1', function () {
            socket.join('group1');
            //包括自己
            io.sockets.in('group1').emit('msgReceived',  ' Welcome '+socket.id+' to join group1');
            //不包括自己
            socket.broadcast.to('group1').emit('msgReceived', ' Welcome '+socket.id+' to join group1');
            //获取所有房间（分组）信息,返回{socket_id:true,...}
            io.sockets.adapter.rooms
            //获取group1中的客户端，返回{socket_id:true,...}
            io.sockets.adapter.rooms('group1');
            //移除房间
            socket.leave('group1');
        });

 */

exports.start = function(server){

    var io  = require('socket.io')(server);

    io.on('connection', function(socket) {

        console.log('soket connection [ '+socket.id+' ] ');

        /* 加入employee分组 */
        socket.on('roomJoin',function(data){
            socket.join(data.id);
            socket.emit('msgReceived', ' [ '+socket.id+' ] => JOIN ROOM '+data.id);
            socket.broadcast.to(data.id).emit('msgReceived', ' [ '+socket.id+' ] => JOIN ROOM '+data.id);
        });

        socket.on('roomLeave',function(data){
            socket.leave(data.id);
            socket.emit('msgReceived', ' [ '+socket.id+' ] => LEAVE ROOM '+data.id);
            socket.broadcast.to(data.id).emit('msgReceived', ' [ '+socket.id+' ] => LEAVE ROOM '+data.id);
        });

        socket.on('roomChat',function(data){
            socket.emit('msgReceived',' [ '+socket.id+' ] => '+ data.msg);
            socket.broadcast.to(data.id).emit('msgReceived',' [ '+socket.id+' ] => '+ data.msg);
        });

        /* 客户端断开事件 */
        socket.on('disconnect', function () {
            console.log('client active disconnect  [  '+socket.id+' ]');
            socket.disconnect();
        });

    });
}