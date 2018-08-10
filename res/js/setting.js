/**
 项目配置
 **/
layui.define(function(exports){
    var obj = {
        'api_url': 'https://duothink.rangwomenwan.com'
    };

    if (document.domain == 'localhost') {
        obj.api_url = 'http://dev.duothink.com';
        console.log('本地开发');
    }
    exports('setting', obj);
});