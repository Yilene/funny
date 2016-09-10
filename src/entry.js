var Router = require("./router.min.js");

console.log("hello");

var router = new Router({
    container: '#container',
    enter: 'enter',
    enterTimeout: 200,
    leave: 'leave',
    leaveTimeout: 200
});

// home
var home = {
    url: '/',
    className: 'home',
    render: function () {
        return document.getElementById('tpl_home').innerHTML;
    },
    bind: function () {
        document.getElementsByClassName('home')[0].className = "home enter";
    }
};

// pixel
var button = {
    url: '/pixelart',
    className: 'pixelart',
    render: function () {
        return document.getElementById('tpl_pixelart').innerHTML;
    },
    bind: function () {
        document.getElementsByClassName('pixelart')[0].className = "pixelart enter";
    }
};

router.push(home)
    .push(button)
    .setDefault('/')
    .init();



var j = 31;
for(var i = 43; i < 66; i++){
    console.log('12em '+ j + 'em #f5f7e0,');
    j = j+ 0.5;
}