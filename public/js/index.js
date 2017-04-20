$.get('/socket/address', function (result) {

    var socket = new io.connect(result, {
        autoConnect         : true,
        timeout             : 5000,
        reconnection        : true,
        reconnectionAttempts: 3,
        reconnectionDelay   : 1 * 1000,
        reconnectionDelayMax: 5 * 1000
    });


    /* 正在连接 */
    socket.on('connecting', function (obj) {
        $('#receive').append('connecting : 正在连接... [ ' + socket.id + ' ] ' + obj + ' \r\n');
    });

    /* 连接成功 */
    socket.on('connect', function (obj) {
        $('#receive').append('connect: 连接成功! [ ' + socket.id + ' ] ' + obj + '\r\n');
    });

    /* 连接异常事件 */
    socket.on('connect_error', function (obj) {
        $('#receive').append(' connect_error :  连接异常! [ ' + socket.id + ' ] ' + obj + ' \r\n');
    });

    /* 正在重连 */
    socket.on('reconnecting', function (obj) {
        $('#receive').append('reconnecting : 正在重连...[ ' + socket.id + ' ] ' + obj + '\r\n');
    });

    /* 重连成功 */
    socket.on('reconnect', function (obj) {
        $('#receive').append('reconnect : 重连成功! [ ' + socket.id + ' ] ' + obj + '\r\n');
    });

    /* 重连失败 */
    socket.on('reconnect_failed', function (obj) {
        $('#receive').append('reconnect_failed : 重连失败! [ ' + socket.id + ' ] ' + obj + ' \r\n');
    });


    /* 不明异常 */
    socket.on('error', function (obj) {
        $('#receive').append(' error : 不明异常! [ ' + socket.id + ' ] ' + obj + '\r\n');
    });


    /* 延迟 (ping和pong配置同服务器端一致) */
    socket.on('pong', function (obj) {
        $('#delay').text(obj);
    });


    /* 同服务器端message事件 socket.send() 触发*/
    socket.on('message', function (obj) {
        $('#receive').append('message : [ ' + socket.id + ' ] ' + obj + '\r\n');
    });

    /* 同服务器端anything事件 */
    socket.on('anything', function (obj) {
        $('#receive').append('anything : [ ' + socket.id + ' ] ' + obj + '\r\n');
    });

    /* 服务器断开事件 */
    socket.on('disconnect', function (obj) {
        $('#receive').append('disconnect : [ ' + socket.id + ' ] ' + obj + ' \r\n');
        //socket.disconnect();
    });

    /* 自定义获取消息(msgReceived)事件 */
    socket.on('msgReceived', function (obj) {
        $('#receive').append('msgReceived : ' + obj + '\r\n');
    });


    $('#open').click(function () {
        socket.connect();
    });
    $('#close').click(function () {
        socket.disconnect();
    });
    $('#message').click(function () {
        var data = {roomId: $('#room').val(), msg: 'send message'};
        socket.send(data);
    });

    $('#rooms').click(function () {
        var data = {roomId: $('#room').val(), msg: $('#msg').val()};
        socket.emit('roomAll',data);
    });

    $('#send').click(function () {
        if (!$('#msg').val().toString().trim()) {
            $('#receive').append("Please don't send empty content! \r\n");
            return;
        }
        var data = {roomId: $('#room').val(), msg: $('#msg').val()};
        socket.emit('roomChat', data);
        $('#msg').val('');
    });

    $('#join-room').click(function () {
        var data = {roomId: $('#room').val(), msg: $('#msg').val()};
        socket.emit('roomJoin', data);
    });

    $('#leave-room').click(function () {
        var data = {roomId: $('#room').val(), msg: $('#msg').val()};
        socket.emit('roomLeave', data);
    });

    $('#clear').click(function () {
        $('#receive').empty();
    });

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {

            $('#send').click();
        }
    };
});
