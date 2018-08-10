$(function() {
	searchTheme();
	initNavOrder()
	$(window).resize(function() {
		initNavOrder()
	});
})

//左侧列表切换时的背景颜色的改变
function Themelist() {
	$("ul.l_list>li").bind("click", function() {
		$(this).addClass("themeActive").siblings().removeClass("themeActive");
		$(this).find("span.operate").show()
		$(this).children("a").css("color", "#fff");
		$(this).siblings().children("a").css("color", "#666");
		$(this).siblings().find("span.operate").hide();
		initNavOrder()
		$("div.themeInfos").attr("themeInfos","")
		localStorage.setItem("tname", $(this).find("a").html());
		localStorage.setItem("t_isI", 2)
		$("div#duolun_main").load("res/views/ability/themeTable.html");
	})
}
//添加主题
$("button#addTheme").bind("click", function() {
	layer.prompt({
		title: '添加主题',
		formType: 0 /*input为text的文本框*/
	}, function(text, index) {
		//正则校验主题名称
		var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/;
		if(!reg.test(text)) {
			layer.alert("主题的名称只能是中文，英文，数字或者下划线");
			return false
		}
		if(text.length > 10) {
			layer.alert("主题的名称不能超过10个字符");
			return false
		}
		var url = $ctx + "addTheme";
		var param = {
			"tname": text,
			"idAc": $("input.user_name").val(),
			"idDt": localStorage.getItem("idDt")
		};
		var type = "post";
		getAjax(url, param, type, function(data) {
			if(data.ret == 0) {
				layer.close(index);
				layer.msg('<span style="color:#fff">添加主题成功</span>');
				var h1 = '';
				h1 = '<li title="'+text+'" class="themeActive" t_id="' + data.returnData.id + '"><a href="javascript:void(0)">' + text + '</a><span class="operate"><a href="javascript:void(0)" class="etheme">修改</a><span>&nbsp;|&nbsp;</span><a class="dtheme" href="javascript:void(0)">删除</a></span></li>'
				$("#themeList").append(h1);
				$("ul.l_list>li[t_id=" + data.returnData.id + "]").siblings().removeClass("themeActive");
				localStorage.setItem("tname", $("li.themeActive").find("a").html())
				$("div#duolun_main").load("res/views/ability/themeTable.html");
				$("li.themeActive").siblings().find("span.operate").hide()
				Themelist();
				editTheme();
				deleteTheme()
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}

		})
		/*$.post($ctx+"addTheme", {
			"tname": text
		}, function(data, status) {
			if(data.ret == 1) {
				layer.close(index);
				layer.msg('<span style="color:#fff">添加主题成功</span>');
				var h1 = '';
				h1 = '<li t_id="'+data.returnData.id+'"><a href="javascript:void(0)">' + text + '</a></li>'
				$("#themeList").append(h1)
			} else {
				layer.alert(data.info);
			}
		})*/
	});
})
//查询主题  ---搜索按钮查询
$("i#d_search_btn").bind("click", function() {
	searchTheme()
})
//查询主题 ---回车按键查询
$('input.t_name').keydown(function(event) {
	if(event.keyCode == 13) {
		searchTheme();
		return false;
	}
});

