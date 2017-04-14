'use strict'
var path = require('path');
var program = require('commander');
var copyDir = require('./src/CopyDir');
var utils = require('./src/utils');
var conf = require('./src/config');

// var srcPath = 'C:\\Users\\Administrator\\Desktop\\assets';
// var desPath = 'C:\\Users\\Administrator\\Desktop\\des';

var srcPath = '';
var desPath = '';
var gameNames = [];

program
    .allowUnknownOption()
    .version('0.1.2')
    .option('-s, --src <lang>', 'src absloute path like `-s c\\b\\c\\d`')
    .option('-d, --des <lang>', 'des absloute path like `-d c\\b\\c\\d`')
    .option('-g, --game <lang>', 'game name list like `-g name1,name2,name3,...`')
    .parse(process.argv);

if (program.src) {
    srcPath = utils.getAbsolutePath(program.src);
}
if (program.des) {
    desPath = utils.getAbsolutePath(program.des);
}

if (program.game) {
    gameNames = program.game.split(',');
    //console.log(gameNames);
}

if (srcPath.length == 0 || desPath.length == 0) {
    console.log('[error] Program requires two parameters(Absolute path)');
    console.log('[info:] like this:`node app.js -src c\\a\\b\\d -d f\\a\\b\\c [-g name1,name2,...]`');
    return;
}

if (gameNames.length == 0) {
    console.log(srcPath);
    console.log(desPath);
    copyDir(srcPath, desPath);
} else {
    var srcDirs = [];
    var desDris = [];
    conf.dirs.forEach(function (fileName) {
        gameNames.forEach(function (gameName) {
            var srcDir = path.normalize(path.join(srcPath, fileName, gameName));
            srcDirs.push(srcDir);

            var desDir = path.normalize(path.join(desPath, fileName, gameName));
            desDris.push(desDir);
        });

        var commonSrcDir = path.normalize(path.join(srcPath, fileName, conf.comdir));
        srcDirs.push(commonSrcDir);
        var commonDesDir = path.normalize(path.join(desPath, fileName, conf.comdir));
        desDris.push(commonDesDir);
    });

    //console.log('++++dirs:', desDris);
    srcDirs.forEach(function (dir, index) {
        copyDir(dir, desDris[index]);
    });
}