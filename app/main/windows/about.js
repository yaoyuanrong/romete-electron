const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.join(__dirname, 'Connection.png'),
  package_json_dir: path.resolve(__dirname, '/../../../'),
  copyright: 'Copyright(c)2022 yaoyuanrong',
  homepage:'https://www.soyoung.com',
  bug_report_url: 'https://www.soyoung.com',
})
module.exports = { create }