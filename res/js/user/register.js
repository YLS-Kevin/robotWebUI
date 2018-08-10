$(function() {
	jQuery.support.cors = true;
	init()
})
//渲染右边内容
function init() {
	layui.use(['element', 'form', 'laypage', 'layer'], function() {
		var element = layui.element, //元素操作
			form = layui.form,
			laypage = layui.laypage;
		form.verify({
			username: function(value, item) { //value：表单的值、item：表单的DOM对象
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/).test(value)) {
					return '请输入正确的手机号码';
				}
			},
			password: function(value, item) {
				if(!(/^[\S]{6,20}$/).test(value)) {
					return '密码必须6到20位，且不能出现空格';
				}
				if(!(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/).test(value)) {
					return '密码必须是英文字母和数字组成'
				}
			}, //[/^[\S]{6,20}$/, '密码必须6到20位，且不能出现空格']
			code: function(value, item) {

			},
			items: function(value, item) {
				var checked = $("input[type='checkbox']").siblings();
				if(checked.hasClass("layui-form-checked")) {
					return false;
				} else {
					return '请勾选《AI+用户服务协议》'
				}
			}
		});
		//监听提交  
		form.on('submit(register)', function(data) {
			getAjax($ctx + "register", {
				"telphone": $("input#code_username").val(),
				"pwd": $("input#reg_pwd").val(),
				"code": $("input#reg_code").val()
			}, 'post', function(data) {
				if(data.ret == 0) {
					layer.alert("注册成功",function(index){
						window.open("login.html", "_self");
						layer.close(index)
					})
					
				} else {
					layer.alert(data.info)
				}
			})
			return false;
		});
	})
}
//点击发送验证码之前确定手机号已经填写
$("button.sendCodeBtn").bind("click", sendCode = function(e) {
	e.preventDefault();
	//username
	var username = $("input#code_username").val();
	if(!(/^1[3|4|5|8][0-9]\d{4,8}$/).test(username)) {
		layer.alert('请输入正确的手机号码', {
			title: '提示'
		})
		return false
	} else {
		//点击发送验证码
		var time = 60;
		getAjax($ctx + "sendRegisterCode", {
			"telphone": username,
			"nationcode": "86"
		},'post',function(data, status) {
			if(data.ret == 0) {
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
				layer.alert(data.info);
			}
		})

	}
})