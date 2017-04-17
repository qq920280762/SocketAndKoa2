module.exports = {
    apps: [
        {
            name              : "http_server",
            max_memory_restart: "500M",
            script            : "./bin/www_http",
//            out_file          : "./logs/http/nova_out.log",
//            error_file        : "./logs/http/nova_error.log",
            instances         : 4,
            exec_mode         : "cluster",
//            env               : {
//                NODE_ENV: "production"
//            },
//            watch             : true,
//            watch_options     : {
//                usePolling: true
//            },
            node_args         : "--harmony"
        },
        {
            name              : "socket_server",
            max_memory_restart: "500M",
            script            : "./bin/www_socket",
//            out_file          : "./logs/socket/nova_out.log",
//            error_file        : "./logs/socket/nova_error.log",
//            env               : {
//                NODE_ENV: "production"
//            },
//            watch             : true,
//            watch_options     : {
//                usePolling: true
//            },
            node_args         : "--harmony"
        }
    ]
}
