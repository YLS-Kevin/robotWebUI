$(function() {
	//获取面包屑导航	
	$("span.t2>a").html(localStorage.getItem("name"));
	layui.use(['element', 'form'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		layui.use('form', function() {
			var form = layui.form;
			form.render();
		})
	})
	initInputtags()
	$("div.layui-input-block div.bootstrap-tagsinput").find("input").css("display", "inline-block");
})
//初始化inputtags
function initInputtags() {
	$('input').on('itemAdded', function(event) {
		//var a = $(this).val().replace(/,/g, '|');
		$(this).parent().parent().attr("near", $(this).val())
	});
	$('input').on('itemRemoved', function(event) {
		//var a = $(this).val().replace(/,/g, '|');
		$(this).parent().parent().attr("near", $(this).val())
	});
	//过滤掉特殊字符，在输入同义词的时候
	$("div.bootstrap-tagsinput>input").keyup(function() {
		if(!(/^[a-zA-Z0-9\u4e00-\u9fa5\""]+$/).test($(this).val())) {
			$(this).val($(this).val().replace(/[^\u4e00-\u9fa5\w]/g, ""));
		}
	})
}
//点击确认
$("button.submitBtn").bind("click", function() {
	var noun = $("input[name=noun]").val();
	var wften = $("input[name=count]").val();
	var nounReg = /^[a-zA-Z0-9\u4e00-\u9fa5\""]+$/; //必须是中文，英文下划线或者数字
	if(noun.length > 31 || noun.length == 0) {
		layer.alert("您输入动态词并且长度不能超过30位")
		return false;
	}
	if(wften.length == 0) {
		layer.alert("您输入的词频的数量")
		return false;
	}
	if($("div.layui-form-switch").hasClass("layui-form-onswitch")) {
		var state = 1;
	} else {
		var state = 2;
	}
	var near = $("div.bootstrap-tagsinput>span");
	var nearWord = "";
	for(var i = 0; i < near.length; i++) {
		nearWord += $("div.bootstrap-tagsinput>span:eq(" + i + ")").text() + ","
	}
	if(nearWord.length > 0) {
		nearWord = nearWord.substr(0, nearWord.length - 1);
	}
	for(var i = 0; i < nearWord.split(",").length; i++) {
		if(nearWord.split(",")[i] == noun) {
			layer.alert("您输入的同义词中不能与动态词相同")
			return;
		}
	}
	getAjax($ctx + "addReplaceDynaWord", {
		idDwg: localStorage.getItem("groupId"),
		wname: noun,
		idAc: $("input.user_name").val(),
		wften: wften,
		state: state,
		remarks: $("textarea[name=note]").val(),
		synonym: nearWord
	}, "post", function(data, status) {
		if(data.ret == 0) {
			layer.alert("新增成功", function() {
				window.open("#/word/words", "_self");
				layer.closeAll();
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
})