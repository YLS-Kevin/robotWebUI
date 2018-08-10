$(function() {
	initNavOrder()
	$(window).resize(function() {
		initNavOrder()
	});
	layui.use(['table', 'element', 'form', 'laypage', 'layer'], function() {
		var table1 = layui.table,
			table2 = layui.table, //表格  
			element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		form.render(); //表单的初始化
		getlistDialogLibrary("0"); //获取对话库（待共享）的列表
		//左侧列表（是否共享）功能切换
		element.on('tab(demo)', function(data) {
			//点击切换是所执行的方法,data.index代表不同的tab标签
			//alert(data.index);
			$("input[name=ab]").val("");
			getlistDialogLibrary(data.index);
			$("div.abilityInfos").attr("abilityInfos","")
		});
	})
})

//左侧列表切换时的背景颜色的改变
function l_list() {
	$("ul.l_list>li").bind("click", function() {
		$(this).addClass("active").siblings().removeClass("active");
		$(this).children("a").css("color", "#fff");
		$(this).siblings().children("a").css("color", "#666");
		initNavOrder();
		$("div.abilityInfos").attr("abilityInfos","")
		$("div.ysl_main").load("res/views/ability/abilityTable.html");
	})
}
//待共享的添加
$("button#addNewAbility_share").bind("click", function() {
	add();
})
//添加新能力弹框
function add() {
	layer.prompt({
		title: '添加新能力',
		formType: 0 /*input为text的文本框*/
	}, function(text, index) {
		//正则校验新能力
		var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/;
		if(!reg.test(text)) {
			layer.alert("新能力的名称只能是中文，英文，数字或者下划线");
			return false
		}
		if(text.length > 10) {
			layer.alert("新能力的名称不能超过10个字符");
			return false
		}
		getAjax($ctx + "addDialogLibraiy", {
			"idAc": $("input.user_name").val(),
			"atname": text
		}, 'post', function(data, status) {
			if(data.ret == 0) {
				layer.close(index);
				layer.msg('<span style="color:#fff">添加新能力成功</span>');
				var h1 = '';
				h1 = '<li class="layui-nav-item" id="' + data.returnData.id + '"><a href="javascript:void(0)">' + text + '</a></li>'
				$("#l_list_share").append(h1);
				/*if($("#l_list_share").children().length == 1) {
					$("#l_list_share").children("li:eq(0)").addClass("active");
					$("div.ysl_main").show();
					loadTable(1, 10, 1, 10);
				}*/
				getlistDialogLibrary("0");
				l_list(); //获取点击事件
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info);
			}
		})

	});

}

function getlistDialogLibrary(isShare) {
	getAjax($ctx + "listDialogLibrary", {
		"page": 1,
		"size": 16,
		"isShare": isShare, //第一次加载只显示不共享的的数据
		"idAc": $("input.user_name").val(),
		"atname": $("input[name=ab]").val()
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			initAbility(data, isShare)
			layui.use(['element', 'laypage', ], function() {
				var element = layui.element, //元素操作
					laypage = layui.laypage;
				laypage.render({
					elem: 'sharePage' + isShare,
					count: data.returnData.total,
					limit: 16,
					prev: "<",
					next: ">",
					jump: function(obj, first) {
						if(!first) {
							getAjax($ctx + "listDialogLibrary", {
								page: obj.curr,
								size: obj.limit,
								isShare: isShare, //第一次加载只显示不共享的的数据
								idAc: $("input.user_name").val(),
							}, 'post', function(data, status) {
								if(data.ret == 0) {
									initAbility(data, isShare)
								} else {
									layer.alert(data.info)
								}
							});
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

function initAbility(data, isShare) {
	$("div.ysl_main").data("curr1", "")
	if(data.returnData.list == "") {
		$("div.ysl_main").hide(); //如果左侧没有新能力，则右侧不显示
		if(isShare == 0) {
			$("ul#l_list_share").empty(); //清空未共享标签表单
		} else {
			$("ul#l_list_shared").empty(); //清空已共享标签表单
		}
		return false
	}
	//模拟渲染
	$("div.ysl_main").show();
	$("ul#l_list_share").empty(); //清空未共享标签表单
	$("ul#l_list_shared").empty(); //清空已共享标签表单
	var list = data.returnData.list;
	var li_Dialog = "";
	console.log(list)
	for(var i = 0; i < list.length; i++) {
		if(i == 0) {
			var className = "active";
		} else {
			var className = "";
		}
		li_Dialog = "<li id='" + list[i].id + "' class='" + className + "'><a href='javascript:void(0)'>" + list[i].atname + "</a></li>";
		//0---不共享，1---已共享
		if(isShare == "0") {
			$("ul#l_list_share").append(li_Dialog);
		} else if(isShare == "1") {
			$("ul#l_list_shared").append(li_Dialog);
		}
	}
	l_list(); //获取点击事件
	/*if($("input.abilityState").attr("state") == "add") {
		$("div.ysl_main").load("res/views/ability/sanswer.html");
		return false
	}*/
	$("div.ysl_main").load("res/views/ability/abilityTable.html")
}
//查询对话库
$("input[name=ab]").keydown(function(event) {
	if(event.keyCode == 13) {
		var isShare = $("ul.ulOrder>li.layui-this").attr("share")
		getlistDialogLibrary(isShare);
		return false
	}
})
$("i#s_ability").bind("click", function() {
	var isShare = $("ul.ulOrder>li.layui-this").attr("share")
	getlistDialogLibrary(isShare)
})
$("img#closeBtn").bind("click", function() {
	hideLeft()
})