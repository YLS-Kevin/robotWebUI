/**
 项目JS主入口
 **/
var view_path = './res/views';
layui.define(['laytpl', 'layer', 'element'], function(exports) {
	var laytpl = layui.laytpl,
		layer = layui.layer,
		element = layui.element,
		$ = layui.$;
	var check = function() {
		var router = layui.router(location.hash),
			params = router.search,
			path = router.path;

		// 通过 path 获得对应 view
		var view_path = './res/views',
			view_html = '';
		for(i = 0; i < path.length; i++) {
			view_path = view_path + '/' + path[i];
		}
		if(!path[0]) {
			view_path = view_path + '/index';
		}
		if(!path[1]) {
			view_path = view_path + '/index';
		}
		view_path += '.html';
		// console.log(path);
		// console.log(view_path);
		var loading = layer.load(2);
		$.ajax({
			type: 'get',
			url: view_path,
			success: function(res) {
				// 填充到页面                
				$('.layui-layout-body > div').html(res);
				console.log(path)
				$.each(path, function() {
					if(path[0] == "index") {
						$("#manager").parent().addClass("firstActive");
						$("#manager").parent().siblings().removeClass("firstActive")
					} else if(path[0] == "ability") {
						$("#ability").parent().addClass("firstActive");
						$("#ability").parent().siblings().removeClass("firstActive");
					} else if(path[0] == "interface") {
						$("#data").parent().addClass("firstActive");
						$("#data").parent().siblings().removeClass("firstActive");
					} else if(path[0] == "word") {
						$("#word").parent().addClass("firstActive");
						$("#word").parent().siblings().removeClass("firstActive")
					} else if(path[0] == "wordBank") {
						$("#wordBank").parent().addClass("firstActive");
						$("#wordBank").parent().siblings().removeClass("firstActive")
					} else {
						$("a.orders").parent().removeClass("firstActive")
					}
				})

				layer.close(loading);
			},
			error: function(res) {
				layer.msg('模板不存在');
				layer.close(loading);
				return 0;
			}
		});
	};
	check();
	/*if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0") {
		check();
	} else {*/
	window.addEventListener('hashchange', function() {
		check();
	});
	/*}*/
	// setting-icon
	$('.setting-icon').hover(function() {
		$(this).addClass('layui-anim layui-anim-rotate layui-anim-loop');
	}, function() {
		$(this).removeClass('layui-anim layui-anim-rotate layui-anim-loop');
	});

	// 侧边栏
	$('.layui-nav-item a').bind("click", function(event) {
		if($(this).attr('href') != 'javascript:;') { // 排除一级折叠菜单
			layui.data('layui-this', {
				key: 'href',
				value: $(this).attr('href')
			});
			$("p.showCurrPage").html(1);
			$("p.ability_page").html(1)
			/*if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0") {
		        window.location.reload()
	        }*/
			$('.layui-nav-item a').parent('dd').removeClass('layui-this');
			$('.layui-nav-item a').parent('li').removeClass('firstActive');
			$(this).parent('li').addClass('firstActive');
			/*localStorage.setItem("idDt", "");
			localStorage.setItem("iddts", "");
			localStorage.setItem("isI", "");*/
			//localStorage.setItem("currNum","")
			//alert(localStorage.getItem("idDt"))
		}
	});
	// 设置侧边栏导航高亮
	var layui_side_a_href = layui.data('layui-this');
	$('.layui-nav-item a[href=\'' + layui_side_a_href.href + '\']').parent('dd').addClass('layui-this');
	$('.layui-nav-item a[href=\'' + layui_side_a_href.href + '\']').parent('li').addClass('layui-this');

	exports('app', {});
});