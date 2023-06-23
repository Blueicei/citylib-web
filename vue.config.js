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
    port: '8080'
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