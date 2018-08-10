$(function() {
	addKey(); //添加关键词
	keyMatch(); //关键词匹配
	initInputtags();
	crash();
	searchKeyWordType();
	getAnswer();
	//获取要修改内容的数据(isI=2 固定回答，isI=3 接口回答)
	if(localStorage.getItem("isI") == 2) {
		getAjax($ctx + "getFixedDialogByIdD", {
			"idD": localStorage.getItem("idD")
		}, "post", function(data, status) {
			if(data.ret == 0) {
				if(localStorage.getItem("aptype") == 1) { //模糊匹配
					$("li[aptype=1]").addClass("layui-this");
					$("li[aptype=2]").remove();
					$("div.mohuMain").addClass("layui-show")
					$("div.keyMain").removeClass("layui-show");
					//模糊匹配的问题列表展示
					var m_answer = data.returnData.dialogMan;
					var mHTML = "";
					for(var i = 0; i < m_answer.length; i++) {
						mHTML = '<div class="vague_list"><input name="title" questionId="' + m_answer[i].id + '" lay-verify="title" autocomplete="off" placeholder="请输入问题" class="layui-input mohu" type="text" value="' + zhuanyi(m_answer[i].aword) + '"><button class="vague_delete layui-btn layui-btn-primary"><i class="layui-icon">&#xe640;</i>删除</button></div>'
						$("div.vague_msgs").append(mHTML);
						delAwords() //删除
					}
				} else if(localStorage.getItem("aptype") == 2) { //关键词匹配
					$("li[aptype=2]").addClass("layui-this");
					$("li[aptype=1]").remove();
					$("div.keyMain").addClass("layui-show")
					$("div.mohuMain").remove();
					var key_answer = data.returnData.dialogMan;
					keyword(key_answer);

				}
				if(localStorage.getItem("isI") == 2) { //固定回答
					$("li#fixedAnswer").addClass("layui-this");
					$("li#interAnswer").hide();
					$("div.fixeddiv").addClass("layui-this");
					$("div.interDiv").removeClass("layui-show");
					var fixed_answer = data.returnData.dialogRobotStatic;
					var fixedHtml = "";
					for(var i = 0; i < fixed_answer.length; i++) {
						fixedHtml = '<div class="vague_list1"><input name="title" answerId="' + fixed_answer[i].id + '" lay-verify="title" autocomplete="off" placeholder="请输入固定回答" class="layui-input fixed_answer" type="text" value="' + zhuanyi(fixed_answer[i].answer) + '"><button class="vague_delete layui-btn layui-btn-primary"><i class="layui-icon">&#xe640;</i>删除</button></div>'
						$("div.vague_answer").append(fixedHtml);
						delAwords()
					}
					//脚本信息
					var scripts = data.returnData.dialogAnswerScript;
					for(var i = 0; i < scripts.length; i++) {
						var footMsg = scripts[i].scripts;
						$("div.footer1").find("textarea").val(footMsg);
						$("div.footer1").find("textarea").attr("scriptId", scripts[i].id)
					}
				} else if(localStorage.getItem("isI") == 3) { //接口回答
					$("li#interAnswer").addClass("layui-this");
					$("li#fixedAnswer").hide();
					$("div.interDiv").addClass("layui-show");
					$("div.fixeddiv").remove()
				}
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
		})
	} else if(localStorage.getItem("isI") == 3) {
		getAjax($ctx + "getIDialogByIdD", {
			"idD": localStorage.getItem("idD")
		}, "post", function(data, status) {
			if(data.ret == 0) {
				$("li[aptype=2]").addClass("layui-this");
				$("li[aptype=1]").remove();
				$("div.keyMain").addClass("layui-show")
				$("div.mohuMain").remove();
				$("li#interAnswer").addClass("layui-this");
				$("li#fixedAnswer").remove();
				$("div.interDiv").addClass("layui-show");
				$("div.fixeddiv").remove();
				var key_answer = data.returnData.dialogMan;
				console.log(key_answer)
				keyword(key_answer); //关键词匹配
				var scripts = data.returnData.dialogAnswerScript;
				for(var i = 0; i < scripts.length; i++) {
					if(scripts[i].stype == 1) {
						$("input[type=radio]:eq(0)").attr("checked", "checked");
						layui.use(['element', 'form', 'layer'], function() {
							var element = layui.element, //元素操作
								form = layui.form;
							form.render();
						})
					} else if(scripts[i].stype == 2) {
						$("input[type=radio]:eq(1)").attr("checked", "checked");
						layui.use(['element', 'form', 'layer'], function() {
							var element = layui.element, //元素操作
								form = layui.form;
							form.render();
						})
					} else {
						$("input[type=radio]:eq(2)").attr("checked", "checked")
						var scriptHTML = '';
						for(var i = 0; i < scripts.length; i++) {
							var scriptHTML = '<div class="layui-input-block radioDiv">' +
								'<div class="t0 script_t0"><input type="text" class="layui-input" placeholder="返回参数" value="' + scripts[i].repara + '"></div>' +
								'<form class="footForm layui-form" action="">' +
								'<select name="modules" lay-verify="required" lay-search="">' +
								'<option value="1">包含</option><option value="2">不包含</option><option value="3">等于</option><option value="4">不等于</option>' +
								'</select>' +
								'</form>' +
								'<div class="nearInput1 input" near="' + scripts[i].sinword.replace(/,/g, '|') + '"><input type="text" value="' + scripts[i].sinword.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" /></div>' +
								'<textarea placeholder="请输入内容" class="layui-textarea ta"></textarea>' +
								'<i class="layui-icon crash crashfoot" style="color:red;margin-left:10px">&#xe640;</i>' +
								'</div>'
							$("div.footer div.vague_btn").before(scriptHTML);
							$("div.vague_btn").show()
							layui.use(['element', 'form', 'layer'], function() {
								var element = layui.element, //元素操作
									form = layui.form;
								form.render();
							})
							rankTrande(scripts[i].sin)
							$('div.nearInput1>input').tagsinput()
							$('div.nearInput1>input').on('itemAdded', function(event) {
								var a = $(this).val().replace(/,/g, '|');
								$(this).parent().attr("near", a)
							});
							$('div.nearInput1>input').on('itemRemoved', function(event) {
								var a = $(this).val().replace(/,/g, '|');
								$(this).parent().attr("near", a)
							});
							$("i.crashfoot").bind("click", function() {
								$(this).parent().remove();
							})
							$("div.radioDiv").find("textarea").val(scripts[i].scripts);
							$("div.radioDiv").find("textarea").attr("scriptId", scripts[i].id)
						}
					}
				}

				var dialogRobotInter = data.returnData.dialogRobotInter; //接口应答、

				for(var j = 0; j < dialogRobotInter.length; j++) {
					//接口列表的值
					/*var iDdi = dialogRobotInter[j].idDi;
					console.log(iDdi)*/
					//接口应答的id
					$("#interList").attr("answerId", dialogRobotInter[j].id);
					//接口名称
					$("#interList").val(dialogRobotInter[j].explains);
					//接口应答的iDdi
					$("#interList").attr("idDi", dialogRobotInter[j].idDi);
					//获取对应的参数列表 paramName
					rankList(dialogRobotInter[j].paramName)
				}
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info);
			}
		})
		getAnswer()
	}

	layui.use(['element', 'form', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		form.on('radio(erweima)', function(data) {
			//alert(data.value);//判断单选框的选中值 
			if(data.value == 1 || data.value == 2) {
				$("div.radioDiv").hide();
				$("div.footer").find("div.vague_btn").hide();
			} else {
				$("div.radioDiv").show();
				$("div.footer").find("div.vague_btn").show();
				initFoot()
			}
		})
		//在接口问答中增加脚本
		$("button#add_foot").bind("click", function() {
			initFoot()
		})
	})
})
//渲染脚本列表
function initFoot() {
	var scriptHTML = '<div class="layui-input-block radioDiv">' +
		'<div class="t0 script_t0"><input type="text" class="layui-input" placeholder="返回参数"></div>' +
		'<form class="footForm layui-form" action="">' +
		'<select name="modules" lay-verify="required" lay-search="">' +
		'<option value="1" selected="">包含</option><option value="2">不包含</option><option value="3">等于</option><option value="4">不等于</option>' +
		'</select>' +
		'</form>' +
		'<div class="nearInput1 input"><input type="text" class="layui-input" data-role="tagsinput" /></div>' +
		'<textarea placeholder="请输入内容" class="layui-textarea ta"></textarea>' +
		'<i class="layui-icon crash crashfoot" style="color:red;margin-left:10px">&#xe640;</i>' +
		'</div>'
	$("div.footer div.vague_btn").before(scriptHTML);
	layui.use(['element', 'form', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		form.render();
	})

	$('div.nearInput1>input').tagsinput()
	$('div.nearInput1>input').on('itemAdded', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).parent().attr("near", a)
	});
	$('div.nearInput1>input').on('itemRemoved', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).parent().attr("near", a)
	});
	$("div.bootstrap-tagsinput").find("input").show();
	$("i.crashfoot").bind("click", function() {
		$(this).parent().remove();
	})
}
//
function rankList(paramName) {
	if(paramName.indexOf("|") != -1) {
		//没有竖线
		var paramName = paramName.replace(/[\s\|]/g, ",").split(",")
	} else {
		//有竖线
		var paramName = paramName.replace(/[\s\|]/g, ",").split(",")
	}
	if(paramName == "") {
		$("div.inter").hide();
	} else {
		$("div.inter").show();
		$("div.inter").empty();
		var wHTML = "";
		for(var i = 0; i < paramName.length; i++) {
			wHTML = '<div class="ilert_List"><div class="t0 inter_t0">' + paramName[i] + '</div>' +
				'<div class="t2">=</div>' +
				'<div class="t4">' +
				'<div class="div_input">' +
				'<input type="text" class="layui-input key_answer" placeholder="关键词" paramName="' + paramName[i] + '" readonly>' +
				'</div>' +
				'<div class="div_ul">' +
				'</div>' +
				'</div></div>'
			$("div.inter").append(wHTML);
		}
	}
	getAnswer();
	initDropDown()
	$("div.searchDiv").bind("click", function(event) {
		event.stopPropagation();
	})
	/*console.log(paramName)*/
	/*getAjax($ctx + "listInterDataByPage", {
		idAc: $("input.user_name").val(),
		page: 1,
		size: 10,
		explains: ""
	}, "get", function(data, status) {
		if(data.ret == 0) {
			var list = data.returnData.list;
			for(var i = 0; i < list.length; i++) {
				var searchLi = "";
				searchLi = '<li  idDi="' + list[i].id + '" paramName="' + list[i].paramName + '">' + list[i].explains + '</li>';
				$("div.searchDiv>ul").append(searchLi);
				if(iDdi == list[i].id) {
					$("input#interList").val(list[i].explains);
					$("input#interList").attr("idDi", list[i].id)
					$("input#interList").attr("paraname", list[i].paramName)
					if($("input#interList").attr("paraname") == "") {
						$("div.inter").hide();
					} else {
						$("div.inter").show();
						$("div.inter").empty();
						var wHTML = "";
						var paraName = $("input#interList").attr("paraname");
						var arr = paraName.split("|");
						for(var j = 0; j < arr.length; j++) {
							wHTML = '<div class="ilert_List"><div class="t0 inter_t0">' + arr[j] + '</div>' +
								'<div class="t2">=</div>' +
								'<div class="t4">' +
								'<div class="div_input">' +
								'<input type="text" class="layui-input key_answer" placeholder="关键词" paramName="' + arr[j] + '" readonly>' +
								'</div>' +
								'<div class="div_ul">' +
								'</div>' +
								'</div></div>'
							$("div.inter").append(wHTML);

						}
						getAnswer()
					}
				}

			}
			initDropDown()
			$("div.searchDiv").bind("click", function(event) {
				event.stopPropagation();
			})
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})*/
}
//渲染下拉列表
function initDropDown() {
	var keyLength = $("input.key").length;
	var keyAnswerLength = $("input.key_answer").length;
	var arr1 = []; //含有大括号的关键词的paramName
	var arr2 = [];
	for(var i = 0; i < keyLength; i++) {
		var keymsg = $("input.key:eq(" + i + ")").val();
		if(keymsg.indexOf("{") != -1) {

			if($("input.key:eq(" + i + ")").attr("paramname") == "undefined" || $("input.key:eq(" + i + ")").attr("paramname") == undefined) {

			} else {
				arr1.push($("input.key:eq(" + i + ")").attr("paramname") + "|" + $("input.key:eq(" + i + ")").attr("groupcnname"))
			}

		}
	}
	console.log("arr1:" + arr1)
	for(var i = 0; i < $("div.t0").length; i++) {
		for(var j = 0; j < arr1.length; j++) {
			if($("div.t0:eq(" + i + ")").html() == arr1[j].split("|")[0]) {
				$("div.t0:eq(" + i + ")").attr("groupcnname", arr1[j].split("|")[1])
				//$("input.key_answer[paramname=" + arr1[j].split("|")[1] + "]").attr("groupcnname",arr1[j].split("|")[1]);
				arr1.splice(arr1.indexOf(arr1[j]), 1)
				console.log(arr1)
				break;
			} else {
				$("div.t0:eq(" + i + ")").attr("groupcnname", "")
			}
		}

	}
	for(var i = 0; i < $("div.t0").length; i++) {
		/*		alert($("div.t0:eq("+i+")").attr("groupcnname"))*/
		if($("div.t0:eq(" + i + ")").attr("groupcnname") == "undefined" || $("div.t0:eq(" + i + ")").attr("groupcnname") == undefined || $("div.t0:eq(" + i + ")").attr("groupcnname") == "") {
			$("input.key_answer:eq(" + i + ")").val("");
		} else {
			$("input.key_answer:eq(" + i + ")").val("{" + $("div.t0:eq(" + i + ")").attr("groupcnname") + "}");
			$("input.key_answer:eq(" + i + ")").attr("groupcnname", $("div.t0:eq(" + i + ")").attr("groupcnname"))
		}

	}
}
//渲染“接口”的下拉列表
function rankTrande(sin) {
	var enterData = $("div.layui-layout-body").data("enter_str");
	$("form.footForm").find("dd").removeClass('layui-this');
	$("form.footForm dd").each(function() {
		if(sin == $(this).attr("lay-value")) {
			var intradeOptionId = $(this).attr("lay-value");
			$("form.footForm").find("div input").val($(this).html());
			$(this).addClass('layui-this');
			$(this).siblings().removeClass('layui-this');
		}
	})
}
//修改关键词的匹配
function keyword(key_answer) {
	var pageNum = 0;
	for(var i = 0; i < key_answer.length; i++) {
		var page1 = pageNum,
			page2 = pageNum + 1,
			page3 = pageNum + 2,
			page4 = pageNum + 3,
			page5 = pageNum + 4
		var keyList = '<div class="key_msgs" listid="' + key_answer[i].id + '"><p class="keyword"><span>关键词</span><i class="layui-icon crash crashAll">&#xe640;</i></p><div class="keyWorldList">' +
			'<div class="singleKeyWorld" near="' + key_answer[i].aword1near.replace(/,/g, '|') + '"><div class="input"><span>1.</span><input type="text"  class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page1 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" value="' + key_answer[i].aword1near.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld" near="' + key_answer[i].aword2near.replace(/,/g, '|') + '"><div class="input"><span>2.</span><input type="text"  class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text"  name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page2 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" value="' + key_answer[i].aword2near.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld" near="' + key_answer[i].aword3near.replace(/,/g, '|') + '"><div class="input"><span>3.</span><input type="text"  class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page3 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" value="' + key_answer[i].aword3near.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld" near="' + key_answer[i].aword4near.replace(/,/g, '|') + '"><div class="input"><span>4.</span><input type="text"  class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page4 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" value="' + key_answer[i].aword4near.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld" near="' + key_answer[i].aword5near.replace(/,/g, '|') + '"><div class="input"><span>5.</span><input type="text"  class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page5 + '" class="page"></div></div></div><div class="nearInput input"><input type="text" value="' + key_answer[i].aword5near.replace(/[\s\|]/g, ",") + '" class="layui-input" data-role="tagsinput" placeholder="同义词/近义词"/><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'</div></div>'
		$("div.keyWorldList_btn").before(keyList);
		$('div.nearInput>input').tagsinput()
		$('div.nearInput>input').on('itemAdded', function(event) {
			var a = $(this).val().replace(/,/g, '|');
			$(this).parent().parent().attr("near", a)
		});
		pageNum = pageNum + 5;
		$('div.nearInput>input').on('itemRemoved', function(event) {
			var a = $(this).val().replace(/,/g, '|');
			$(this).parent().parent().attr("near", a)
		});
		crash();
		keyMatch();
		searchKeyWordType()
		$("i.crashAll").bind("click", function() {
			$(this).parent().parent().remove()
		})
		if(key_answer[i].aword1type == 2) { //变化
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(0)").attr("groupCnName", key_answer[i].aword1dyna);
			if(key_answer[i].aword1dyna == "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(0)").val("");
			} else {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(0)").val("{" + key_answer[i].aword1dyna + "}")
			}
			if(key_answer[i].aword1para != "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(0)").attr("paramname", key_answer[i].aword1para);
			}
		} else if(key_answer[i].aword1type == 1) { //固定
			$("div.keyWorldList:eq(" + i + ")").find("div.nearInput:eq(0)").css("display", "inline-block");
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(0)").val(key_answer[i].aword1)
		}
		if(key_answer[i].aword2type == 2) { //变化
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").attr("groupCnName", key_answer[i].aword2dyna);
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").val("{" + key_answer[i].aword2dyna + "}")
			if(key_answer[i].aword2dyna == "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").val("");
			} else {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").val("{" + key_answer[i].aword2dyna + "}")
			}
			if(key_answer[i].aword2para != "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").attr("paramname", key_answer[i].aword2para);
			}
		} else if(key_answer[i].aword2type == 1) { //固定
			$("div.keyWorldList:eq(" + i + ")").find("div.nearInput:eq(1)").css("display", "inline-block");
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(1)").val(key_answer[i].aword2)
		}
		if(key_answer[i].aword3type == 2) { //变化
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").attr("groupCnName", key_answer[i].aword3dyna);
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").val("{" + key_answer[i].aword3dyna + "}")
			if(key_answer[i].aword3dyna == "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").val("");
			} else {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").val("{" + key_answer[i].aword3dyna + "}")
			}
			if(key_answer[i].aword3para != "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").attr("paramname", key_answer[i].aword3para);
			}
		} else if(key_answer[i].aword3type == 1) { //固定
			$("div.keyWorldList:eq(" + i + ")").find("div.nearInput:eq(2)").css("display", "inline-block");
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(2)").val(key_answer[i].aword3)
		}
		if(key_answer[i].aword4type == 2) { //变化
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").attr("groupCnName", key_answer[i].aword4dyna);
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").val("{" + key_answer[i].aword4dyna + "}")
			if(key_answer[i].aword4dyna == "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").val("");
			} else {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").val("{" + key_answer[i].aword4dyna + "}")
			}
			if(key_answer[i].aword4para != "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").attr("paramname", key_answer[i].aword4para);
			}
		} else if(key_answer[i].aword4type == 1) { //固定
			$("div.keyWorldList:eq(" + i + ")").find("div.nearInput:eq(3)").css("display", "inline-block");
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(3)").val(key_answer[i].aword4)

		}
		if(key_answer[i].aword5type == 2) { //变化
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").attr("groupCnName", key_answer[i].aword5dyna);
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").val("{" + key_answer[i].aword5dyna + "}")
			if(key_answer[i].aword5dyna == "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").val("");
			} else {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").val("{" + key_answer[i].aword5dyna + "}")
			}
			if(key_answer[i].aword5para != "") {
				$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").attr("paramname", key_answer[i].aword5para);
			}
		} else if(key_answer[i].aword5type == 1) { //固定
			$("div.keyWorldList:eq(" + i + ")").find("div.nearInput:eq(4)").css("display", "inline-block");
			$("div.keyWorldList:eq(" + i + ")").find("input.key:eq(4)").val(key_answer[i].aword5)
		}
	}
	$("div.bootstrap-tagsinput").find("input").show();
}
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
//鼠标点击空白地方的时候下拉框隐藏
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
//2.删除
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
		$(this).click(function() {
			$("input.key").keyup(function(event) {
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
						/*$(this).parent().siblings().css("display", "none");
						$(this).parent().next().find("input[data-role=tagsinput]").tagsinput('removeAll');
						$(this).parent().parent().attr("near", "")*/
					}
					$("div.bootstrap-tagsinput").find("input").show();
				}
			})
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
		$("div.dropDown").find("ul.ullist").empty();
		if(data.ret == 0) {
			initWord(data)
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
									initWord(data)
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

function initWord(data) {
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
	$("button#add_key").bind("click", function() {
		var pageNum = $("input.key").length;
		if($("div.key_msgs").length > 4) {
			layer.alert("关键词最多只能添加5项");
			return false
		}
		var page1 = pageNum,
			page2 = pageNum + 1,
			page3 = pageNum + 2,
			page4 = pageNum + 3,
			page5 = pageNum + 4;
		var keyList = '<div class="key_msgs"><p class="keyword"><span>关键词</span><i class="layui-icon crash crashAll">&#xe640;</i></p><div class="keyWorldList">' +
			'<div class="singleKeyWorld"><div class="input"><span>1.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon" class="layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page1 + '" class="page"></div></div></div><div class="input nearInput"><input type="text" class="layui-input tags" placeholder="同义词/近义词"><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>2.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon" class="layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page2 + '" class="page"></div></div></div><div class="input nearInput"><input type="text" class="layui-input tags" placeholder="同义词/近义词"><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>3.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon" class="layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page3 + '" class="page"></div></div></div><div class="input nearInput"><input type="text" class="layui-input tags" placeholder="同义词/近义词"><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>4.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon" class="layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page4 + '" class="page"></div></div></div><div class="input nearInput"><input type="text" class="layui-input tags" placeholder="同义词/近义词"><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'<div class="singleKeyWorld"><div class="input"><span>5.</span><input type="text" class="layui-input key" placeholder="关键词"><i class="layui-icon crash crash1">&#xe640;</i><div class="dropDown"><form class="layui-form" action=""><div class="searchInput"><input id="key" type="text" name="msg" placeholder="请输入关键字" autocomplete="off" class="layui-input"><i class="d_search_btn layui-icon" class="layui-icon"></i></div></form><ul class="ullist"></ul><div id="keyWordPage' + page5 + '" class="page"></div></div></div><div class="input nearInput"><input type="text" class="layui-input tags" placeholder="同义词/近义词"><i class="layui-icon crash crash2">&#xe640;</i></div></div>' +
			'</div></div>'
		$("div.keyWorldList_btn").before(keyList);
		//点击“垃圾桶”，清空文本框的内容
		crash();
		keyMatch();
		searchKeyWordType()
		$("i.crashAll").bind("click", function() {
			$(this).parent().parent().remove()
		})
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
					'<input type="text" class="layui-input key_answer" placeholder="关键词" paramName="' + arr[i] + '">' +
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

var editCheckIsSubmit = function() {
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
		var paramArr = [];
		if($("div.keyMain").children().length == 1) {
			layer.alert("请添加所需关键词");
			return false
		}

		if($("li#interAnswer").hasClass("layui-this")) {
			if($("input#interList").val() == "") {
				layer.alert("请选择一个接口列表");
				return false
			}
			if($("input[type=radio]:eq(2)").next().hasClass("layui-form-radioed") && $("div.footer").children().length == 2){
				layer.alert("您必须创建至少一条脚本信息");
				return false
			}
			if($("div.layui-form-radioed").prev().val() == 3) {
				for(var j = 0; j < $("div.radioDiv").length; j++) {
					var s = $("div.radioDiv:eq(" + j + ")");
					if(s.find("div.t0>input").val() == "") {
						layer.alert("返回参数不能为空");
						return false
					}
					if(s.find(".nearInput1").attr("near") == "" || s.find(".nearInput1").attr("near") == "undefined" || s.find(".nearInput1").attr("near") == undefined) {
						layer.alert("不能为空");
						return false
					}
					if(s.find("textarea.ta").val() == "") {
						layer.alert("脚本信息不能为空");
						return false
					}
					if(s.find("textarea.ta").val()!="" && !isJsonString(s.find("textarea.ta").val())) {
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
			console.log(paramArr)
			if(paramArr.length > 0) {
				var nary = paramArr.sort();
				for(var i = 0; i < nary.length; i++) {
					if(nary[i] == nary[i + 1]) {
						layer.alert("您在接口选项中的关键词匹配不能包含相同的值");
						return false
					}
				}

			}
		}
	}
}