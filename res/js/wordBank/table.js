$(function() {
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
			wname: $("input#key").val(),
			idAc: $("input.user_name").val(),
		}, "get", function(data, status) {
			if(data.ret == 0) {
				var list = data.returnData.list;
				var total = data.returnData.total
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
								title: '词名',
								unresize: true
							}, {
								field: 'wften',
								title: '词频',
								unresize: true
							}, {
								field: 'updateDate',
								title: '修改时间',
								unresize: true,
								width: 170,
							}, {
								field: 'state',
								title: '启用/禁用',
								templet: '#switchTpl',
								width: 100,
								unresize: true
							}, {
								field: 'modify',
								title: '修改',
								width: 60,
								unresize: true,
								templet: '<div><a href="javascript:void(0)" class="table_edit" lay-event="edit" name="修改">修改</a></div>'
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
					}
				})
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
						$("div.m_wordbank").hide();
						$("div#wordbankDiv").load("res/views/wordBank/edit.html");
						localStorage.setItem("data", JSON.stringify(data));
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
				form.on('switch(state)', function(obj) {
					if(obj.elem.checked == true) { //是主键    
						var state = 1
					} else {
						var state = 2
					}
					var arrIds = [];
					var ids = new Object();
					ids.id = this.value;
					arrIds.push(ids)
					getAjax($ctx + "modifyDynaWordByState", {
						"ids": JSON.stringify(arrIds),
						"state": state
					}, 'post', function(data, status) {
						if(data.ret == 0) {
							return false
						} else {
							layer.alert(data.info)
						}
					})
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
	var curr = $('.layui-laypage-curr em:eq(1)').text();
	if(curr == "") {
		$("p.wordbank_curr").html(1);
	} else {
		$("p.wordbank_curr").html(curr);
	}
	$("div.m_wordbank").hide();
	$("div#wordbankDiv").load("res/views/wordBank/add.html");
})