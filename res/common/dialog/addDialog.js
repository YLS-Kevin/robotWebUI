$(function() {
	addKey(); //添加关键词
	keyMatch(); //关键词匹配
	initInputtags();
	crash();
	searchKeyWordType();
	layui.use(['element', 'form', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		form.render()
		element.on('tab(docDemoTabBrief)', function(data) {
			//点击切换是所执行的方法
			//alert(JSON.stringify(data));
			if(data.index == 1) {
				$("li#interAnswer").show();
			} else {
				$("li#interAnswer").hide();
				if($("div.interDiv").hasClass("layui-show")) {
					$("div.interDiv").removeClass("layui-show");
					$("div.fixeddiv").addClass("layui-show");
					$("li#fixedAnswer").addClass("layui-this");
					$("li#interAnswer").removeClass("layui-this");
				}
			}
		});
		form.on('radio(erweima)', function(data) {
			//alert(data.value);//判断单选框的选中值 
			if(data.value == 1 || data.value == 2) {
				$("div.radioDiv").hide();
				$("div.footer").find("div.vague_btn").hide();
			} else {
				$("div.radioDiv:eq(0)").show();
				$("div.radioDiv:eq(0)").next("div.radioDiv").remove();
				$("div.footer").find("div.vague_btn").show();
				$("div.t0>input").val("");
				$("textarea.ta").val("");
				$("div.radioDiv").find("input[data-role=tagsinput]").tagsinput('removeAll');
				$("div.radioDiv").attr("near", "")
				initInputtags();
				$("div.bootstrap-tagsinput").find("input").show();
			}
		})
		//在接口问答中增加脚本
		$("button#add_foot").bind("click", function() {
			var scriptHTML = '<div class="layui-input-block radioDiv">' +
				'<div class="t0 script_t0"><input type="text" class="layui-input" placeholder="返回参数"></div>' +
				'<form class="footForm layui-form" action="" lay-filter="">' +
				'<select name="modules" lay-verify="required" lay-search="">' +
				'<option value="1" selected="">包含</option><option value="2">不包含</option><option value="3">等于</option><option value="4">不等于</option>' +
				'</select>' +
				'</form>' +
				'<div class="nearInput1 input"><input type="text" class="layui-input" placeholder="" data-role="tagsinput"></div>' +
				'<textarea placeholder="请输入内容" class="layui-textarea ta"></textarea>' +
				'<i class="layui-icon crash crashfoot" style="color:red;margin-left:10px">&#xe640;</i>'+
				'</div>'
			$("div.footer div.vague_btn").before(scriptHTML);
			form.render("select");
			$(this).parent().prev().find('div.nearInput1>input').tagsinput()
			$(this).parent().prev().find('div.nearInput1>input').on('itemAdded', function(event) {
				var a = $(this).val().replace(/,/g, '|');
				$(this).parent().parent().attr("near", a)
			});
			$(this).parent().prev().find('div.nearInput1>input').on('itemRemoved', function(event) {
				var a = $(this).val().replace(/,/g, '|');
				$(this).parent().parent().attr("near", a)
			});
			$("div.bootstrap-tagsinput").find("input").show();
			$("i.crashfoot").bind("click",function(){
				$(this).parent().remove();
			})
		})
	})
})
//初始化inputtags
//初始化inputtags
function initInputtags() {
	$('input').on('itemAdded', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).parent().parent().attr("near", a)
		//alert(a)
		// event.item: contains the item
	});
	$('input').on('itemRemoved', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).parent().parent().attr("near", a)
		//alert(a)
		// event.item: contains the item
	});
}
//点击空白处隐藏下拉列表
$(document).on("click", function(event) {
	/*$("div.div_ul").each(function(index) {
		if($("div.div_ul:eq(" + index + ")").css("display") == "block") {
			$("div.div_ul").css("display", "none")
		}
	})
	if($("div.searchDiv").css("display") == "block") {
		$("div.searchDiv").css("display", "none")
	}*/
})
//模糊匹配的添加和删除
//1.添加
$("button#vague_add").bind("click", function() {
	var len = $("div.vague_list").length;
	if(len > 4) {
		layer.alert("您最多只能添加5项")
	} else {
		var inputHTML;
		inputHTML = '<div class="vague_list"><input name="title" lay-verify="title" autocomplete="off" placeholder="请输入问题" class="layui-input mohu" type="text"><button class="vague_delete layui-btn layui-btn-primary"><i class="layui-icon">&#xe640;</i>删除</button></div>'
		$("div.vague_msgs").append(inputHTML);
		delAwords() //删除
	}
})
//固定回答的添加和删除
//1.添加
$("button#add_answer").bind("click", function() {
	var len = $("div.vague_list1").length;
	if(len > 4) {
		layer.alert("您最多只能添加5项")
	} else {
		var inputHTML;
		inputHTML = '<div class="vague_list1"><input name="title" lay-verify="title" autocomplete="off" placeholder="请输入固定回答" class="layui-input fixed_answer" type="text"><button class="vague_delete layui-btn layui-btn-primary"><i class="layui-icon">&#xe640;</i>删除</button></div>'
		$("div.vague_answer").append(inputHTML);
		delAwords()
	}
})

