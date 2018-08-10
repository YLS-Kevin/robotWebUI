$(function() {
	//返回上一级菜单
	$("span.t1").bind("click", function() {
		$("div#wordbankDiv").load("res/views/wordBank/table.html");
		$("div.m_wordbank").show();
	})
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
				getAjax($ctx + "addDynaWord", {
					'idDwg': '',
					'wname': noun,
					'idAc': $("input.user_name").val(),
					'wften': count,
					'state': state,
					'remarks': note,
				}, "post", function(data, status) {
					if(data.ret == 0) {
						layer.alert("词库新增成功", function(inedx) {
							$("div#wordbankDiv").load("res/views/wordBank/table.html");
							$("div.m_wordbank").show();
							/*window.open("#/wordBank", "_self");*/
							layer.close(inedx)
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