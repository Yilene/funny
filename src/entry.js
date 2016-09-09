require("./works/reset.scss");
require("./works/base.scss");
require("./works/home/home.scss");
require("./works/pixelart/pixelart.scss");
var Router = require("./router.min.js");

console.log("hello");

var router = new Router({
    container: '#container',
    enterTimeout: 250,
    leaveTimeout: 250
});

// home
var home = {
    url: '/',
    className: 'home',
    render: function () {
        return document.getElementById('tpl_home').innerHTML;
    }
};

// pixel
var button = {
    url: '/pixelart',
    className: 'pixelart',
    render: function () {
        return document.getElementById('tpl_pixelart').innerHTML;
    }
};

router.push(home)
    .push(button)
    .setDefault('/')
    .init();
