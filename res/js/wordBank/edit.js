$(function() {
	//返回上一级菜单
	$("span.t1").bind("click", function() {
		$("div#wordbankDiv").load("res/views/wordBank/table.html");
		$("div.m_wordbank").show();
	})
	var data = JSON.parse(localStorage.getItem("data"));
	$(".t1>a").html(data.wname);
	//名词
	$("input[name='noun']").val(data.wname);
	//词频
	$("input[name='count']").val(data.wften);
	//状态 1-启用 2-禁用
	layui.use(['element', 'form'], function() {
		var element = layui.element,
			form = layui.form;
		if(data.state == 1) {
			$("input[name=state]").attr("checked", "checked")
		} else {
			$("input[name=state]").removeAttr("checked")
		}
		form.render();
	})

	//备注
	$("textarea").val(data.remarks)
	layui.use(['element', 'form', 'layedit', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			layedit = layui.layedit
		layer = layui.layer
		layui.use('form', function() {
			var form = layui.form;
			form.render();
			form.verify({
				noun: function(value, item) { //value：表单的值、item：表单的DOM对象

				},
				count: function(value, item) {

				},
				note: function(value, item) {

				}
			});
			//监听提交  
			form.on('submit(demo)', function(e) {
				var noun = $("input[name='noun']").val();
				var count = $("input[name='count']").val();
				var note = $("textarea").val();
				var nounReg = /^[a-zA-Z0-9\u4e00-\u9fa5\""]+$/; //必须是中文，英文下划线或者数字
				if(!nounReg.test(noun)) {
					layer.alert("您输入的名词只能是中文，英文或者数字")
					return false;
				}
				if(noun.length > 11) {
					layer.alert("您输入的名词长度不能超过10位")
					return false;
				}
				if(count.length == 0) {
					layer.alert("您输入的词频的数量")
					return false;
				}
				if($("div.layui-form-switch").hasClass("layui-form-onswitch")) {
					var state = 1;
				} else {
					var state = 2;
				}
				getAjax($ctx + "modifyDynaWord", {
					'id': data.id,
					'wname': noun,
					'wften': count,
					'state': state,
					'remarks': note,
				}, "post", function(data, status) {
					if(data.ret == 0) {
						layer.alert("修改成功", function(index) {
							/*window.open("#/wordBank", "_self");*/
							$("div#wordbankDiv").load("res/views/wordBank/table.html");
							$("div.m_wordbank").show();
							layer.close(index)
						})

					} else if(data.ret == 20003) {
						layer.alert(data.info, function() {
							window.open("res/views/user/login.html", "_self");
						})
					} else {
						layer.alert(data.info)
					}
				})
				return false
			});
		})
	})
})