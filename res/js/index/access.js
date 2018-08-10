$(function() {
	//获取面包屑导航
	var enterData = JSON.parse(localStorage.getItem("enter_str"));
	$(".t1>a").html(enterData.cname);
	//返回上一级导航
	$("span.t1").bind("click", function() {
		$("div#robotDiv").load("res/views/index/table.html");
		$("div.m_robot").show();
	})
	if(enterData.accessWay == "Android"){
		$("input#accessname").val("1")
	}else{
		$("input#accessname").val("0")
	}
	
		/*layui.use(['element', 'form'], function() {
			var element = layui.element, //元素操作
				form = layui.form;
			form.render();
		})*/
	layui.use(['element', 'form', 'layedit', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			layedit = layui.layedit
		layer = layui.layer		
        $("select[name=type]").val($("input#accessname").val());
	    form.render('select','accessType');
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
				rankTrande();
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}

		})
		
	   
		//渲染“接入方式”<option value="0">WEBAPI</option><option value="1">Android</option>
		/*var accessArr=[{"value":0,"name":"WEBAPI"},{"value":1,"name":"Android"}]
		for(var i=0;i<accessArr.length;i++){
			var accessHTML="";
			accessHTML ='<option value="'+accessArr[i].value+'">'+accessArr[i].name+'</option>';
			$("select#type").append(accessHTML)
		};
		form.render();
		initAccessWay()*/
		//点击修改按钮，分别修改（机器人名，所属行业，功能描述）
		$("span.a_modify").each(function() {
			$(this).bind("click", function(event) {
				if($(this).attr("name") == "select") {
					$(this).siblings().addClass("modify_edit");
					$(this).siblings().removeAttr("disabled");
					form.render('select'); //重新渲染form表单中的select选项
					onClick()
				} else {
					$(this).siblings().addClass("modify_edit");
					$(this).siblings().removeAttr("disabled");
					$(this).prev().focus();
				}
				event.stopPropagation(); //阻止事件冒泡    
			})
		})
		$("input[name=name] , textarea").bind("click", function(event) {
			event.stopPropagation(); //阻止事件冒泡   
		})
		form.on('select(level)', function(data) {
			console.log(data.elem); //得到select原始DOM对象
			console.log(data.value); //得到被选中的值
			console.log(data.othis); //得到美化后的DOM对象
			$("select#industry").removeClass("modify_edit");
			$("select#industry").attr("disabled", "");
			form.render();
			submitNewMsgs();
		});
		form.on('select(accessType)', function(data) {
			submitNewMsgs();
		})
		//获取值
		$("input[name='name']").val(enterData.cname); //获取机器人名称
		$("textarea").html(enterData.remarks) //功能描述
		$("span.appid").html(enterData.appid); //APPID的值
		$("input#getKey").attr("keyId", enterData.id); //获取主键id
		$("input#api_text").val(enterData.secret.substring(0, 5) + "************" + enterData.secret.substring(enterData.secret.length - 5)) //获取apikey
		$("input#module_text").val(enterData.cidM.substring(0, 5) + "************" + enterData.cidM.substring(enterData.secret.length - 5))
		$("input#idac_text").val($("input.user_name").val().substring(0, 5) + "************" + $("input.user_name").val().substring(enterData.secret.length - 5))
		$("input#showKey").val(enterData.secret);
		$("input#showModule").val(enterData.cidM);
		$("input#showIdAc").val($("input.user_name").val())
		
	})
	  
})

