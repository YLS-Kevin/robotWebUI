$(function() {
	//返回上一级菜单
	$("span.t1").bind("click",function(){
		$("div#interfaceDiv").load("res/views/interface/table.html");
		$("div.m_interface").show();
	})
	layui.use(['element', 'form', 'layedit', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			layedit = layui.layedit
		layer = layui.layer
		form.render();
		//判断是否有密钥，选中则有，不选中则没有
		form.on('checkbox(ck)', function(data) {
			if(data.elem.checked == true) {
				$("#" + data.value + "_div").show();
			} else {
				$("#" + data.value + "_div").hide();
			}
		});
		form.verify({
			name: function(value, item) { //value：表单的值、item：表单的DOM对象						
				if(!(/^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/).test(value)) {
					return '接口名称只能输入中文，英文下划线或者数字';
				}
				if(value.length > 21) {
					return '接口名称的长度不能超过20个字符';
				}
			},
			testUrl: function(value, item) {
				if(!(/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/).test(value)) {
					return '请输入正确的url地址';
				}
			},
			code: function(value, item) {

			},
			/*id:function(value, item){
				if($("input[name=key_one]").next().hasClass("layui-form-checked")){
					if($("input[name='id']").val()==""){
						return '请输入id的值'
					}				
				}
			},
			pwd_key:function(value, item){
				if($("input[name=key_one]").next().hasClass("layui-form-checked")){
					if($("input[name='pwd_key']").val()==""){
						return '请输入密钥'
					}				
				}
			},*/
			produceUrl: function(value, item) {
				if(!(/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/).test(value)) {
					return '请输入正确的url地址';
				}
			},
			/*id2:function(value,item){
				if($("input[name=key_two]").next().hasClass("layui-form-checked")){
					if($("input[name='id2']").val()==""){
						return '请输入id的值'
					}				
				}
			},
			pwd_key2:function(value, item){
				if($("input[name=key_two]").next().hasClass("layui-form-checked")){
					if($("input[name='pwd_key2']").val()==""){
						return '请输入密钥'
					}				
				}
			},*/
			param: function(value, item) {

			},
			paramValue: function(value, item) {

			}
		});
		//创建一个编辑器  
		layedit.build('LAY_demo_editor');
		//监听提交  
		form.on('submit(submitAdd)', function(e) {
			/*$("input.param").attr("near", $("input.param").val().replace(/,/g, '|'));
			$("input.paramValue").attr("near", $("input.paramValue").val().replace(/,/g, '|'));
			var arrParam=$("input.param").val().split(",");
			var reg = /^[a-zA-Z]+$/;
			for(var i=0;i<arrParam.length;i++){
				if(!reg.test(arrParam[i])){
					layer.alert("输入的参数只能英文")
					return false
				}
			}*/
			/*var arrValue=$("input.paramValue").val().split(",");
			var regg=/^[a-zA-Z\u4e00-\u9fa5\""]+$/;
			for(var j=0;j<arrValue.length;j++){
				if(!regg.test(arrValue[j])){
					layer.alert("输入的参数值只能英文或者汉字")
					return false
				}
			}*/
			$("input#paramValue").val("");
	        $("input#param").val("");
			getAjax($ctx + "addInterface", {
				"idAc": $("input.user_name").val(),
				"url": $("input.url").val(),
				"urltest": $("input.test_url").val(),
				"explains": $("input.inter_name").val(),
				"icall": $("div#icall").find("dd.layui-this").attr("lay-value"),
				"paramName": $("input.param").attr("near"),
				"paramValue": $("input.paramValue").attr("near"),
				"isFrontCall":$("div#isip").find("dd.layui-this").attr("lay-value"),
			}, 'post', function(data, status) {
				if(data.ret == 0) {
					layer.alert("新增数据接口成功", function(index) {
						$("div#interfaceDiv").load("res/views/interface/table.html");
						$("div.m_interface").show();
						//window.open("#/interface", "_self");
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
			return false;
		});
	})
})
//按下回车键禁止刷新页面
$("input").keydown(function(event) {
	if(event.keyCode == 13) {
		return false
	}
})
//点击测试功能
$("button.submitTest").bind("click", function() {
	$("input#paramValue").val("");
	$("input#param").val("");
	//测试url www.baidu.com?name=123&age=123
	var url = $("input.test_url").val();
	//请求方式
	var type = $("div#icall").find("dd.layui-this").attr("lay-value");
	if(url == "") {
		layer.msg("调试url不能为空", {
			icon: 2
		});
		return false;
	}
	if($("input.param").attr("near") == "undefined" || $("input.param").attr("near") == undefined || $("input.param").attr("near") == "" || $("input.paramValue").attr("near") == "undefined" || $("input.paramValue").attr("near") == undefined || $("input.paramValue").attr("near") == "") {
		test(url, type);
		return false;
	}
	//参数
	var param = $("input.param").attr("near").replace(/[\s\|]/g, ",").split(",");
	//参数值
	var paramValue = $("input.paramValue").attr("near").replace(/[\s\|]/g, ",").split(",");
	var params = new Object();
	var arr = []
	if(param.length > paramValue.length) {
		for(var i = 0; i < paramValue.length; i++) {
			params = param[i] + "=" + paramValue[i];
			arr.push(params)
		}
	} else if(param.length <= paramValue.length) {
		for(var i = 0; i < param.length; i++) {
			params = param[i] + "=" + paramValue[i];
			arr.push(params)
		}
	}
	var str = ""
	for(var j = 0; j < arr.length; j++) {
		str += arr[j] + "&";
	}
	if(str.length > 0) {
		str = str.substr(0, str.length - 1);
	}
	if(url.indexOf("?") == -1) {
		//没有问号
		var url = url + "?" + str
	} else {
		//有问号
		var url = url + "&" + str
	}
	test(url, type);
})

function test(url, type) {
	getAjax($ctx + "testFunction", {
		"url": url,
		"sendType": type
	}, "post", function(data) {
		if(data.ret == 0) {
			layer.alert(JSON.stringify(data.returnData))
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else if(data.ret == 1) {
			layer.alert(data.info)
		}
	})
}
var arrParam = [],
	arrParamValue = [];
//tagsinput
$("input#param").keydown(function(event) {
	if(event.keyCode == 13) {
		if($("input#param").val() == "") {
			return false;
		} else {
			initParam()
		}
	}
})
$("input#paramValue").keydown(function(event) {
	if(event.keyCode == 13) {
		if($("input#paramValue").val() == "") {
			return false;
		} else {
			initParamValue()
		}
	}
})
//点击空白处触发tagsInput
$(document).bind("click", function() {
	if($("input#param").val() != "") {
		initParam()
	}
	if($("input#paramValue").val() != "") {
		initParamValue()
	}
})
$("input#param ,input#paramValue").bind("click", function(event) {
	event.stopPropagation()
})

function initParam() {
	var tagHTML = "";
	var tagValue = $("input#param").val();
	tagHTML = '<span class="tag-label">' + tagValue + '<i class="layui-icon icon_close layui-icon-close"></i></span>';
	$("input#param").val("");
	$("input#param").before(tagHTML);
	arrParam.push(tagValue);
	$("input#param").attr("near", arrParam.join("|"))
	$("i.icon_close").bind("click", function() {
		$(this).parent().remove();
		arrParam.splice(0, arrParam.length); //清空数组 
		for(var i = 0; i < $(".p span.tag-label").length; i++) {
			arrParam.push($(".p span.tag-label:eq(" + i + ")").text());
		}
		$("input#param").attr("near", arrParam.join("|"))
	})
}

function initParamValue() {
	var tagHTML = "";
	var tagValue = $("input#paramValue").val()
	tagHTML = '<span class="tag-label">' + tagValue + '<i class="layui-icon icon_close layui-icon-close"></i></span>';
	$("input#paramValue").val("");
	$("input#paramValue").before(tagHTML);
	arrParamValue.push(tagValue);
	$("input#paramValue").attr("near", arrParamValue.join("|"))
	$("i.icon_close").bind("click", function() {
		$(this).parent().remove();
		arrParamValue.splice(0, arrParamValue.length); //清空数组 
		for(var i = 0; i < $(".v span.tag-label").length; i++) {
			arrParamValue.push($(".v span.tag-label:eq(" + i + ")").text());
		}
		$("input#paramValue").attr("near", arrParamValue.join("|"))
	})
}