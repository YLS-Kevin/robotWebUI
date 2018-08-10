$(function(){
	var limitcount = 10;
	var curnum = $("p.interface_curr").html();
	loadTable(curnum, limitcount);
})
function loadTable(curnum, limitcount) {
	layui.use(['table', 'element', 'form', 'laypage', 'layer'], function() {
		var table = layui.table,
			element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		var explains = $("input#key").val();
		if(explains == "") {
			explains = "";
		}
		getAjax($ctx + 'listInterDataByPage', {
			"idAc": $("input.user_name").val(),
			"page": curnum,
			"size": limitcount,
			"explains": explains
		}, 'get', function(data, status) {
			var list;
			if(data.ret == 0) {
				var list = data.returnData.list;
				var total = data.returnData.total
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
			table.render({
				elem: '#interface',
				data: list,
				cols: [
					[ //表头
						{
							type: "numbers",
							title: '序号',
						}, {
							field: 'explains',
							title: '接口名',
							width: 310,
							unresize: true,
							templet:function(d){
								return '<p>'+d.explains+'</p>'
							}
						}, {
							field: 'url',
							title: 'URL',
							unresize: true,
							templet: function(d) {
								return '<p class="urls" data-tipso="'+d.urltest+'">测试url：' + d.urltest + '</p><p class="urls" data-tipso="'+d.url+'">生产url：' + d.url + '</p>'
							}
						}, {
							field: 'paramName',
							title: '参数',
							unresize: true,
							templet: function(d) {
								if(d.paramName == "") {
									return '<p>暂无参数</p>'
								} else {
									if(d.paramName.length>120){
										return '<p class="tip" data-tipso="'+d.paramName+'">'+d.paramName.substring(0,120)+'...</p>'
									}else{
										return '<p class="tip" data-tipso="'+d.paramName+'">'+d.paramName+'</p>'
									}
									
								}
							}
						}, {
							field: 'isFrontCall',
							title: '是否终端',
							width: 100,
							unresize: true,
							templet:function(d){
								if(d.isFrontCall == 1){
									return '是'
								}else{
									return '否'
								}
								
							}
						},{
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
							field: 'edit',
							title: '修改',
							width: 60,
							unresize: true,
							templet: '<div><a href="javascript:void(0)" class="table_edit edit" lay-event="edit" name="修改">修改</a></div>'
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
						elem: 'interfacePage',
						count: total,
						curr: curnum,
						limit: limitcount,
						layout: ['prev', 'page', 'next', 'skip', 'count'],
						jump: function(obj, first) {
							if(!first) {
								curnum = obj.curr;
								limitcount = obj.limit;
								loadTable(curnum, limitcount)
							}
						}
					})
				}
			})
			$("p.tip").tipso({
				useTitle:false,
				position:'right',
				background:'#e6e6e6',
				delay:0
			})
		})
		table.on('tool(interfaceDemo)', function(obj) {
			var data = obj.data;
			var str1 = $("p.m_name").html();
			//修改
			if(obj.event === 'edit') {
				//获取当前选中的页数
				var curr = $('.layui-laypage-curr em:eq(1)').text();
	            $("p.interface_curr").html(curr);
	            $("div.m_interface").hide();
	            $("div#interfaceDiv").load("res/views/interface/edit.html");
				localStorage.setItem("data", JSON.stringify(data));
			}
			//删除
			if(obj.event === 'delete') {
				getAjax($ctx + "delInterface", {
					"ids": data.id
				}, 'post', function(data, status) {
					if(data.ret == 0) {
						layer.confirm('您确定删除该接口吗？', function(index) {
							obj.del();
							layer.close(index);
							var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
							var dataIndex = $(obj.tr[0]).attr("data-index"); // 获取tr的data-index属性的值验证是否是当前页的第一条
							if($("#interface").next().find("tr").length == 1) { // 如是当前页的第一条数据
								curr = curr-1
							}else{
								curr = curnum
							}
							console.log(curr);
							//return curr; // 返回curr
							loadTable(curr, limitcount); //删除之后重新加载表格
						});
					} else if(data.ret == 20003) {
						layer.alert(data.info, function() {
							window.open("res/views/user/login.html", "_self");
						})
					} else {
						layer.alert(data.info)
					}
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
			})
		});
	})
}
//新增
$("button.addBtn").bind("click",function(){
	var curr = $('.layui-laypage-curr em:eq(1)').text();
	if(curr == ""){
		$("p.interface_curr").html(1);
	}else{
		$("p.interface_curr").html(curr);
	}	
	$("div.m_interface").hide();
	$("div#interfaceDiv").load("res/views/interface/add.html");
})