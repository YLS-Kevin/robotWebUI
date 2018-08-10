$(function() {
	jQuery.support.cors = true;
	init();
	if(document.querySelector && !window.addEventListener) {
		alert("为了您更好的体验，建议您使用版本较高的浏览器")
	}
})
var timer; //定义一个定时器
//渲染右边内容
function init() {
	layui.use(['element', 'form', 'layedit', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			layedit = layui.layedit
		layer = layui.layer
		form.verify({
			username: function(value, item) { //value：表单的值、item：表单的DOM对象
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/).test(value)) {
					return '请输入正确的手机号码';
				}
			},
			password: function(value, item) {
				/*if(!(/^[\S]{6,20}$/).test(value)) {
					return '密码必须6到20位，且不能出现空格';
				}
				if(!(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/).test(value)) {
					return '密码必须是英文字母和数字组成'
				}*/
			}, //[/^[\S]{6,20}$/, '密码必须6到20位，且不能出现空格']
			code: function(value, item) {

			}
		});
		//创建一个编辑器  
		layedit.build('LAY_demo_editor');
		//监听提交  
		form.on('submit(demo1)', function(e) {
			/*localStorage.setItem("idAc", "f6642f782b0b4c289b80acafc5ae27df");
			localStorage.setItem("userId", "7b4e6a21b1d34ca4a6b6c40739fb6702");
			window.open("../../../index.html", "_self");*/
			$.ajax({
				url: $ctx + "loginByPhone",
				data: {
					"telphone": $("input[name=username]").val(), //'18682484125',//$("input[name=username]").val(),
					"pwd": $("input[type=password]").val() //$("input[type=password]").val()
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				xhrFields: {
					withCredentials: true
				},
				type: "post",
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(res) {
					if(res.ret == 0) {
						window.open("../../../index.html", "_self");
						localStorage.setItem("idAc", res.returnData.idAc);
						localStorage.setItem("userId", res.returnData.userid);
						localStorage.setItem("nickName", res.returnData.nickName)
					} else {
						layer.alert(res.info)
					}

				},
				error: function(res) {
					layer.alert(JSON.stringify(res) + "登录错误")
				}
			})
			return false;
		});
		form.on('submit(demo2)', function(e) {
			$.ajax({
				url: $ctx + "loginBySms",
				data: {
					"telphone": $("input#code_username").val(),
					"code": $("input#login_code").val()
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				},
				xhrFields: {
					withCredentials: true
				},
				type: "post",
				dataType: 'json',
				success: function(res) {
					if(res.ret == 0) {
						window.open("../../../index.html", "_self");
						localStorage.setItem("idAc", res.returnData.idAC);
						localStorage.setItem("userId", res.returnData.userId);
						localStorage.setItem("nickName", res.returnData.nickName)
					} else {
						layer.alert(res.info)
					}

				},
				error: function(res) {
					layer.alert(JSON.stringify(res) + "登录错误")
				}
			})
			return false;
		})
		element.on('tab(accountTab)', function(data) {
			//点击切换是所执行的方法
			$("input").val(""); //清空所有input中的值
			clearInterval(timer);
			$("button.sendCodeBtn").html("发送验证码");
			$("button.sendCodeBtn").css("background", "rgb(0,132,255)");
			$("button.sendCodeBtn").removeAttr("disabled");
		});
	})

}
//鼠标悬停的时候第三方icon变色
$("div.third_icons>img.qq").hover(function() {
	$(this).attr("src", "../../image/user/dl_dsf_qq_xz.png")
}, function() {
	$(this).attr("src", "../../image/user/dl_dsf_qq.png")
})
$("div.third_icons>img.wx").hover(function() {
	$(this).attr("src", "../../image/user/dl_dsf_wx_xz.png")
}, function() {
	$(this).attr("src", "../../image/user/dl_dsf_wx.png")
})
$("div.third_icons>img.wb").hover(function() {
	$(this).attr("src", "../../image/user/dl_dsf_wb_xz.png")
}, function() {
	$(this).attr("src", "../../image/user/dl_dsf_wb.png")
})
//点击发送验证码之前确定手机号已经填写
$("button.sendCodeBtn").bind("click", sendCode = function(e) {
	e.preventDefault();
	//username
	var username = $("input#code_username").val();
	if(!(/^1[3|4|5|8][0-9]\d{4,8}$/).test(username)) {
		layer.alert('请输入正确的手机号码', {
			title: '错误提示'
		})
		return false
	} else {
		//点击发送验证码
		var time = 60;
		$.ajax({
			url: $ctx + "sendLoginCode",
			data: {
				"telphone": $("input#code_username").val(),
				"nationcode": "86"
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			},
			xhrFields: {
				withCredentials: true
			},
			type: "post",
			dataType: 'json',
			success: function(res) {
				if(res.ret == 0) {
					timer = setInterval(function() {
						time--;
						var $this = $("button.sendCodeBtn");
						$this.html(time + "s后重试");
						$this.css("background", "#9F9F9F");
						$this.attr("disabled", "disabled");
						if(time == 0) {
							clearInterval(timer);
							$this.html("发送验证码");
							$this.css("background", "rgb(0,132,255)");
							$this.removeAttr("disabled");
						}
					}, 1000)
				} else {
					var $this = $("button.sendCodeBtn");
					clearInterval(timer);
					$this.html("发送验证码");
					$this.css("background", "rgb(0,132,255)");
					$this.removeAttr("disabled");
					layer.alert(res.info);
				}

			},
			error: function(res) {
				layer.alert(JSON.stringify(res) + "登录错误")
			}
		})
	}
})