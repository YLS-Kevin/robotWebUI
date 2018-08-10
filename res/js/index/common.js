$(function() {
	//上传机器人图标
	layui.use(['upload'], function() {
		var $ = layui.jquery,
			upload = layui.upload;
		//多图片上传
		upload.render({
			elem: '#test2',
			url: $ctx + '/uploadImage/',
			before: function(obj) {
				//预读本地文件示例，不支持ie8
				obj.preview(function(index, file, result) {
					$('#demo2').empty().append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
				});
			},
			done: function(res) {
				getAjax($ctx + "configRobot", {
					"cid": localStorage.getItem("cid"),
					"answer": '',
					"stype": '',
					"iconurl": res.returnData,
					"idM": localStorage.getItem("idM"),
					"dokey": '',
					"idAc": $("input.user_name").val(),
					"isModifyDoKey":2,
					"cidMIdDt":"",
					"dialogId":"",
					"idDt":""
				}, 'post', function(data, status) {
					if(data.ret == 0) {
						layer.msg('图片上传成功',{icon:1,time:800});
					} else if(data.ret == 20003) {
						layer.alert(data.info, function() {
							window.open("res/views/user/login.html", "_self");
						})
					} else {
						layer.alert(data.info);
					}
				})
			}
		});
	});
})
//修改文本框的信息
$("div.layui-input-block>a.xiugai").bind("click", function(event) {
	$(this).parent().children("input").addClass("borderActive");
	$(this).parent().children("input").removeAttr("disabled");
	$(this).parent().children("input").focus()
	$(this).parent().siblings().children("input").attr("disabled", "disabled");
	$(this).parent().siblings().children("input").removeClass("borderActive");
	event.stopPropagation();
})
$("div.layui-input-block>input.input").bind("click", function(event) {
	event.stopPropagation();
})
//点击空白处提交
$("div#changeLink").unbind("click").bind("click",function(e){
	var _con=$("input[name=catch]");
	var _con1=$("input[name=none]");
	if(!_con.is(e.target) && _con.hasClass("borderActive")){
		checkForm1()
	}
	if(!_con1.is(e.target) && _con1.hasClass("borderActive")){
		checkForm2()
	}
})
//点击回车提交
$("div.layui-input-block>input.input1").keydown(function(event) {
	if(event.keyCode == "13") { //keyCode=13是回车键
		checkForm1()
	}
});
$("div.layui-input-block>input.input2").keydown(function(event) {
	if(event.keyCode == "13") { //keyCode=13是回车键
		checkForm2()
	}
});
function checkForm1() {
	var catch2 = $("input[name=catch]").val();
	if(catch2 == "") {
		layer.msg('异常返回的回答不能为空',{icon:0,time:800});
		return false
	}else{
		submitNewMsgs()
	}
	
}
function checkForm2(){
	var none = $("input[name=none]").val();
	if(none == "") {
		layer.msg('对话返回的回答不能为空',{icon:0,time:800});
		return false
	}else{
		submitNewMsgs()
	}
}
function submitNewMsgs() {
	getAjax($ctx + "configRobot", {
		"cid": localStorage.getItem("cid"),
		"answer": $("input.borderActive").val(),
		"stype": $("input.borderActive").attr("stype"),
		"iconurl": '',
		"idM": $("ul.ul_List>li.active").attr("idM"),
		"dokey": '',
		"idAc": $("input.user_name").val(),
		"isModifyDoKey":2,
		"cidMIdDt":"",
		"dialogId":"",
		"idDt":""
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			$("div.layui-input-block>a").siblings().removeClass("borderActive");
			$("div.layui-input-block>a").siblings().attr("disabled", "");
			layer.msg('保存成功',{icon:1,time:800});
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info);
		}
	})
}