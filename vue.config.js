module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    https: false, // 改为https请求
    open: true, // 是否自动弹出浏览器页面
    host: "localhost",
    port: '8080',
    proxy: {
      '/api': { // 要代理的接口名
        target: 'http://localhost:8888/', // 请求服务器根路径
        changeOrigin: true, // 是否跨域
        ws: true, // websocket
        pathRewrite: { // 重写路径: 当检测到请求地址里包含 /v1 时,将此路径进行跨域代理操作
          '^/api': ''
        }
      },
      '/camTra': { // 要代理的接口名
        target: 'http://localhost:8082/', // 请求服务器根路径
        changeOrigin: true, // 是否跨域
        ws: true, // websocket
      },
      '/stat': { // 要代理的接口名
        target: 'http://localhost:8082/', // 请求服务器根路径
        changeOrigin: true, // 是否跨域
        ws: true, // websocket
      },
    }
  },
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title= 'CityLib Demo'
          return args
        })
  }
}