//点击复制APIKEY(复制隐藏域里面的值)
$("span.copyKeyBtn").bind("click", function() {
	var text = document.getElementById("showKey").value;
	var input = document.getElementById("api_text");
	input.value = text; // 修改文本框的内容
	input.select(); // 选中文本
	/*var t_t = document.getElementById("showKey");
	t_t.select(); // 选择对象 */
	/*js=t_t.createTextRange(); 
    js.execCommand("Copy");*/
	document.execCommand("Copy"); // 执行浏览器复制命令  
	layer.msg('ApiKey复制成功', {
		icon: 1
	});
})
$("span.copyModuleBtn").bind("click", function() {
	var text = document.getElementById("showModule").value;
	var input = document.getElementById("module_text");
	input.value = text; // 修改文本框的内容
	input.select(); // 选中文本
	/*var t_t = document.getElementById("showKey");
	t_t.select(); // 选择对象 */
	/*js=t_t.createTextRange(); 
    js.execCommand("Copy");*/
	document.execCommand("Copy"); // 执行浏览器复制命令  
	layer.msg('moduleID复制成功', {
		icon: 1
	});
})
$("span.copyIdAcBtn").bind("click", function() {
	var text = document.getElementById("showIdAc").value;
	var input = document.getElementById("idac_text");
	input.value = text; // 修改文本框的内容
	input.select(); // 选中文本
	/*var t_t = document.getElementById("showKey");
	t_t.select(); // 选择对象 */
	/*js=t_t.createTextRange(); 
    js.execCommand("Copy");*/
	document.execCommand("Copy"); // 执行浏览器复制命令  
	layer.msg('IdAc复制成功', {
		icon: 1
	});
})

//点击回车的时候保存修改的信息（机器人名，功能描述）
$("div.addRobot").keydown(function(event) {
	if(event.keyCode == "13") { //keyCode=13是回车键
		checkForm();
	}
});
//点击空白的时候保存修改的信息（机器人名，功能描述）
$("div.addRobot").click(function(event) {
	if($("input[name=name]").hasClass("modify_edit") || $("textarea").hasClass("modify_edit")) {
		//submitNewMsgs()
		checkForm();
	}

});
//第一次点击修改所属行业
var count = 0

function onClick() {
	count++
	if(count > 1) {
		return false;
	} else {
		rankTrande();
	}
}
//针对机器人名称和描述进行校验
function checkForm() {
	var name = $("input[name=name]").val();
	var des = $("textarea.a_name").val();
	if(name == "") {
		$("input[name=name]").focus();
		layer.msg('机器人名称不能为空', {
			icon: 0
		});
		return false
	} else if(name.length > 10) {
		$("input[name=name]").focus();
		layer.msg('机器人名称长度不能超过10个字符', {
			icon: 0
		});
		return false
	} else if(des == "") {
		$("textarea.a_name").focus();
		layer.msg('功能描述不能为空', {
			icon: 0
		});
		return false
	} else if(des.length > 1000) {
		$("textarea.a_name").focus();
		layer.msg('功能描述不能超过1000个字符', {
			icon: 0
		});
		return false
	}
	submitNewMsgs()
}
//提交修改（包括修改机器人名，所属行业，功能描述，接入方式）
function submitNewMsgs() {
	getAjax($ctx + "modifyRobot", {
		"cname": $("input[name=name]").val(), //机器人名称
		"intrade": $("div.hangye dd.layui-this").attr("lay-value"), //所属行业的id
		"remarks": $("textarea").val(), //情景描述
		"accessWay": $("div.a_type dd.layui-this").html(), //连接方式
		"id": $("input#getKey").attr("keyId"), //主键id
		"idAc": $("input.user_name").val()
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			$("span.a_modify").siblings().removeClass("modify_edit");
			$("span.a_modify").siblings().attr("disabled", "");
			layer.msg('保存成功', {
				icon: 1
			});
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info);
		}
	})
}
//渲染“所属行业”的下拉列表
function rankTrande() {
	var enterData = JSON.parse(localStorage.getItem("enter_str"));
	$("#industry").next().find('.layui-this').removeClass('layui-this');
	$("div.hangye dd").each(function() {
		if(enterData.intrade == $(this).attr("lay-value")) {
			var intradeOptionId = $(this).attr("lay-value");
			$("#industry").next().find("div input").val($(this).html());
			$(this).addClass('layui-this');
			$(this).siblings().removeClass('layui-this');
		}
	})
}
//渲染“接入方式”
function initAccessWay(){
	var enterData = JSON.parse(localStorage.getItem("enter_str"));
	$("#type").next().find('.layui-this').removeClass('layui-this');
	$("div.a_type dd").each(function() {
		if(enterData.accessWay == $(this).html()) {
			$("#type").next().find("div input").val($(this).html());
			$(this).addClass('layui-this');
			$(this).siblings().removeClass('layui-this');
		}
	})
}
