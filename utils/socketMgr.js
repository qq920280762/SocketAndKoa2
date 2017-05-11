'use strict';

var _ = require('underscore');

let io;

module.exports = {

    init: (server) => {

        io = require('socket.io')(server);

        //心跳检测间隔
        io.set('heartbeat interval', 2*60 * 1000);

        //连接超时设置
        io.set('heartbeat timeout', 60 * 1000);

    },

    connect: (fn) => {

        io.on('connection', fn);

    },

    /**
     * 绑定事件
     * @param event
     * @param socket
     * @param fn
     */
    on: (event, socket, fn) => {

        if (event && socket) {

            socket.on(event, fn);

        }

    },

    /**
     * 加入房间
     * @param roomNum
     * @param socket
     */
    join: (roomNum, socket) => {

        socket.roomNum = roomNum;

        if (roomNum && socket) {

            socket.join(roomNum);

        }

    },

    /**
     * 退出房间
     * @param roomNum
     * @param socket
     */
    leave: (roomNum, socket) => {

        socket.roomNum = null;

        if (roomNum && socket) {

            socket.leave(roomNum);

        }

    },

    /**
     * 广播事件
     * @param event
     * @param data
     * @param roomNum
     */
    broadcast: (event, data, roomNum) => {

        if (roomNum) {

            io.to(roomNum).emit(event, data);

        }
        else {

            io.sockets.emit(event, data);

        }

    },

    /**
     * 触发事件
     * @param event
     * @param data
     * @param socket
     */
    emit: (event, data, socket)=> {

        if (socket) {

            socket.emit(event, data);

        }

    },

    /**
     * 获取指定房间或所有sockets
     * @param roomNum
     * @returns {*}
     */
    getSockets: (roomNum) => {

        let sockets = {};

        if (roomNum) {

            let socketIds = (io.sockets.adapter.rooms[roomNum] || {}).sockets;

            if (socketIds) {

                for (let id in socketIds) {

                    sockets[id] = io.sockets.sockets[id];

                }

            }
        }
        else {
            sockets = io.sockets.sockets;
        }

        return sockets;

    },

    /**
     * 根据用户id获取socket
     * @param userId
     * @returns {*}
     */
    getSocket: (userId) => {
        return  _.findWhere(io.sockets.sockets,{userId:userId});
    },

    /**
     * 检查用户是否在线
     * @param userId
     * @returns {boolean}
     */
    isOnline: (userId) => {

        let socket = module.exports.getSocket(userId);

        return socket ? socket.connected : false;

    },

    /**
     * 获取所有在线用户
     * @returns {Array} userId
     */
    getOnlineUsers: () => {
        let userIds = [];

        for (let socketId in io.sockets.sockets) {

            let socket = io.sockets.sockets[socketId];

            if (socket.connected && socket.userId) {
                userIds.push(socket.userId);
            }

        }

        return userIds;
    },

    /**
     * 给指定用户发送消息
     * @param userId
     * @param event
     * @param msg
     */
    emitUser: (userId, event, msg) => {

        let socket = module.exports.getSocket(userId);

        module.exports.emit(event, msg, socket);

    },

    /**
     * 断开连接
     * @param socket
     */
    disconnect: (socket) => {

        if (socket) {

            socket.disconnect();

        }

    }

};