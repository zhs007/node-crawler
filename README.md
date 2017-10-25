# crawlercore
---
crawlercore是一套强大的爬虫库，有以下特点：

1. 组件式，可配置出各种类型的爬虫
2. 使用```async/await```语法，上层编码更人性化
3. 自动的编码处理（uft8、gbk）
4. 支持```headless chrome```
5. 可配置的持久化模块
6. 强大的爬虫管理器，会自动重试，支持分布式管理
7. 强大的数据分析模块，除了常用的html选择器外，还有js虚拟机，方便直接爬取js数据

---
安装说明

```
npm i crawlercore --save
```

即可安装，具体使用方法，见 ```https://github.com/zhs007/crawler-js``` 项目。

---
更新日志

* 1.0 - 正式发布，基本功能正常
* 1.1 - 增加redis缓存集中管理缓存，初步支持分布式，支持各种重启多开