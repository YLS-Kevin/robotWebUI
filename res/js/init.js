$(function() {
	jQuery.support.cors = true;
})
var $ctx = "http://127.0.0.1:8084/";
var getAjax = function(url, param, type, callback) {
	$.ajax({
		url: url,
		data: param,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			//$("#loading").html("提交中..."); //在后台返回success之前显示loading图标  
		},
		xhrFields: {
			withCredentials: true
		},
		dataType: 'JSON',
		type: type,
		success: callback,
		error: function(data) {
			layer.alert(data.info);
		}
	})
}

//日期的格式之差用阿里里计算有效期
function timeDifc(start, end) {
	var starts = new Date(start),
		ends = new Date(end),
		message = '';
	if(starts.getTime() > ends.getTime()) return message = "现在的时间小于以前的时间!";

	if((ends.getTime() - starts.getTime()) / (1000 * 60) < 1) return message = "刚刚";

	if(ends.getFullYear() > starts.getFullYear() && ends.getMonth() >= starts.getMonth()) message += ends.getFullYear() - starts.getFullYear() + "年";

	if(ends.getMonth() > starts.getMonth() && ends.getDate() >= starts.getDate()) message += ends.getMonth() - starts.getMonth() + "个月";

	if(ends.getDate() > starts.getDate() && ends.getHours() >= starts.getHours()) message += ends.getDate() - starts.getDate() + "天";

	if(ends.getHours() > starts.getHours() && ends.getMinutes() >= starts.getMinutes()) message += ends.getHours() - starts.getHours() + "小时";

	if(ends.getMinutes() > starts.getMinutes()) message += ends.getMinutes() - starts.getMinutes() + "分钟";

	return message;
};
//特殊符号的转义
var zhuanyi = function(str) {
	return str.replace("\"", "&quot;").replace("\"", "&quot;");
}
//初始化导航
function initNavOrder() {
	if($(window).width() <= 1024) {
		$(".layui-body").animate({
			left: '0px'
		});
		$(".layui-side").animate({
			left: "-200px"
		});
		$("img#closeBtn").animate({
			left: "0px"
		}, function() {
			$("img#closeBtn").attr("src", "./res/image/ability/open.png")
		})
		$(".layui-body").css("min-width", "1024px")
	} else {
		$(".layui-body").animate({
			left: '200px'
		});
		$(".layui-side").animate({
			left: "0px"
		});
		$("img#closeBtn").animate({
			left: "200px"
		}, function() {
			$("img#closeBtn").attr("src", "./res/image/ability/close.png")
		})
		$(".layui-body").css("min-width", "")
	}
}
//隐藏左侧导航栏
function hideLeft() {
	if($(window).width() <= 1024) {
		if($("img#closeBtn").attr("src") == "./res/image/ability/close.png") {
			$(".layui-body").animate({
				left: '0px'
			});
			$(".layui-side").animate({
				left: "-200px"
			});
			$("img#closeBtn").animate({
				left: "0px"
			}, function() {
				$("img#closeBtn").attr("src", "./res/image/ability/open.png")
			})
			$(".layui-body").css("min-width", "1024px")
		} else {
			$(".layui-body").animate({
				left: '0px'
			});
			$(".layui-side").animate({
				left: "0px"
			});
			$("img#closeBtn").animate({
				left: "200px"
			}, function() {
				$("img#closeBtn").attr("src", "./res/image/ability/close.png")
			})
			$(".layui-body").css("min-width", "1024px")
		}
	} else {
		if($("img#closeBtn").attr("src") == "./res/image/ability/close.png") {
			$(".layui-body").animate({
				left: '0px'
			});
			$(".layui-side").animate({
				left: "-200px"
			});
			$("img#closeBtn").animate({
				left: "0px"
			}, function() {
				$("img#closeBtn").attr("src", "./res/image/ability/open.png")
			})
			$(".layui-body").css("min-width", "1024px")
		} else {
			$(".layui-body").animate({
				left: '200px'
			});
			$(".layui-side").animate({
				left: "0px"
			});
			$("img#closeBtn").animate({
				left: "200px"
			}, function() {
				$("img#closeBtn").attr("src", "./res/image/ability/close.png")
			})
			$(".layui-body").css("min-width", "")
		}
	}

}

function isJsonString(str) {
	if(typeof str == 'string') {
		try {
			JSON.parse(str);
			return true;
		} catch(e) {
			console.log(e);
			return false;
		}
	}
	console.log('It is not a string!')
}