function searchTheme() {
	getAjax($ctx + "listTheme", {
		"page": 1,
		"size": 16,
		"tname": $("input.t_name").val(),
		"idAc": $("input.user_name").val(),
		"idDt": localStorage.getItem("idDt")
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			if(data.returnData.list.length == "") {
				$("ul#themeList").empty();
				$("div#duolun_main").empty();
				return false
			}
			initTheme(data)
			/*if(data.returnData.list.length < data.returnData.size) {
				$("div#ThemePage").empty();
				$("ul#themeList").empty();
				var list = data.returnData.list;
				for(var i = 0; i < list.length; i++) {
					var tname = list[i].tname;
					var liHTML = "";
					//alert(localStorage.getItem("themeId"))
					if(i == 0 && localStorage.getItem("themeId") == "") {
						var className = "themeActive";
					} else {
						if(list[i].id == localStorage.getItem("themeId")) {
							var className = "themeActive";
						} else {
							var className = "";
						}
					}
					liHTML = '<li class="' + className + '" t_id="' + list[i].id + '"><a href="javascript:void(0)">' + tname + '</a></li>'
					$("#themeList").append(liHTML);
					l_list();
					$("div#duolun_main").load("res/views/ability/themeTable.html");
				}
				return false;
			}*/
			layui.use(['element', 'laypage', ], function() {
				var element = layui.element, //元素操作
					laypage = layui.laypage;
				laypage.render({
					elem: 'ThemePage',
					count: data.returnData.total,
					limit: 16,
					prev: "<",
					next: ">",
					jump: function(obj, first) {
						if(!first) {
							getAjax($ctx + "listTheme", {
								"tname": $("input.t_name").val(),
								"page": obj.curr,
								"size": obj.limit,
								"idAc": $("input.user_name").val(),
								"idDt": localStorage.getItem("idDt")
							}, 'post', function(data, status) {
								if(data.ret == 0) {
									initTheme(data)
								} else if(data.ret == 20003) {
									layer.alert(data.info, function() {
										window.open("res/views/user/login.html", "_self");
									})
								}
							})
						}

					}
				})
			})
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		}
	})
}

function initTheme(data) {
	$("ul#themeList").empty();
	var list = data.returnData.list;
	for(var i = 0; i < list.length; i++) {
		var tname = list[i].tname;
		var liHTML = "";
		if(i == 0) {
			var className = "themeActive";
			var show = "block"
		} else {
			var className = "";
			var show = "none"
		}
		liHTML = '<li title="'+tname+'" class="' + className + '" t_id="' + list[i].id + '"><a href="javascript:void(0)">' + tname + '</a><span class="operate" style="display:' + show + '"><a href="javascript:void(0)" class="etheme">修改</a><span>&nbsp;|&nbsp;</span><a href="javascript:void(0)" class="dtheme">删除</a></span></li>'
		$("#themeList").append(liHTML)
	}
	Themelist();
	editTheme();
	deleteTheme();
	localStorage.setItem("tname", $("li.themeActive").find("a").html())
	$("div#duolun_main").load("res/views/ability/themeTable.html");
}
//修改
function editTheme() {
	$("a.etheme").bind("click", function(e) {
		e.stopPropagation()
		layer.prompt({
			title: '修改主题',
			formType: 0,
			value: $("li.themeActive>a").html()
		}, function(text, index) {
			var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/;
			if(!reg.test(text)) {
				layer.alert("主题的名称只能是中文，英文，数字或者下划线");
				return false
			}
			if(text.length > 10) {
				layer.alert("主题的名称不能超过10个字符");
				return false
			}
			getAjax($ctx + "modifyTheme", {
				"id": $("li.themeActive").attr("t_id"),
				"tname": text,
				"idAc":$("input.user_name").val(),
				"idDt":localStorage.getItem("idDt")
			}, 'post', function(data, status) {
				if(data.ret == 0) {
					layer.close(index);
					layer.msg('<span style="color:#fff">修改主题成功</span>');
					$("li.themeActive>a").html(text);
					$("span.t3>a").html(text)
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info);
				}
			})

		});
	})
}
//删除
function deleteTheme() {
	$("a.dtheme").bind("click", function(e) {
		e.stopPropagation()
		layer.confirm('您确定要删除该主题吗', function(index) {
			getAjax($ctx + "delTheme", {
				"id": $("li.themeActive").attr("t_id")
			}, "post", function(data, status) {
				if(data.ret == 0) {
					layer.alert("删除主题成功")
					searchTheme()
					layer.closeAll();
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
		});
	})

}
$("img#closeBtn").bind("click", function() {
	hideLeft()
})