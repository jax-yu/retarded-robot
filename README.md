# retarded-robot
[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This is not a very smart wechat robot

## 内容列表

- [背景](#背景)
- [功能列表](#功能列表)
- [安装](#安装)
- [使用说明](#使用说明)
- [示例](#示例)
- [部署](#部署)
- [维护者](#维护者)
- [使用许可](#使用许可)

## 背景
这个机器人主要作用于人力资源服务行业，辅助业务员工作的这么一个机器人。业务员每天的工作就是群发消息、收集报名以及处理58同城的邮件并筛选出合适的人，大量的重复工作，因此该机器人诞生了！！
该机器人还具备一些AI功能，例如颜值检测、智能对话等等。主要来源鹅厂开放的AI接口。

## 功能列表
- [x] 工作信息查询
- [x] 定时群发
- [X] 58同城邮件解析(解析成功后，会通知到管理员)
- [X] 智能对话
- [ ] 颜值检测

## 安装
[![node](https://img.shields.io/node/v/wechaty.svg?maxAge=604800)](https://nodejs.org/)
[![NPM Version](https://img.shields.io/npm/v/wechaty?color=brightgreen&label=wechaty%40latest)](https://www.npmjs.com/package/wechaty)
[![npm (tag)](https://img.shields.io/npm/v/wechaty/next?color=yellow&label=wechaty%40next)](https://www.npmjs.com/package/wechaty?activeTab=versions)

这个项目使用 [node](http://nodejs.org) 和 [npm](https://npmjs.com)。请确保你本地安装了它们。

```shell script
git clone https://github.com/xajeyu/retarded-robot.git
```

## 使用说明
* 该机器人基于pad协议，请在config/robot.ts中配置自己的[token](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
* 所有涉及到配置的文本全在config文件夹中
* 定时发送消息存储在redis中
* 工作信息存在数据库中
* [AI接口文档](https://api.xajeyu.com/doc/)
```shell script
npm install or yarn
npm start or yarn start
```

## 示例
[主要入口](src/robot/)

## 部署
```shell script
npm install -g pm2
pm2 start run-ts.sh
# 运行成功后 执行
pm2 logs # 等待二维码之后扫描即可
# 停止应用 id 为 pm2 start run-ts.sh 启动后出现的应用ID
pm2 delete all or pm2 delete id
# 相关具体使用请自行搜索pm2教程
```

## 维护者
[@xajeyu](https://github.com/xajeyu)

## 使用许可
[MIT](LICENSE) © Richard Littauer
