'use strict'
var path = require('path');

//获取文件的后后缀名
function getSuffix(url) {
    var lastIndex = url.lastIndexOf('.');
    if (lastIndex == -1) {
        console.log('[error] path do not inclue a file name:', url);
        return;
    }

    return url.substring(lastIndex);
}

//获取绝对路径
function getAbsolutePath(url) {
    if (!path.isAbsolute(url)) {
        url = path.join(__dirname, url);
    }
    return path.normalize(url)
}

module.exports = {
    getSuffix: getSuffix,
    getAbsolutePath: getAbsolutePath
}