$(function() {
	//返回上一页
	$("span.t1").bind("click", function() {
		$("div#robotDiv").load("res/views/index/table.html");
		$("div.m_robot").show();
	})
	layui.use(['element', 'form', 'layedit', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			layedit = layui.layedit
		layer = layui.layer
		//渲染所属行业的列表
		getAjax($ctx + "findAllVocation", '', 'post', function(data, status) {
			if(data.ret == 0) {
				var optionList = data.returnData
				for(var i = 0; i < optionList.length; i++) {
					var optionHTML = "";
					optionHTML = "<option value=" + optionList[i].id + ">" + optionList[i].name + "</option>";
					$("select#industry").append(optionHTML)
				}
				form.render(); //将option渲染到select
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}

		})
		form.verify({
			cname: function(value, item) {
				if(value.length > 30) {
					return '机器人名的长度不能超过30个字符';
				}
			},
			remarks: function(value, item) {
				if(value.length > 1000) {
					return '请简述使用场景、应用特点等信息，不超过1000个字符';
				}
			}
		});
		//创建一个编辑器  
		layedit.build('LAY_demo_editor');
		//监听提交  
		form.on('submit(submitAdd)', function(data) {
			var createData = data.field;
			createData.idAc = $("input.user_name").val(); //添加一个用户id属性
			getAjax($ctx + "createdRobot", createData, 'post', function(data, status) {
				if(data.ret == 0) {
					$("div#robotDiv").load("res/views/index/table.html");
					$("div.m_robot").show();
					/*window.open("#/index", "_self");*/
					//$("div.layui-layout-body").data(newData,data.returnData);
				} else {
					layer.alert(data.info);
				}
			})
			return false;
		});
	})
})