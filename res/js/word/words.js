$(function() {
	//显示词组的名称
	$("span.m_name").html(localStorage.getItem("t_en"));
	$("span.m_name").attr("isDefault", localStorage.getItem("isDefault"));
	//是否显示新增按钮
	if(localStorage.getItem("isDefault") == 1) {
		$("div.addDiv").hide();
	} else {
		$("div.addDiv").show();
	}
	var limitcount = 10;
	var currnum = $("p.wordbank_curr").html();
	loadTable(currnum, limitcount);
})

function loadTable(currnum, limitcount) {
	layui.use(['table', 'element', 'form', 'laypage'], function() {
		var table = layui.table,
			element = layui.element, //元素操作
			laypage = layui.laypage,
			form = layui.form;
		getAjax($ctx + "listDynaWord", {
			page: currnum,
			size: limitcount,
			wname: $("input#w").val(),
			idDwg: localStorage.getItem("groupId"),
		}, "get", function(data, status) {
			if(data.ret == 0) {
				var list = data.returnData.list;
				var total = data.returnData.total;
				if(localStorage.getItem("isDefault") == 1) {
					table.render({
						elem: '#interface',
						data: list,
						cols: [
							[ //表头
								{
									type: "numbers",
									title: '序号'
								}, {
									field: 'wname',
									title: '动态词',
									unresize: true,
									width: 240
								}, {
									field: 'synonym',
									title: '同义词',
									unresize: true,
									templet: function(d) {
										if(d.synonym == "") {
											return "暂无"
										} else {
											return d.synonym
										}
									}
								}, {
									field: 'wften',
									title: '词频',
									unresize: true,
									width: 80
								}, {
									field: 'updateDate',
									title: '修改时间',
									unresize: true,
									width: 170,
								}, {
									field: 'modify',
									title: '修改',
									width: 60,
									unresize: true,
									templet: '<div><a href="#/word/edit" class="table_edit" lay-event="edit" name="修改">修改</a></div>'
								}
							]
						],
						page: false,
						id: "table1",
						done: function(res, curr, count) {
							//如果是异步请求数据方式，res即为你接口返回的信息。  
							//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度  
							laypage.render({
								elem: 'laypage',
								count: total,
								curr: currnum,
								limit: limitcount,
								layout: ['prev', 'page', 'next', 'skip', 'count'],
								jump: function(obj, first) {
									if(!first) {
										currnum = obj.curr;
										limitcount = obj.limit;
										loadTable(currnum, limitcount)
									}
								}
							})
							/*if(localStorage.getItem("isDefault") == 1) {
								$("[data-field='delete']").css('display', 'none');
								$("[data-field='delete']").width("1px");
							} 		*/
						}
					})
				} else {
					table.render({
						elem: '#interface',
						data: list,
						cols: [
							[ //表头
								{
									type: "numbers",
									title: '序号'
								}, {
									field: 'wname',
									title: '动态词',
									unresize: true,
									width: 240
								}, {
									field: 'synonym',
									title: '同义词',
									unresize: true,
									templet: function(d) {
										if(d.synonym == "") {
											return "暂无"
										} else {
											return d.synonym
										}
									}
								}, {
									field: 'wften',
									title: '词频',
									unresize: true,
									width: 80
								}, {
									field: 'updateDate',
									title: '修改时间',
									unresize: true,
									width: 170,
								}, {
									field: 'modify',
									title: '修改',
									width: 60,
									unresize: true,
									templet: '<div><a href="#/word/edit" class="table_edit" lay-event="edit" name="修改">修改</a></div>'
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
								elem: 'laypage',
								count: total,
								curr: currnum,
								limit: limitcount,
								layout: ['prev', 'page', 'next', 'skip', 'count'],
								jump: function(obj, first) {
									if(!first) {
										currnum = obj.curr;
										limitcount = obj.limit;
										loadTable(currnum, limitcount)
									}
								}
							})
							/*if(localStorage.getItem("isDefault") == 1) {
								$("[data-field='delete']").css('display', 'none');
								$("[data-field='delete']").width("1px");
							} 		*/
						}
					})
				}

				table.on('tool(interfaceDemo)', function(obj) {
					var data = obj.data;
					//修改
					if(obj.event === 'edit') {
						/*var curr = $('.layui-laypage-curr em:eq(1)').text();
                        $("p.wordbank_page").html(curr)*/
						var curr = $('.layui-laypage-curr em:eq(1)').text();
						if(curr == "") {
							$("p.wordbank_curr").html(1);
						} else {
							$("p.wordbank_curr").html(curr);
						}
						$("p.wordbank_curr").html(curr);
						localStorage.setItem("name", $("span.m_name").html())
						localStorage.setItem("data", JSON.stringify(data));
						localStorage.setItem("isDefault", $("span.m_name").attr("isDefault"));
					}
					//删除
					if(obj.event === 'delete') {
						getAjax($ctx + "delDynaWord", {
							"id": data.id
						}, 'post', function(data, status) {
							layer.confirm('您确定删除该词吗？', function(index) {
								obj.del();
								var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
								var dataIndex = $(obj.tr[0]).attr("data-index"); // 获取tr的data-index属性的值验证是否是当前页的第一条
								if($("#interface").next().find("tr").length == 1) { // 如是当前页的第一条数据
									curr = curr - 1
								} else {
									curr = currnum
								}
								console.log(curr);
								loadTable(curr, limitcount); //删除之后重新加载表格
								layer.close(index);
							});
						})
						return false
					}
				});
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}

		})

	})
}

//新增
$("button.addBtn").bind("click", function() {
	localStorage.setItem("name", $("span.m_name").html())
	var curr = $('.layui-laypage-curr em:eq(1)').text();
	if(curr == "") {
		$("p.wordbank_curr").html(1);
	} else {
		$("p.wordbank_curr").html(curr);
	}
	$("div.m_wordbank").hide();
})
//查询
$("input#w").keydown(function(event) {
	if(event.keyCode == 13) {
		loadTable(1, 10)
	}
})
$("i#searchBtn").click(function(event) {
	loadTable(1, 10)
})