function delAwords() {
	$("button.vague_delete").bind("click", function() {
		var $this = $(this);
		$this.parent().remove();
		layer.msg("<span style='color:#fff'>删除成功</span>")
	})
}
//关键词匹配
function keyMatch() {
	$("input.key").each(function(index) {
		var i = index
		$(this).keyup(function(event) {
			var str = $(this).val();
			if(str.indexOf("{") != -1) {
				//判断输入的值是否有大括号
				$(this).siblings("div.dropDown").css("display", "inline-block");
				$(this).parent().siblings().css("display", "none");
		        $(this).parent().next().find("input[data-role=tagsinput]").tagsinput('removeAll');
		        $(this).parent().parent().attr("near", "")				
				listDynaWordType(i)
			} else {
				if(str.length != 0) {
					$(this).siblings("div.dropDown").hide();
					$(this).parent().siblings().css("display", "inline-block");
					$(this).find("input").val("")
				}
				if(str.length == 0) {
					$(this).siblings("div.dropDown").hide();
					$(this).find("input").val("");
					//$(this).parent().siblings().css("display", "none");
					//$(this).parent().next().find("input[data-role=tagsinput]").tagsinput('removeAll');
					//$(this).parent().parent().attr("near", "")
				}
				$("div.bootstrap-tagsinput").find("input").show();
			}
		})
	})

}

