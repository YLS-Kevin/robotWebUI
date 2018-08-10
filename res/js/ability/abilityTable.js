$(function() {
	var searchObj = {};
	if($("div.abilityInfos").attr("abilityInfos") == "" || $("div.abilityInfos").attr("abilityInfos") == "undefined" || $("div.abilityInfos").attr("abilityInfos") == undefined) {
		var curnum1 = 1,
			curnum2 = 1;
	} else {
		var s = JSON.parse($("div.abilityInfos").attr("abilityInfos"));
		var curnum1 = s.pageCurr1;
		var curnum2 = s.pageCurr2;
		$("input#abstatename").val(s.state)
		$("input#key").val(s.keyWord);
		if(s.isI == 2) {
			$("div.panel-right").find("input[type=checkbox]").prop("checked", false);
		} else if(s.isI == 3) {
			$("div.panel-right").find("input[type=checkbox]").prop("checked", true);
		}
		$("select[name=ab_state]").val($("input#abstatename").val())
		layui.use(['element', 'form'], function() {
			var element = layui.element, //元素操作
				form = layui.form;
			form.render();
		})
	}
	var limitcount1 = 10;
	var limitcount2 = 10;
	loadTable(curnum1, limitcount1, curnum2, limitcount2);
})
//渲染右边内容
function loadTable(curnum1, limitcount1, curnum2, limitcount2) {
	layui.use(['table', 'element', 'form', 'laypage', 'layer'], function() {
		var table1 = layui.table,
			table2 = layui.table, //表格  
			element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		form.render(); //表单的初始化
		//关键字
		if($("input#key").val() == "") {
			var keyword = "";
		} else {
			var keyword = $("input#key").val();
		}
		//接口
		if($(".layui-form-checkbox").hasClass("layui-form-checked")) {
			var isI = 3
		} else {
			var isI = 2
		}
		//对话状态	
		var state = $("div.panel-right dd.layui-this").attr("lay-value")
		//单轮问答表格展示	
		getAjax($ctx + 'getDialogById', {
			"keyword": keyword,
			"idDt": $("li.active").attr("id"), //对话库的id
			"isI": isI, //是否是接口 2-固定应答，3-接口应答
			"state": state,
			"pageSingle": curnum1,
			"sizeSingle": limitcount1,
			"pageMul": curnum2,
			"sizeMul": limitcount2,
			"descMul": "desc",
			"descMulCol": "updateDate",
			"descSingle": "desc",
			"descSingleCol": "updateDate",
		}, 'post', function(data, status) {
			var list;
			if(data.ret == 0) {
				var topList = data.returnData; //获取的头部信息
				single_list = topList.singleDialog;
				//获取状态
				if(topList.isShare == 0) {
					var state = "待共享";
					$("span.share_span").html("共享");
				} else if(topList.state == 1) {
					var state = "已共享";
					$("span.share_span").html("取消共享");
				}
				$("span.share").html('<span class="layui-badge-dot"></span>&nbsp;&nbsp;' + state);
				//获取被引用数量
				if(topList.be_quoted == 0) {
					$("span.be_quoted").html(0);
				} else {
					$("span.be_quoted").html(topList.be_quoted);
				}
				//获取能力名称
				$("p.panel-title").html(topList.atname + "&nbsp;<i class='editIcon layui-icon'>&#xe642;</i>");
				$("p.panel-title").attr("t", topList.atname)
				//编辑对话库的名称
				$("i.editIcon").bind("click", function() {
					layer.prompt({
						title: '修改对话库名称',
						formType: 0,
						/*input为text的文本框*/
						value: topList.atname,
					}, function(text, index) {
						getAjax($ctx + "modifyDialogLibrary", {
							id: $("li.active").attr("id"), //对话库的id,
							atname: text,
							idAc: $("input.user_name").val()
						}, "post", function(data, staus) {
							if(data.ret == 0) {
								layer.close(index);
								layer.msg('<span style="color:#fff">修改成功</span>');
								$("p.panel-title").html(text + "&nbsp;<i class='editIcon layui-icon'>&#xe642;</i>")
								$("li.active>a").html(text)
								//getlistDialogLibrary(topList.state);
							} else {
								layer.alert(data.info);
							}
						})

					});
				})
				data_single = topList.singleDialog;
				data_double = topList.mulDialog;
				var total1 = data.returnData.singleDialog.total;
				var total2 = data.returnData.mulDialog.total;
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			}
			table1.render({
				elem: '#s-answer-grid',
				/*url: 'res/js/ability/data.js',*/
				data: data_single.list,
				cols: [
					[ //表头
						{
							type: "numbers",
							title: '序号',
						}, {
							field: 'isI',
							title: '调用接口',
							width: 90,
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
									return '<p class="dot tip" data-tipso="' + d.aword + '">' + d.aword + '</p>'
								} else {
									return '<p class="dot tip" data-tipso="' + d.keyWord + '">' + d.keyWord + '</p>'
								}
							}
						}, {
							field: 'answer',
							title: '答案',
							unresize: true,
							templet: function(d) {
								if(d.answer.length > 120) {
									return '<p class="normal tip" data-tipso="' + d.answer + '">' + d.answer.substring(0, 120) + '...</p>'
								} else {
									return '<p class="normal">' + d.answer + '</p>'
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
							width: 60,
							unresize: true,
							templet: '<div><a href="javascript:void(0)" class="table_edit" lay-event="edit" name="修改问答 ">修改</a></div>'
						}, {
							field: "delete",
							title: '删除',
							unresize: true,
							width: 60,
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
						count: total1,
						curr: curnum1,
						limit: limitcount1,
						layout: ['prev', 'page', 'next', 'skip', 'count'],
						jump: function(obj, first) {
							if(!first) {
								curnum1 = obj.curr;
								limitcount1 = obj.limit;
								loadTable(curnum1, limitcount1, curnum2, limitcount2)
							}
						}
					})
				}
			})
			$("p.tip").tipso({
				useTitle:false,
				position:'right',
				background:'#e6e6e6',
				delay:0,
				width:400
			})
			//多轮问答表格展示
			table2.render({
				elem: '#d-answer-grid',
				data: data_double.list,
				cols: [
					[{
							type: "numbers",
							title: '序号'
						}, {
							field: 'tname',
							title: '主题',
							unresize: true,
							templet: function(d) {
								return '<p class="normal">' + d.tname + '</p>'
							}
						}, {
							field: 'nums',
							title: '对话数',
							unresize: true,
						}, {
							field: 'updateDate',
							title: '修改时间',
							unresize: true,
							width: 170,
						},
						/*{
						field: 'state',
						title: '启用/禁用',
						unresize: true,
						templet: '#switchTpl_mul',
						width: 110,
					},*/
						{
							field: 'modify',
							title: '修改',
							unresize: true,
							width: 60,
							templet: '<div><a href="javascript:void(0)" class="table_edit" lay-event="edit">修改</a></div>'
						}, {
							field: "delete",
							title: '删除',
							unresize: true,
							width: 60,
							templet: '<div><a href="javascript:void(0)" class="table_delete" lay-event="delete">删除</a></div>'
						}
					]
				],
				page: false,
				done: function(res, curr, count) {
					//如果是异步请求数据方式，res即为你接口返回的信息。  
					//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度  
					laypage.render({
						elem: 'page2',
						count: total2,
						curr: curnum2,
						limit: limitcount2,
						layout: ['prev', 'page', 'next', 'skip', 'count'],
						jump: function(obj, first) {
							if(!first) {
								curnum2 = obj.curr;
								limitcount2 = obj.limit;
								loadTable(curnum1, limitcount1, curnum2, limitcount2)
							}
						}
					})
				}
			})
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
		}); //单轮对话监听"启用/禁用"操作
		/*form.on('switch(state2)', function(obj) {
			if(obj.elem.checked == true) { //是主键    
				var state = 1
			} else {
				var state = 2
			}
			var idAps = [],
				idObj = new Object();
			idObj.idAp = this.value;
			idAps.push(idObj);
			getAjax($ctx + "modifyMulDialogByState", {
				"idAps": JSON.stringify(idAps),
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
		});*/
		//表格1的编辑和删除
		table1.on('tool(demo1)', function(obj) {
			var data = obj.data;
			if(obj.event === 'delete') {
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
								curr = curr
							} else {
								curr = curnum1
							}
							console.log(curr);
							//return curr; // 返回curr
							initIsI(curr, limitcount1, curnum2, limitcount2)
						} else if(data.ret == 20003) {
							layer.alert(data.info, function() {
								window.open("res/views/user/login.html", "_self");
							})
						} else {
							layer.alert(data.info);
						}

					})
					/*obj.del();
					layer.close(index);*/
				});
			} else if(obj.event === 'edit') {
				localStorage.setItem("aptype", data.aptype); //1是模糊匹配
				localStorage.setItem("isI", data.isI); //1是接口
				localStorage.setItem("idD", data.id);
				$("div.ysl_main").load("res/views/ability/sedit.html");
				init()
			}
		});
		//表格2的编辑和删除
		table2.on('tool(demo2)', function(obj) {
			var data = obj.data;
			if(obj.event === 'detail') {
				layer.msg('ID：' + data.id + ' 的查看操作');
			} else if(obj.event === 'delete') {
				layer.confirm('您确定要删除该主题吗', function(index) {
					getAjax($ctx + "delTheme", {
						"id": data.id
					}, "post", function(data, status) {
						if(data.ret == 0) {
							obj.del();
							layer.close(index);
							var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
							var dataIndex = $(obj.tr[0]).attr("data-index"); // 获取tr的data-index属性的值验证是否是当前页的第一条
							if($("#d-answer-grid").next().find("tr").length == 1) { // 如是当前页的第一条数据
								curr = curr
							} else {
								curr = curnum1
							}
							console.log(curr);
							//return curr; // 返回curr
							initIsI(curr, limitcount1, curnum2, limitcount2)
						} else if(data.ret == 20003) {
							layer.alert(data.info, function() {
								window.open("res/views/user/login.html", "_self");
							})
						} else {
							layer.alert(data.info)
						}
					})
					/*obj.del();
					layer.close(index);*/
				});
			} else if(obj.event === 'edit') {
				layer.prompt({
					title: '修改主题',
					formType: 0,
					value: data.tname
				}, function(text, index) {
					getAjax($ctx + "modifyTheme", {
						"id": data.id,
						"tname": text,
						"idAc": $("input.user_name").val(),
						"idDt": $("li.active").attr("id")
					}, 'post', function(data, status) {
						if(data.ret == 0) {
							layer.close(index);
							layer.msg('<span style="color:#fff">修改主题成功</span>');
							initIsI(curnum1, limitcount1, curnum2, limitcount2)
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
		});
	})
}
//查询(按钮)
$("button.searching").bind("click", function() {
	loadTable(1, 10, 1, 10);
	return false
})
//删除对话库
$("span#del_com").bind("click", function() {
	layer.confirm('您确定删除该对话库吗？', function(index) {
		//确定
		var diaID = $("li.active").attr("id");
		getAjax($ctx + "delDiallogLibrary", {
			"id": diaID
		}, 'post', function(data, staus) {
			if(data.ret == 0) {
				layer.close(index);
				layer.alert("该对话库删除成功。", function(index) {
					//alert($("#l_list_share").children().length)
					if($("#l_list_share").children().length == 0) {
						$("div.ysl_main").hide();
					}
					$("div.layui-tab-item").find("li#" + diaID).remove();
					layer.close(index);
					if($("div#shareDiv").hasClass('layui-show')) {
						$("ul#l_list_share>li:eq(0)").addClass("active");
						localStorage.setItem("idDt", "");
						getlistDialogLibrary(0)
					} else {
						$("ul#l_list_shared>li:eq(0)").addClass("active");
						localStorage.setItem("idDt", "");
						getlistDialogLibrary(1)
					}
					//loadTable(1, 10, 1, 10);
				})
				$("div.layui-tab-item").find("li#" + diaID).remove();
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
		})

	}, function(index) {
		//取消
		layer.close(index);
	});
})
//该对话库是否共享
$("span#cancle_share").bind("click", function() {
	var $this = $(this);
	if($this.html() == "共享") {
		var isShare = 1;
	} else if($this.html() == "取消共享") {
		var isShare = 0;
	}
	getAjax($ctx + "shareDialogLibrary", {
		id: $("li.active").attr("id"),
		isShare: isShare
	}, "post", function(data, status) {
		if(data.ret == 0) {
			if(isShare == 1) {
				$("span.share").html('<span class="layui-badge-dot"></span>&nbsp;&nbsp;已共享');
				$this.html("取消共享");
				getlistDialogLibrary(1);
				$("li[share=1]").addClass("layui-this");
				$("li[share=0]").removeClass('layui-this');
				$("div#sharedDiv").addClass("layui-show")
				$("div#shareDiv").removeClass("layui-show");
			} else if(isShare == 0) {
				$("span.share").html('<span class="layui-badge-dot"></span>&nbsp;&nbsp;未共享');
				$this.html("共享");
				getlistDialogLibrary(0);
				$("li[share=0]").addClass("layui-this");
				$("li[share=1]").removeClass('layui-this');
				$("div#shareDiv").addClass("layui-show")
				$("div#sharedDiv").removeClass("layui-show");
			}
			//getlistDialogLibrary("0")
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
})
//添加（单轮对话）
$("button#addAnswer").bind("click", function() {
	$("div.ysl_main").load("res/views/ability/sanswer.html");
	init()
})
//添加(新增主题)（多轮对话）
$("button#addTheme").bind("click", function() {
	var idDt = $("li.active").attr("id");
	var dname = $("li.active>a").html();
	localStorage.setItem("isI", 2);
	localStorage.setItem("idDt", idDt); //传入对话库的id
	localStorage.setItem("dname", dname); //传入对话库的名称
	localStorage.setItem("themeId", "");
	//init()
})

function initIsI(curnum1, limitcount1, curnum2, limitcount2) {
	loadTable(curnum1, limitcount1, curnum2, limitcount2)
}

function init() {
	var searchObj = {};
	var keyWord = $("input#key").val();
	if($("div.panel-right .layui-form-checkbox").hasClass("layui-form-checked")) {
		var isI = 3
	} else {
		var isI = 2
	}
	var state = $("div.panel-right dd.layui-this").attr("lay-value");
	var pageCurr1 = $('div#page1 .layui-laypage-curr em:eq(1)').text();
	if(pageCurr1 == "") {
		pageCurr1 = 1;
	} else {
		pageCurr1 = pageCurr1;
	}
	var pageCurr2 = $('div#page2 .layui-laypage-curr em:eq(1)').text();
	if(pageCurr2 == "") {
		pageCurr2 = 1;
	} else {
		pageCurr2 = pageCurr2;
	}
	searchObj.keyWord = keyWord;
	searchObj.isI = isI;
	searchObj.state = state;
	searchObj.pageCurr1 = pageCurr1;
	searchObj.pageCurr2 = pageCurr2;
	console.log(searchObj);
	$("div.abilityInfos").attr("abilityInfos", JSON.stringify(searchObj));
}