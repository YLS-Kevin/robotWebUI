$(function() {
	$(".t1>a").html(localStorage.getItem("dname"));
	$(".t3>a").html(localStorage.getItem("tname"));
	var searchObj = {};
	if($("div.themeInfos").attr("themeInfos") == "" || $("div.themeInfos").attr("themeInfos") == "undefined" || $("div.themeInfos").attr("themeInfos") == undefined) {
		var curnum1 = 1 , curnum2 = 1;
	} else {
		var s = JSON.parse($("div.themeInfos").attr("themeInfos"));
		var curnum1 = s.pageCurr1;
		var curnum2 = s.pageCurr2;
		$("input#themestatename").val(s.state)
		$("input#key").val(s.keyWord);
		if(s.isI == 2) {
			$("div.search_Div").find("input[type=checkbox]").prop("checked", false);
		} else if(s.isI == 3) {
			$("div.search_Div").find("input[type=checkbox]").prop("checked", true);
		}
		$("select[name=themeState]").val($("input#themestatename").val())
		layui.use(['element', 'form'], function() {
			var element = layui.element, //元素操作
				form = layui.form;
			form.render();
		})
	}		
	var limitcount1 = 10;
	var limitcount2 = 10;
	layui.use(['element', 'form'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		form.render();
	})
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
		//多轮问答表格展示	
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
		var state = $("div.search_Div dd.layui-this").attr("lay-value")
		getAjax($ctx + 'getDialogByIdAc', {
			"idAc": $("input.user_name").val(), //账户id
			"isI": isI, //是否是接口 2-固定应答，3-接口应答
			"keyword": keyword,
			"state": state,
			"pageMul": curnum1,
			"sizeMul": limitcount1,
			"pageMul2": curnum2,
			"sizeMul2": limitcount2,
			"idAp": $("li.themeActive").attr("t_id"),
			"descMul": "desc",
			"descMulCol": "updateDate",
			"descMul2": "desc",
			"descMulCol2": "updateDate"
		}, 'post', function(data, status) {
			var list;
			if(data.ret == 0) {
				var topList = data.returnData; //获取的头部信息
				mulDialog = topList.mulDialog;
				mulDialog2 = topList.mulDialog2;
				var total1 = mulDialog.total;
				var total2 = mulDialog2.total;
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			}
			table1.render({
				elem: '#s-answer-grid',
				/*url: 'res/js/ability/data.js',*/
				data: mulDialog.list,
				cols: [
					[ //表头
						{
							type: "numbers",
							title: '序号'
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
						},  {
							field: 'updateDate',
							title: '修改时间',
							unresize: true,
							width: 170,
						}, {
							field: 'state',
							title: '启用/禁用',
							templet: '#switchTplIn',
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
							unresize: true,
							width: 60,
							templet: '<div><a href="javascript:void(0)" class="table_delete" lay-event="del">删除</a></div>'
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
			//多轮问答表格展示
			table2.render({
				elem: '#d-answer-grid',
				data: mulDialog2.list,
				cols: [
					[{
						type: "numbers",
						title: '序号'
					}, {
						field: 'isI',
						title: '调用接口',
						unresize: true,
						width: 110,
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
							title: '进入主题后的回答',
							unresize: true,
							templet: function(d) {
								if(d.answer.length > 120) {
									return '<p class="normal tip" data-tipso="' + d.answer + '">' + d.answer.substring(0, 120) + '...</p>'
								} else {
									return '<p class="normal" >' + d.answer + '</p>'
								}
							}
						},  {
						field: 'updateDate',
						title: '修改时间',
						width: 170,
						unresize: true,
					}, {
						field: 'state',
						title: '启用/禁用',
						templet: '#switchTplOut',
						width: 100,
						unresize: true,
					}, {
						field: 'modify',
						title: '修改',
						width: 60,
						unresize: true,
						templet: '<div><a href="javascript:void(0)" class="table_edit" lay-event="edit">修改</a></div>'
					}, {
						field: "delete",
						title: '删除',
						width: 60,
						unresize: true,
						templet: '<div><a href="javascript:void(0)" class="table_delete" lay-event="delete">删除</a></div>'
					}]
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
			$("p.tip").tipso({
				useTitle:false,
				position:'right',
				background:'#e6e6e6',
				delay:0,
				width:400
			})
		})
		//进入主题前监听"启用/禁用"操作
		form.on('switch(isOpen1)', function(obj) {
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
		//进入主题后监听"启用/禁用"操作
		form.on('switch(isOpen2)', function(obj) {
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
		table1.on('tool(demo)', function(obj) {
			var data = obj.data;
			if(obj.event === 'del') {
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
							//initIsI(curnum1, limitcount1, curnum2, limitcount2)
						} else if(data.ret == 20003) {
							layer.alert(data.info, function() {
								window.open("res/views/user/login.html", "_self");
							})
						} else {
							layer.alert(data.info);
						}

					})
				});
			} else if(obj.event === 'edit') {
				localStorage.setItem("aptype", data.aptype); //1是模糊匹配
				localStorage.setItem("isI", data.isI); //1是接口
				localStorage.setItem("idD", data.id);
				localStorage.setItem("atype", 4);
				$("div#duolun_main").load("res/views/ability/answerOutEdit.html");
				themeInit()
			}
		});
		//表格2的编辑和删除
		table2.on('tool(demo1)', function(obj) {
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
							if($("#d-answer-grid").next().find("tr").length == 1) { // 如是当前页的第一条数据
								curr = curr
							} else {
								curr = curnum2
							}
							console.log(curr);
							//return curr; // 返回curr
							initIsI(curnum1, limitcount1, curr, limitcount2)
							//initIsI(curnum1, limitcount1, curnum2, limitcount2)
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
				localStorage.setItem("idD", data.id); //人机对话id
				localStorage.setItem("atype", 5);
				$("div#duolun_main").load("res/views/ability/answerOutEdit.html");
				themeInit()
			}
		});
	})
}
//进入主题后的新增
$("button#answer_out").bind("click", function() {
	localStorage.setItem("atype", 5);
	$("div#duolun_main").load("res/views/ability/answerOut.html");
	themeInit()
})
//进入主题前的新增
$("button#answer_in").bind("click", function() {
	localStorage.setItem("atype", 4);
	$("div#duolun_main").load("res/views/ability/answerOut.html");
	themeInit()
})
//查询(按钮)
$("button.searching").bind("click", function() {
	loadTable(1, 10, 1, 10);
	return false
})

function initIsI(curnum1, limitcount1, curnum2, limitcount2) {
	loadTable(curnum1, limitcount1, curnum2, limitcount2);
}
function themeInit(){
	var searchObj = {};
	var keyWord = $("input#key").val();
	if($("div.search_Div .layui-form-checkbox").hasClass("layui-form-checked")) {
		var isI = 3
	} else {
		var isI = 2
	}
	var state = $("div.search_Div dd.layui-this").attr("lay-value");
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
	searchObj.pageCurr2= pageCurr2;
	console.log(searchObj);
	$("div.themeInfos").attr("themeInfos", JSON.stringify(searchObj));
}
