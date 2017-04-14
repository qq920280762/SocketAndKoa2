'use strict';
class socketUtils {

    constructor(io){
        this.io = io;
    };

    joinRoom(roomId,socketId){
        this.io.sockets.sockets[socketId].join(roomId);
    };

    leaveRoom(roomId,socketId){
        this.io.sockets.sockets[socketId].leave(roomId);
    };

    emitRoom(roomId,data,event='receiveMsg'){
        if(roomId){

            this.io.to(roomId).emit(event,data);

        }else{

            this.io.sockets.emit(event,data);
        }
    };

    emitSocket(socketId,data,event='receiveMsg'){

        this.io.sockets.sockets[socketId].emit(event,data);

    };

    getUsersByRoom(room){
        return this.io.sockets.adapter.rooms[room];
    };

    hasUserAtRoom(room,socketId){
        let rooms = (this.getUsersByRoom(room)||{}).sockets||{};
        let flag = false;
        for( let key in rooms){
            if(socketId==key && !!rooms[key]){
                flag = true;
                break;
            }
        }
        return flag;
    };


}
module.exports = socketUtils;