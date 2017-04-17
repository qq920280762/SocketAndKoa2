module.exports = {
  apps : [
    {
      name      : "API",
      script    : "./bin/www",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      },
      watch: true,
      watch_options: {
          usePolling: true
      },
      node_args : "--harmony"
    }
  ]
}
