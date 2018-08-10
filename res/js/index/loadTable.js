$(function() {
	var searchObj = {};
	if($("div.searchInfos").attr("searchInfos") == "" || $("div.searchInfos").attr("searchInfos") == "undefined" || $("div.searchInfos").attr("searchInfos") == undefined) {
		var curnum = 1;
	} else {
		var s = JSON.parse($("div.searchInfos").attr("searchInfos"));
		var curnum = s.pageCurr;
		$("input#typename").val(s.state)
		$("input#s_key").val(s.keyWord);
		if(s.isI == 2) {
			$("div.panel-right").find("input[type=checkbox]").prop("checked", false);
		} else if(s.isI == 3) {
			$("div.panel-right").find("input[type=checkbox]").prop("checked", true);
		}
		$("select[name=state]").val($("input#typename").val())
		layui.use(['element', 'form'], function() {
			var element = layui.element, //元素操作
				form = layui.form;
			form.render();
		})
	}
	$("p.order_title").html($("div.secondOrder li.active").html())
	var limitcount = 10;
	info(curnum, limitcount);
})
//添加单轮对话
$("button#addAnswer").bind("click", function() {
	init();
	localStorage.setItem("iddts", $("li.active").attr("idDts"));
	localStorage.setItem("cname", $("span.t1>a").html());
	$("#changeLink").load("res/views/index/addDialog.html")
})
//获取机器人模块信息
function info(curnum, limitcount) {
	if($("div.panel-right .layui-form-checkbox").hasClass("layui-form-checked")) {
		var isI = 3
	} else {
		var isI = 2
	}
	getAjax($ctx + "getRobotInfoByIdAndMid", {
		"cid": localStorage.getItem("cid"),
		"idM": $("div.secondOrder li.active").attr("idM"),
		"iscommon": $("div.secondOrder li.active").attr("iscommon"),
		"sizeSingle": limitcount,
		"pageSingle": curnum,
		"stateDialog": $("div.panel-right dd.layui-this").attr("lay-value"),
		"descSingle": "desc",
		"descSingleCol": "updateDate",
		"keyword": $("input#s_key").val(),
		"isI": isI
	}, "get", function(data, status) {
		if(data.ret == 0) {
			//新能力的列表
			var abalityList = data.returnData.abalityList
			$("div.abilityList ul").empty();
			for(var i = 0; i < abalityList.length; i++) {
				var li = '';
				var first = abalityList[i].atname.charAt(0)
				li = '<li id="' + abalityList[i].id + '"><span class="title">' + first + '</span><span class="name"><span>' + abalityList[i].atname + '</span></span></li>'
				$("div.abilityList ul").append(li);
			}
			initBG();
			//行业接口异常返回的答案
			var expAnswer = data.returnData.expAnswer;
			$("input[name=catch]").val(expAnswer);
			//找不到对话返回的答案
			var noAnswer = data.returnData.noAnswer;
			$("input[name=none]").val(noAnswer);
			//机器人图标
			if(data.returnData.iconurl == "") {
				var imgSrc = "./res/image/index/robotIcon.png";
			} else {
				var imgSrc = data.returnData.iconurl
			}
			$("div.showImg").empty().append("<img src='" + imgSrc + "' class='layui-upload-img'>")
			//触发关键字
			var dokey = data.returnData.dokey;
			$("input.dokeyId").attr("dialogId", data.returnData.dialogId)
			loadTable(curnum, limitcount, data.returnData);
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}

function loadTable(curnum, limitcount, data) {
	var dialog = data.dialogId;
	layui.use(['table', 'element', 'form', 'laypage', 'layer'], function() {
		var table = layui.table,
			element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		form.render(); //表单的初始化
		var total = data.singleList.total;
		//单轮问答表格展示	
		table.render({
			elem: '#s-answer-grid',
			data: data.singleList.list,
			cols: [
				[ //表头
					{
						type: "numbers",
						title: '序号'
					}, {
						field: 'isI',
						title: '调用接口',
						width: 110,
						unresize: true,
						templet: function(d) {
							if(d.isI == 3) {
								//接口回答
								return '<span><img src="res/image/ability/wdnl_lj.png"></span>'
							} else if(d.isI == 2) {
								//固定回答
								return '<span><img src="res/image/ability/wdnl_mz.png"></span>'
							}
						}
					}, {
						field: 'keyword',
						title: '问题/关键词',
						unresize: true,
						templet: function(d) {
							if(d.aptype == 1) { //模糊匹配
								return '<p class="dot" title="' + d.aword + '">' + d.aword + '</p>'
							} else {
								return '<p class="dot" title="' + d.keyWord + '">' + d.keyWord + '</p>'
							}
						}
					}, {
						field: 'answer',
						title: '答案',
						unresize: true,
						templet: function(d) {
							if(d.answer.length>60){
								return '<p class="normal" title="' + d.answer + '">' + d.answer.substring(0,60) + '...</p>'
							}else{
								return '<p class="normal" title="' + d.answer + '">' + d.answer + '</p>'
							}
							
						}
					}, {
						field: 'updateDate',
						title: '修改时间',
						unresize: true,
						width: 170,
					}, {
						field: 'state',
						title: '启用/禁用',
						templet: '#switchTpl',
						unresize: true,
						width: 100,
					}, {
						field: 'modify',
						title: '修改',
						unresize: true,
						width: 60,
						templet: '<div><a href="javascript:void(0)" class="table_edit" lay-event="edit" name="修改问答 ">修改</a></div>'
					}, {
						field: "delete",
						title: '删除',
						width: 60,
						unresize: true,
						templet: '<div><a href="javascript:void(0)" class="table_delete" lay-event="delete">删除</a></div>'
					}
				]
			],
			page: false,
			id: "table1",
			done: function(res, curr, count) {
				//如果是异步请求数据方式，res即为你接口返回的信息。  
				//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度  
				laypage.render({
					elem: 'page1',
					count: total,
					curr: curnum,
					limit: limitcount,
					layout: ['prev', 'page', 'next', 'skip', 'count'],
					jump: function(obj, first) {
						if(!first) {
							curnum = obj.curr;
							limitcount = obj.limit;
							info(curnum, limitcount)
						}
					}
				})
			}
		})
		//单轮对话监听"启用/禁用"操作
		form.on('switch(state1)', function(obj) {
			if(obj.elem.checked == true) { //是主键    
				var state = 1
			} else {
				var state = 2
			}
			var ids = [],
				idObj = new Object();
			idObj.id = this.value;
			ids.push(idObj);
			getAjax($ctx + "modifyFixedDialogByState", {
				"ids": JSON.stringify(ids),
				"state": state
			}, 'post', function(data, status) {
				if(data.ret == 0) {
					return false
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
		});
		//表格1的编辑和删除
		table.on('tool(demo1)', function(obj) {
			var data = obj.data;
			if(obj.event === 'delete') {
				if(dialog == data.id) {
					layer.alert("该条数据不能被删除！");
					layer.close();
				} else {
					layer.confirm('您确定要删除该数据吗？', function(index) {
						getAjax($ctx + "delFixedDialog", {
							id: data.id
						}, "post", function(data, status) {
							if(data.ret == 0) {
								layer.alert("删除成功");
								obj.del();
								layer.close();
								var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
								var dataIndex = $(obj.tr[0]).attr("data-index"); // 获取tr的data-index属性的值验证是否是当前页的第一条
								if($("#s-answer-grid").next().find("tr").length == 1) { // 如是当前页的第一条数据
									curr = curr - 1
								} else {
									curr = curnum
								}
								info(curnum, limitcount);
								console.log(curr);
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

			} else if(obj.event === 'edit') {
				localStorage.setItem("cname", $("span.t1>a").html()); //1是模糊匹配
				localStorage.setItem("aptype", data.aptype); //1是模糊匹配
				localStorage.setItem("isI", data.isI);
				localStorage.setItem("idD", data.id);
				localStorage.setItem("iddts", $("li.active").attr("idDts"));
				init()
				$("#changeLink").load("res/views/index/modifyDialog.html")
			}
		})
	})
}

//渲染不同的列表的背景色
function initBG1() {
	var li = $("div.allAbility li");
	for(var i = 0; i < li.length; i++) {
		var title = $("div.allAbility li:eq(" + i + ")").find("span.title");
		var name = $("div.allAbility li:eq(" + i + ")").find("span.name");
		if(i % 4 == 0) {
			title.css("background-color", "#79A3FF")
			name.css("background-color", "rgba(121,163,255,0.2)")
		} else if(i % 4 == 1) {
			title.css("background-color", "#FD8DA3");
			name.css("background-color", "rgba(253,141,163,0.2)");
		} else if(i % 4 == 2) {
			title.css("background-color", "#B1D081");
			name.css("background-color", "rgba(177,208,129,0.2)");
		} else if(i % 4 == 3) {
			title.css("background-color", "#FFCA7E");
			name.css("background-color", "rgba(255,202,126,0.2)")
		}
	}
}
//渲染不同的列表的背景色
function initBG() {
	var li = $("div.abilityList li");
	for(var i = 0; i < li.length; i++) {
		var title = $("div.abilityList li:eq(" + i + ")").find("span.title");
		var name = $("div.abilityList li:eq(" + i + ")").find("span.name");
		if(i % 4 == 0) {
			title.css("background-color", "#79A3FF")
			name.css("background-color", "rgba(121,163,255,0.2)")
		} else if(i % 4 == 1) {
			title.css("background-color", "#FD8DA3");
			name.css("background-color", "rgba(253,141,163,0.2)");
		} else if(i % 4 == 2) {
			title.css("background-color", "#B1D081");
			name.css("background-color", "rgba(177,208,129,0.2)");
		} else if(i % 4 == 3) {
			title.css("background-color", "#FFCA7E");
			name.css("background-color", "rgba(255,202,126,0.2)")
		}
	}
}
//查询(按钮)
$("button.searching").bind("click", function() {
	info(1, 10)
	return false

})

//点击选择添加新能力
$("div.abilityDiv>button").bind("click", function() {
	$("input#ab_key").val("")
	//获取已经选取的新能力
	var len = $('div.abilityList li').length;
	var arrIds = [];
	for(var i = 0; i < len; i++) {
		var getId = $('div.abilityList li:eq(' + i + ')').attr("id");
		arrIds.push(getId);
	}
	$("input#sid").attr("ids", arrIds);
	loadAbility()
	layer.open({
		type: 1,
		skin: '', //加上边框
		area: ['900px', '550px'],
		btn: ['确认'],
		content: $("#show_ability"),
		yes: function(index, layero) {
			//获取机器人id
			var cid = localStorage.getItem("cid");
			//模块id
			var idM = $("ul.ul_List>li.active").attr("idM");
			var arrBg = [],
				arrName = [],
				arrIds = [],
				arrBgAp = [];
			$("div.allAbility div.layui-form-checked").each(function(index) {
				var name = $(this).prev().attr("name");
				var id = $(this).parents("li").attr("id");
				var bgColor = $(this).prev().parents("span.name").prev().css("background-color");
				var ap = $(this).prev().parents("span.name").css("background-color");
				arrBg.push(bgColor);
				arrName.push(name);
				arrIds.push(id);
				arrBgAp.push(ap)
			})
			console.log(arrName.toString())
			getAjax($ctx + "selectMulSkill", {
				"cid": cid,
				"idM": idM,
				"idDt": arrIds.toString()
			}, 'post', function(data, status) {
				if(data.ret == 0) {
					$("div.abilityList ul").empty();
					for(var i = 0; i < arrName.length; i++) {
						var a_HTMl = "";
						var firstName = arrName[i].charAt(0);
						a_HTML = '<li id="' + arrIds[i] + '"><span class="title" style="background-color: ' + arrBg[i] + '">' + firstName + '</span><span class="name" style="background-color: ' + arrBgAp[i] + '"><span>' + arrName[i] + '</span></span></li>'
						$("div.abilityList ul").append(a_HTML)
					}
					layer.closeAll();
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
		}
	});

})

function loadAbility() {
	layui.use('form', function() {
		var form = layui.form;
		//渲染新能力列表
		getAjax($ctx + "listShareAbility", {
			"idAc": $("input.user_name").val(),
			"atname": $("input#ab_key").val()
		}, 'get', function(data, status) {
			if(data.ret == 0) {
				$("div.allAbility ul").empty();
				var data = data.returnData;
				for(var i = 0; i < data.length; i++) {
					var li = '';
					var first = data[i].atname.charAt(0);
					li = '<li isShare="' + data[i].isShare + '" id="' + data[i].id + '"><span class="title">' + first + '</span><span class="name"><span>' + data[i].atname + '</span><form class="layui-form"><input type="checkbox" name="' + data[i].atname + '" title="" lay-skin="primary" lay-filter="filter"></form></span></li>'
					if(data[i].isShare == 1) { //已共享						
						$("div.allAbility div.shared ul").append(li)
					} else if(data[i].isShare == 0) { //未共享
						$("div.allAbility div.share ul").append(li)
					}
					//$("div.abilityList li:eq("+i+")").find("input[type=checkbox]").prop("checked",true);
					form.render();
				}
				var ids = $("input#sid").attr("ids");
				var arrIds = ids.split(",");
				for(var m = 0; m < $("div.allAbility li").length; m++) {
					if(ids == "undefined" || ids == undefined) {
						return false;
					} else {
						for(var j = 0; j < arrIds.length; j++) {
							if(arrIds[j] == $("div.allAbility li:eq(" + m + ")").attr("id")) {
								$("div.allAbility li:eq(" + m + ")").find("input[type=checkbox]").prop("checked", true);
								form.render();
							}
						}

					}
				}
				initBG1();
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
		})
	});
}
//查询(按钮)
$("div.searchInput1>i").bind("click", function() {
	loadAbility()
})
//查询(回车)
$('input#ab_key').keydown(function(event) {
	if(event.keyCode == 13) {
		loadAbility()
		return false;
	}
});

function init() {
	var searchObj = {};
	var keyWord = $("input#s_key").val();
	if($("div.panel-right .layui-form-checkbox").hasClass("layui-form-checked")) {
		var isI = 3
	} else {
		var isI = 2
	}
	var state = $("div.panel-right dd.layui-this").attr("lay-value");
	var pageCurr = $('div#page1 .layui-laypage-curr em:eq(1)').text();
	if(pageCurr == "") {
		pageCurr = 1;
	} else {
		pageCurr = pageCurr;
	}
	searchObj.keyWord = keyWord;
	searchObj.isI = isI;
	searchObj.state = state;
	searchObj.pageCurr = pageCurr;
	console.log(searchObj);
	$("div.searchInfos").attr("searchInfos", JSON.stringify(searchObj));
	$("div.trainTop").hide();
}