'use strict'
var fs = require("fs");
var os = require('os');
var path = require('path');

/**
 * 拷贝目录
 * @param {*String} srcPath 需要拷贝的目录绝对路径
 * @param {*String} desPath 目标绝对路径
 * @param {*String} relative 调用时请忽略，函数内部区别是否递归开始
 */
function copyDir(srcPath, desPath, relative) {
    if(relative == undefined){
        relative = srcPath;
    }

    fs.readdir(srcPath, function (err, files) {
        files.forEach(function (fileName) {
            fs.stat(path.join(srcPath, fileName), function (err, stats) {
                if (err) {
                    console.log('[error] ', err);
                    return;
                }
                if (stats.isFile()) {
                    var relativePath = path.relative(relative, srcPath);
                    var replace = { win32: '..\\', linux: '../' };

                    var srcFile = path.normalize(srcPath + '/' + fileName);
                    var desFile = path.normalize(path.join(desPath,
                        relativePath.replace(replace[os.platform])) + '/' + fileName);
                    //console.log('src file:', srcFile);
                    //console.log('des file:', desFile);
                    createDir(srcFile,desFile);

                } else if (stats.isDirectory()) {
                    //第三个参数用于区分是否是递归开始，并且计算目标路径相对于给定路径的相对位置
                    copyDir(path.join(srcPath,fileName),desPath,relative);
                }
            });
        });
    });
}

/**
 * 创建目录
 * @param {*String} srcPath 需要拷贝的目录绝对路径
 * @param {*string} desPath 拷贝后的目标目录绝对路径
 */
function createDir(srcPath, desPath) {
    var pathInfo = path.parse(desPath);
    var searchvalue = pathInfo.root[pathInfo.root.length - 1]
    var start = 0;
    var found = pathInfo.dir.indexOf(searchvalue);
    var subPath = '';
    var dirs = [];

    if (found != -1) {
        while (true) {
            subPath = pathInfo.dir.substr(start, found - start + 1);
            if (subPath != '') {
                dirs.push(subPath);
            }
            start = found + 1;
            found = pathInfo.dir.indexOf(searchvalue, start);
            if (found == -1) {
                if (start < pathInfo.dir.length) {
                    dirs.push(pathInfo.dir.substr(start));
                }
                break;
            }
        }
    }

    subPath = '';
    dirs.forEach(function (dir, num) {
        subPath += dir;
        if (!fs.existsSync(subPath)) {
            try {
                fs.mkdirSync(subPath);
            } catch (e) {
                if (e.code != 'EEXIST') {
                    console.log('[error] ', e);
                };
            }
            console.log('[info] create  dir:', subPath);
        }
        if (num == dirs.length - 1 && pathInfo.base != '') {
            copyFile(srcPath, desPath);
            //console.log('src file:', srcPath);
            //console.log('des file:', desPath);
        }
    });

}

/**
 * 拷贝文件
 * @param {*String} srcPath 
 * @param {*String} desPath 
 */
function copyFile(srcPath, desPath) {
    var read = fs.createReadStream(srcPath);
    var write = fs.createWriteStream(desPath);
    read.pipe(write);
    console.log('[info] create file:', desPath);
}

module.exports = copyDir;