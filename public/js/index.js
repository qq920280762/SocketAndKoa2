
$.get('/socket/address',function(result){

    var socket = new io.connect(result,{'reconnect':false,'auto connect':false});

    /* 自定义获取消息(msgReceived)事件 */
    socket.on('msgReceived', function (msg) {
        $('#receive').append(msg+'\r\n');
    });

    /* 连接事件 */
    socket.on('connect', function () {
        $('#receive').append('[ '+socket.id+' ] connect to the server ~ \r\n');
    });

    /* 连接错误事件 */
    socket.on('connect_error',function(object){
        $('#receive').append(' connect_error :'+JSON.stringify(object)+'\r\n');
    });

    /* 服务器断开事件 */
    socket.on('disconnect',function(){
        $('#receive').append('server active disconnect ~ \r\n');
        socket.disconnect();
    })

    /* 重新连接事件 大于三次就主动断开 */
    socket.on('reconnecting',function(number){
        if(number>3){
            socket.disconnect();
            $('#receive').append('reconnecting number gt 3 ~ \r\n');
        }
    });

    $('#open').click(function(){
        socket.connect();
    });
    $('#close').click(function(){
        socket.disconnect();
    });
    $('#send').click(function(){
        if(!$('#msg').val().toString().trim()){
            alert('Send content cannot be empty ~');
            return;
        };
        var data = {roomId:$('#room').val(),msg:$('#msg').val()};
        socket.emit('roomChat',data);
        $('#msg').val('');
    });

    $('#join-room').click(function(){
        var data = {roomId:$('#room').val(),msg:$('#msg').val()};
        socket.emit('roomJoin',data);
    });

    $('#leave-room').click(function(){
        var data = {roomId:$('#room').val(),msg:$('#msg').val()};
        socket.emit('roomLeave',data);
    });

    $('#clear').click(function(){
        $('#receive').empty();
    });

    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){

            $('#send').click();
        }
    };
});
