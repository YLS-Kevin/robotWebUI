$(function() {
	var limitcount = 5;
	var currnum = $("p.robot_curr").html();
	loadRobotTable(currnum, limitcount)
})
//加载表格
function loadRobotTable(currnum, limitcount) {
	layui.use(['table', 'element', 'form', 'laypage', 'layer'], function() {
		var table = layui.table,
			element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		getAjax($ctx + "listRobot", {
			"idAc": $("input.user_name").val(),
			"page": currnum,
			"size": limitcount,
			"cname": $("input#key").val()
		}, 'get', function(data, status) {
			if(data.ret == 0) {
				var robotList = data.returnData.list;
				var total = data.returnData.total
				table.render({
					elem: '#robotT',
					data: robotList,
					cols: [
						[ //表头
							{
								field: "iconurl",
								title: '机器人图标',
								width: 300,
								templet: function(d) {
									if(d.iconurl == "") {
										return "<img src='./res/image/index/robotIcon.png' style='margin-right:20px'><span title='"+d.cname+"'>"+d.cname+"</span>"
									} else {
										return "<img src='" + d.iconurl + "' style='margin-right:20px'><span title='"+d.cname+"'>"+d.cname+"</span>"
									}

								}
							}/*,
							{
								field: "cname",
								title: '名称',
								templet:function(d){
									return '<p title="'+d.cname+'">'+d.cname+'</p>'
								}
							}*/, {
								field: 'appid',
								title: 'APPID',
								templet: function(d) {
									return '<p title="'+d.appid+'">APPID&nbsp;&nbsp;'+ d.appid+'</p>'
								}
							}, {
								field: 'accessWay',
								title: '接入方式',
								width: 200,
								templet: function(d) {
									return "接入方式&nbsp&nbsp" + d.accessWay
								}
							}, {
								field: 'createDate',
								title: '创建时间',
								width: 280,
								templet: function(d) {
									var d = new Date(d.createDate);
									var dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') +
										' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
									return "创建时间&nbsp;&nbsp;" + dformat;
								}
							}, {
								field: "delete",
								title: '删除',
								width: 80,
								templet: '<div><a href="javascript:void(0)" class="tool del" lay-event="del" name="删除">删除</a></div>'
							}, {
								field: 'enter',
								title: '接入',
								width: 80,
								templet: '<div><a href="javascript:void(0)" class="tool enter" lay-event="enter" name="开发接入">接入</a></div>'
							},
							{
								field: 'train',
								title: '训练',
								width: 80,
								templet: '<div><a href="javascript:void(0)" class="tool train" lay-event="train" name="训练">训练</a></div>'
							},
							{
								field: 'state',
								title: '启用/禁用',
								width: 80,
								templet: '#switchTpl'
							}, {
								field: 'log',
								title: '日志',
								width: 80,
								templet: '<div><a href="javascript:void(0)" class="tool" lay-event="log" name="日志">日志</a></div>'
							}
							/*, {
															field: 'isshare',
															title: '是否共享',
															width: 100,
															templet: '<div><a href="javascript:void(0)" class="tool" lay-event="share" name="共享">共享</a></div>'
														}*/
						]
					],
					page: false,
					id: "robotTable",
					done: function(res, curr, count) {
						//如果是异步请求数据方式，res即为你接口返回的信息。  
						//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度  
						laypage.render({
							elem: 'RobotPage',
							count: total,
							curr: currnum,
							limit: limitcount,
							layout: ['prev', 'page', 'next', 'skip', 'count'],
							jump: function(obj, first) {
								if(!first) {
									currnum = obj.curr;
									limitcount = obj.limit;
									loadRobotTable(currnum, limitcount)
								}
							}
						})
					}
				})
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
		})
		table.on('tool(demo)', function(obj) {
			var data = obj.data;
			//接入
			if(obj.event === 'enter') {
				//获取当前选中的页数
				var curr = $('.layui-laypage-curr em:eq(1)').text();
				$("p.robot_curr").html(curr);
				$("div.m_robot").hide();
				$("div#robotDiv").load("res/views/index/access.html");
				localStorage.setItem("enter_str", JSON.stringify(data));
			}
			//训练
			if(obj.event === 'train') {
				//获取当前选中的页数
				var curr = $('.layui-laypage-curr em:eq(1)').text();
				$("p.robot_curr").html(curr);
				$("div.m_robot").hide();
				$("div#robotDiv").load("res/views/index/train.html");
				localStorage.setItem("cname", data.cname);
				localStorage.setItem("cid", data.id); //获取机器人id
				localStorage.setItem("idM", data.cidM);
				localStorage.setItem("iscommon", "1") //是否是通用模块 common=1 page=2
			}
			//日志
			if(obj.event === 'log') {
				//获取当前选中的页
				var curr = $('.layui-laypage-curr em:eq(1)').text();
				$("p.robot_curr").html(curr);
				$("div.m_robot").hide();
				$("div#robotDiv").load("res/views/index/log.html");
				localStorage.setItem("cname", data.cname);
				localStorage.setItem("cid", data.id); //获取机器人id
			}
			if(obj.event === 'del') {
				layer.confirm('您确定要删除该机器人吗？', function(index) {
					getAjax($ctx + "delRobotById", {
						id: data.id
					}, "post", function(data, status) {
						if(data.ret == 0) {
							layer.alert("删除成功");
							obj.del();
							layer.close();
							var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
							var dataIndex = $(obj.tr[0]).attr("data-index"); // 获取tr的data-index属性的值验证是否是当前页的第一条
							if($("#robotT").next().find("tr").length == 1) { // 如是当前页的第一条数据
								curr = curr - 1
							} else {
								curr = currnum
							}
							console.log(curr)
							loadRobotTable(curr, limitcount)
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
		form.on('switch(state)', function(obj) {
			/*if(obj.elem.checked == true) { //是主键    
				var state = 1
			} else {
				var state = 2
			}
			getAjax($ctx + "activeInterface", {
				"ids": this.value,
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
			})*/
		});
	})
}
//新增（面包屑导航）
$("button.addBtn").bind("click", function() {
	//获取当前选中的页数
	var curr = $('.layui-laypage-curr em:eq(1)').text();
	if(curr == "") {
		$("p.robot_curr").html(1);
	} else {
		$("p.robot_curr").html(curr);
	}
	$("div.m_robot").hide();
	$("div#robotDiv").load("res/views/index/add.html");

})