$(function() {
	getUserInfo();
	
})
//获取用户信息
function getUserInfo() {
	getAjax($ctx + "getUserHomeById", {
		userId: $("input.userId").val(),
	}, "get", function(data, status) {
		if(data.ret == 0) {			
			var msgs = data.returnData;
			$("input[name=name]").val(msgs.acountName);
			$("input[name=id]").val(msgs.idAc);
			$("input[name=pwd]").val(msgs.pwd);
			$("span.level").html(msgs.vipLevelName);
			$("input[name=tel]").val(msgs.telphone);
			$("input[name=email]").val(msgs.email);
			var currentDay = ''
			$("span.day").html("有效期至：" + (msgs.vipExpireTime).split(".")[0]);

		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}
//点击修改
$("div.layui-input-block>a.editName").bind("click", function(event) {
	$(this).prev().removeAttr("disabled");
	$(this).prev().addClass("borderActive");
	$(this).prev().focus();
	event.stopPropagation()
})
$("div.layui-input-block>input[name=name]").bind("click", function(event) {
	event.stopPropagation()
})
//点击空白处提交成功
$("body").click(function(event) {
	if($("input").hasClass("borderActive")) {
		$("div.layui-input-block>input[name=name]").removeClass("borderActive");
		$("div.layui-input-block>input[name=name]").attr("disabled", "");
		modifyNickName()
	}
});
//点击回车提交成功
$("input[name=name]").keydown(function(event) {
	if(event.keyCode == "13") { //keyCode=13是回车键
		if($("input").hasClass("borderActive")) {
			$(this).removeClass("borderActive");
			$(this).attr("disabled", "");
			modifyNickName()
		}
	}
});
//修改用户昵称
function modifyNickName() {
	if($("input[name=name]").val() == ""){
		$("input[name=name]").removeAttr("disabled");
	    $("input[name=name]").addClass("borderActive");
	    $("input[name=name]").focus();
		layer.msg('账户名称不能为空',{icon:0});
		return false;
	}
	getAjax($ctx + "updateUserById", {
		accountName: $("input[name=name]").val(),
		userId: $("input.userId").val(),
	}, "post", function(data, status) {
		if(data.ret == 0) {
			layer.msg('修改账户名称成功',{icon:1});
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}
//修改密码
$("a.editPwd").bind("click", function(data, status) {
	$("input[name=newpwd1]").val("");
	$("input[name=newpwd2]").val("");
	layer.open({
		type: 1,
		skin: '', //加上边框
		area: ['400px', '240px'], //宽高
		content: $("#modifyPwd"),
		btn: ['确认', '取消'],
		yes: function(index, layero) {
			if($("input[name=newpwd1]").val() != $("input[name=newpwd2]").val()){
				layer.alert("请确保两次填写的密码一致");
				return false;
			}
			getAjax($ctx + "updateUserPwd", {
				userId: $("input.userId").val(),
				pwd: $("input[name=newpwd1]").val()
			}, "post", function(data, status) {
				if(data.ret == 0) {
					layui.layer.close(index);
					layer.alert("密码修改成功",function(){
						window.open("res/views/user/login.html", "_self");
					});
					/*getUserInfo();*/
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
			return false;
		},
		cancel: function(index, layero) {
			layui.layer.close(index);
		}
	});
})