function listDynaWordType(i) {
	getAjax($ctx + "listDynaWordType", {
		"idAc": $("input.user_name").val(),
		"page": 1,
		"size": 10,
		"groupName": $('div.searchInput>input:eq(' + i + ')').val()
	}, "get", function(data, status) {
		if(data.ret == 0) {
			initKeyword(data)
			layui.use(['element', 'laypage', ], function() {
				var element = layui.element, //元素操作
					laypage = layui.laypage;
				laypage.render({
					elem: 'keyWordPage' + i,
					count: data.returnData.total,
					limit: 10,
					prev: "<",
					next: ">",
					jump: function(obj, first) {
						if(!first) {
							getAjax($ctx + "listDynaWordType", {
								idAc: $("input.user_name").val(),
								"page": obj.curr,
								"size": obj.limit,
								"groupName": $('div.searchInput>input:eq(' + i + ')').val()
							}, 'get', function(data, status) {
								if(data.ret == 0) {
									initKeyword(data)
								} else if(data.ret == 20003) {
									layer.alert(data.info, function() {
										window.open("res/views/user/login.html", "_self");
									})
								} else {
									layer.alert(data.info)
								}
							})
						}

					}
				})
			})
			$("div.dropDown").bind("click", function(e) {
				e.stopPropagation()
			})
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}

function initKeyword(data) {
	$("ul.ullist").empty()
	var list = "";
	var group = data.returnData.list;
	for(var i = 0; i < group.length; i++) {
		list = '<li id="' + group[i].id + '" groupName_ch="' + group[i].groupName + '">{' + group[i].groupName + '}</li>';
		$("ul.ullist").append(list);
	}
	//点击li标签的值附属到文本框中
	$("ul.ullist>li").bind("click", function() {
		$(this).parents("div.dropDown").parent().find("input.key").val($(this).html());
		$(this).parents("div.dropDown").parent().find("input.key").attr("groupCnName", $(this).attr("groupName_ch"))
		$(this).parents("div.dropDown").hide();
		$(this).parents("div.dropDown").find("input").val("")
	})
}
//查询关键词
function getCaption(obj) {
	var index = obj.lastIndexOf("e");
	obj = obj.substring(index + 1, obj.length);
	return obj;
}

function searchKeyWordType() {
	//查询(按钮)
	$("div.searchInput>i").bind("click", function() {
		var index = getCaption($(this).parent().parent().parent().find("div.page").attr("id"));
		listDynaWordType(index)
	})
	//查询(回车)
	$('div.searchInput>input').keydown(function(event) {
		if(event.keyCode == 13) {
			var index = getCaption($(this).parent().parent().parent().find("div.page").attr("id"));
			listDynaWordType(index)
			return false;
		}
	});
}

//点击空白处的时候，搜索关键词的下拉框隐藏
$(document).click(function(e) {
	var _con = $("div.dropDown");
	if(!_con.is(e.target) && _con.has(e.target).length === 0) {
		$("div.dropDown").hide();
		$("div.dropDown").find("input").val("") //下拉框里面的搜索
	}
})
//添加关键词
function addKey() {
	var pageNum = 5;
	$("button#add_key").bind("click", function() {
		if($("div.key_msgs").length>4){
			layer.alert("关键词最多只能添加5项");
			return false
		}
		var page1 = pageNum + 0,
			page2 = pageNum + 1,
			page3 = pageNum + 2,
			page4 = pageNum + 3,
			page5 = pageNum + 4;
		var keyList = '<div class="key_msgs"><p class="keyword"><span>关键词</span><i class="layui-icon crash crashAll">&#xe640;</i></p><div class="keyWorldList">' +
			'<div class="singleKeyWorld"><div class="input"><span>1.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon">&#xe615;</i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page1 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" class="layui-input" value="" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>2.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon">&#xe615;</i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page2 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" class="layui-input" value="" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>3.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon">&#xe615;</i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page3 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" class="layui-input" value="" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>4.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon">&#xe615;</i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page4 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" class="layui-input" value="" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>5.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon">&#xe615;</i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page5 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" class="layui-input" value="" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'</div></div>'
		$("div.keyWorldList_btn").before(keyList);
		pageNum = 1 + page5
		//点击“垃圾桶”，清空文本框的内容
		crash();
		keyMatch();
		$("i.crashAll").bind("click", function() {
			$(this).parent().parent().remove()
		})
		searchKeyWordType()
		$(this).parent().prev().find('div.nearInput>input').tagsinput()
		$(this).parent().prev().find('div.nearInput>input').on('itemAdded', function(event) {
			var a = $(this).val().replace(/,/g, '|');
			$(this).parent().parent().attr("near", a)
		});
		$(this).parent().prev().find('div.nearInput>input').on('itemRemoved', function(event) {
			var a = $(this).val().replace(/,/g, '|');
			$(this).parent().parent().attr("near", a)
		});
	})
}

//点击“垃圾桶”，清空文本框的内容
function crash() {
	$("i.crash1").bind("click", function() {
		$(this).prev().val("");
		$(this).prev().siblings("div.dropDown").hide();
		/*$(this).parent().siblings().css("display", "none");
		$(this).parent().next().find("input[data-role=tagsinput]").tagsinput('removeAll');
		$(this).parent().parent().attr("near", "")*/
		$(this).prev().find("input").val("")
	})
	$("i.crash2").bind("click", function() {
		$(this).prev().tagsinput('removeAll');
		$(this).parent().parent().attr("near", "")
	})

}

//获取接口列表
function getInterfaceList() {
	$("div.searchDiv>ul").empty();
	$("div.searchDiv").show();
	getAjax($ctx + "listInterDataByPage", {
		idAc: $("input.user_name").val(),
		page: 1,
		size: 5,
		explains: $('input#explains').val()
	}, "get", function(data, status) {
		if(data.ret == 0) {
			$("div.searchDiv>ul").empty();
			var list = data.returnData.list;
			initInterface(list)
			layui.use(['element', 'laypage', ], function() {
				var element = layui.element, //元素操作
					laypage = layui.laypage;
				laypage.render({
					elem: 'InterfacePage',
					count: data.returnData.total,
					limit: 5,
					prev: "<",
					next: ">",
					jump: function(obj, first) {
						if(!first) {
							getAjax($ctx + "listInterDataByPage", {
								idAc: $("input.user_name").val(),
								"page": obj.curr,
								"size": obj.limit,
								explains: $('input#explains').val()
							}, 'get', function(data, status) {
								if(data.ret == 0) {
									$("div.searchDiv>ul").empty();
									var list = data.returnData.list;
									initInterface(list)
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
		} else {
			layer.alert(data.info)
		}
	})
}

function initInterface(list) {
	for(var i = 0; i < list.length; i++) {
		var searchLi = "";
		searchLi = '<li  idDi="' + list[i].id + '" paramName="' + list[i].paramName + '">' + list[i].explains + '</li>';
		$("div.searchDiv>ul").append(searchLi)
	}
	$("div.searchDiv").bind("click", function(event) {
		event.stopPropagation();
	})
	$("div.searchDiv li").bind("click", function() {
		$("input#interList").val($(this).html());
		$("input#interList").attr("idDi", $(this).attr("idDi"))
		$("input#interList").attr("paraname", $(this).attr("paramName"))
		$("div.searchDiv").hide();
		if($("input#interList").attr("paraname") == "") {
			$("div.inter").hide();
		} else {
			$("div.inter").show();
			$("div.inter").empty();
			var wHTML = "";
			var paraName = $("input#interList").attr("paraname");
			var arr = paraName.split("|");
			for(var i = 0; i < arr.length; i++) {
				wHTML = '<div class="ilert_List"><div class="t0 inter_t0">' + arr[i] + '</div>' +
					'<div class="t2">=</div>' +
					'<div class="t4">' +
					'<div class="div_input">' +
					'<input type="text" class="layui-input key_answer" readonly placeholder="关键词" paramName="' + arr[i] + '">' +
					'</div>' +
					'<div class="div_ul">' +
					'</div>' +
					'</div></div>'
				$("div.inter").append(wHTML)
			}
			getAnswer()
		}
	})
}
//点击空白处的时候，接口列表的下拉框隐藏
$(document).click(function(e) {
	var _con1 = $("div.searchDiv");
	if(!_con1.is(e.target) && _con1.has(e.target).length === 0) {
		$("div.searchDiv").hide();
		$("input#explains").val("")
	}
})
$("input#interList").click(function(event) {
	event.stopPropagation()
	$("input#explains").val("")
	var _con = $("div.dropDown");
	if(!_con.is(event.target) && _con.has(event.target).length === 0) {
		$("div.dropDown").hide();
		$("div.dropDown").find("input").val("")
	}
	var _con2 = $("div.div_ul");
	if(!_con2.is(event.target) && _con2.has(event.target).length === 0) {
		$("div.div_ul").hide();
	}
	getInterfaceList()
})
//查询接口列表
$("input#explains").bind("keydown", function(event) {
	if(event.keyCode == 13) {
		getInterfaceList()
		return false;
	}
})
$("i.searchExplain").bind("click", function() {
	getInterfaceList()
})
//点击空白处的时候，关键词列表隐藏
$(document).bind("click", function(event) {
	var _con2 = $("div.div_ul");
	if(!_con2.is(event.target) && _con2.has(event.target).length === 0) {
		$("div.div_ul").hide();
	}
})

function getAnswer() {
	$("input.key_answer").bind("click", function(event) {
		event.stopPropagation()
		var _con = $("div.dropDown");
		if(!_con.is(event.target) && _con.has(event.target).length === 0) {
			$("div.dropDown").hide();
			$("div.dropDown").find("input").val("")
		}
		var _con2 = $("div.div_ul");
		if(!_con2.is(event.target) && _con2.has(event.target).length === 0) {
			$("div.div_ul").hide();
		}
		$(this).parent().next("div.div_ul").show();
		$(this).parent().next("div.div_ul").empty();
		var arrList = [];
		var new_arr = []
		for(var i = 0; i < $("input.key").length; i++) {
			if($("input.key:eq(" + i + ")").val().indexOf("{") != -1) {
				if($("input.key:eq(" + i + ")").attr("groupcnname") == "undefined" || $("input.key:eq(" + i + ")").attr("groupcnname") == undefined) {

				} else {
					arrList.push($("input.key:eq(" + i + ")").attr("groupcnname"))
				}

			} else {
				continue
			}
		}
		for(var i = 0; i < arrList.length; i++) {　　
			var items = arrList[i];　　
			if($.inArray(items, new_arr) == -1) {　　　　
				new_arr.push(items);　　
			}
		}
		for(var i = 0; i < new_arr.length; i++) {
			list = '<li groupName_ch="' + new_arr[i] + '">{' + new_arr[i] + '}</li>';
			$("div.div_ul").append(list);
		}
		//点击li标签的值附属到文本框中
		/*$("div.div_ul").bind("click", function(event) {
			event.stopPropagation()
		})*/
		$("div.div_ul li").bind("click", function(event) {
			event.stopPropagation()
			$(this).parent().prev().find("input.key_answer").val($(this).html());
			$(this).parent().prev().find("input.key_answer").attr("groupCnName", $(this).attr("groupName_ch"))
			$(this).parent().hide();
		})
	})
}

function match() {
	var keyLength = $("input.key").length;
	var keyAnswerLength = $("input.key_answer").length;
	var arr1 = [];
	var arr2 = [];
	for(var i = 0; i < keyLength; i++) {
		var keymsg = $("input.key:eq(" + i + ")").val();
		if(keymsg.indexOf("{") != -1) {
			arr1.push($("input.key:eq(" + i + ")").attr("groupcnname"));
		}
	}
	for(var j = 0; j < keyAnswerLength; j++) {
		arr2.push($("input.key_answer:eq(" + j + ")").attr("groupcnname"));
	}
	var arr3 = []; //输出arr1和arr2的共同出现的值
	var arr_param = [];
	for(var s in arr1) {
		for(var x in arr2) {
			if(arr1[s] == arr2[x]) {
				arr3.push(arr1[s]);
				var paramname = $("input.key_answer:eq(" + x + ")").attr("paramname");
				//alert("相同："+arr1[s]+"---"+paramname+"---"+arr2[x])
				$("input.key[groupcnname=" + arr1[s] + "]").attr("paramname", paramname);
				break
			} else {
				var paramname = $("input.key_answer:eq(" + x + ")").attr("paramname");
				$("input.key[groupcnname=" + arr1[s] + "]").attr("paramname", "");
				//alert("不同："+arr1[s]+"---"+paramname+"---"+arr2[x])
			}
		}
	}

}
var editCheckIsSubmit =function() {
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	var isInterface = $("div.part_two li.layui-this").attr("isInterface");	
	if(aptype == 1 && isInterface == 2) { 
		//判断标题项 
		if($("div.vague_msgs").children().length == 0) {
			layer.alert("建议您添加问题项");
			return false
		} else {
			for(var i = 0; i < $("input.mohu").length; i++) {
				if($("input.mohu:eq(" + i + ")").val() == "") {
					layer.alert("问题不能为空");
					return false
				}
				if($("input.mohu").val().length > 32) {
					layer.alert("问题不能超过32个字符");
					return false
				}
			}
		}
		//判断回答项
		if($("div.vague_answer").children().length == 0) {
			layer.alert("建议您添加固定回答");
			return false
		} else {
			for(var i = 0; i < $("input.fixed_answer").length; i++) {
				if($("input.fixed_answer:eq(" + i + ")").val() == "") {
					layer.alert("固定回答不能为空");
					return false
				}
				if($("input.fixed_answer").val().length > 1024) {
					layer.alert("固定回答不能超过1024个字符");
					return false
				}
			}
		}
		if($("textarea#script").val() != "" && !isJsonString($("textarea#script").val())) {
			layer.alert("脚本信息必须为json格式的数据");
			return false
		}
	} else if(aptype == 2 && isInterface == 2) { 
		var add_msg = $("div.keyWorldList").find("input").val();
		if($("div.keyMain").children().length == 1) {
			layer.alert("请添加所需关键词");
			return false
		}
		//判断回答项
		if($("div.vague_answer").children().length == 0) {
			layer.alert("建议您添加固定回答");
			return false
		} else {
			for(var i = 0; i < $("input.fixed_answer").length; i++) {
				if($("input.fixed_answer:eq(" + i + ")").val() == "") {
					layer.alert("固定回答不能为空");
					return false
				}
				if($("input.fixed_answer").val().length > 1024) {
					layer.alert("固定回答不能超过1024个字符");
					return false
				}
			}
		}

		if($("textarea#script").val() != "" && !isJsonString($("textarea#script").val())) {
			layer.alert("脚本信息必须为json格式的数据");
			return false
		}
	} else if(aptype == 2 && isInterface == 3) { 
		var paramArr=[];
		if($("div.keyMain").children().length == 1) {
			layer.alert("请添加所需关键词");
			return false
		}
		if($("li#interAnswer").hasClass("layui-this")) {
			if($("input#interList").val() == "") {
				layer.alert("请选择一个接口列表");
				return false
			}
			if($("div.layui-form-radioed").prev().val() == 3) {
				for(var j = 0; j < $("div.radioDiv").length; j++) {
					var s = $("div.radioDiv:eq(" + j + ")");
					if(s.find("div.t0>input").val() == "") {
						layer.alert("返回参数不能为空");
						return false
					}
					if(s.attr("near") == "" || s.attr("near") == "undefined" || s.attr("near") == undefined) {
						layer.alert("不能为空");
						return false
					}
					if(s.find("textarea.ta").val() == "") {
						layer.alert("脚本信息不能为空");
						return false
					}
					if(s.find("textarea.ta").val() != "" && !isJsonString(s.find("textarea.ta").val())) {
						layer.alert("脚本信息必须为json格式的数据");
						return false
					}
				}
			}
		}
		if($("div.inter").children().length != 0) {
			for(var i = 0; i < $("input.key_answer").length; i++) {
				if($("input.key_answer:eq(" + i + ")").attr("groupcnname") == "undefined" || $("input.key_answer:eq(" + i + ")").attr("groupcnname") == undefined) {

				} else {
					paramArr.push($("input.key_answer:eq(" + i + ")").attr("groupcnname"));
				}

			}
			if(paramArr.length > 0) {
				var nary=paramArr.sort();				
				for(var i = 0; i < nary.length; i++) {
					if (nary[i]==nary[i+1]){
						layer.alert("您在接口选项中的关键词匹配不能包含相同的值");
						return false
					}
				}

			}
		}
	}
}