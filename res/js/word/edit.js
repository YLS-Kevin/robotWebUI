$(function() {
	layui.use(['element', 'form'], function() {
		var element = layui.element, //元素操作
			form = layui.form;
		layui.use('form', function() {
			var form = layui.form;
			form.render();
		})
	})
	var data = JSON.parse(localStorage.getItem("data"));
	//获取面包屑导航	
	$("span.t2>a").html(localStorage.getItem("name"));
	$("span.t33>a").html(data.wname);
	if(localStorage.getItem("isDefault") == 1){
		$("input[name='noun'] , input[name='count'] , input[name=state], textarea").attr("disabled","disabled");
	}else if(localStorage.getItem("isDefault") == 2){
	    $("input[name='noun'] , input[name='count'] , input[name=state], textarea").removeAttr("disabled");
	}
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
    //同义词
    
    $("div.nearinput").append('<input type="text" class="layui-input" value="'+data.synonym+'" data-role="tagsinput" placeholder="同义词" />')
    $('div.nearWord').attr("near",data.synonym)
    $('div.nearinput>input').tagsinput();
    initInputtags()
	$("div.bootstrap-tagsinput").find("input").css("display", "inline-block");
	//备注
	$("textarea").val(data.remarks)
})
//初始化inputtags
function initInputtags() {
	$('input').on('itemAdded', function(event) {
		$(this).parent().parent().attr("near", $(this).val())
	});
	$('input').on('itemRemoved', function(event) {
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
	var nearWord="";
	for(var i=0;i<near.length;i++){
		nearWord += $("div.bootstrap-tagsinput>span:eq("+i+")").text()+","
	}
	if(nearWord.length > 0) {
		nearWord = nearWord.substr(0, nearWord.length - 1);
	}
	for(var i=0; i<nearWord.split(",").length;i++){
		if(nearWord.split(",")[i] == $("input[name=noun]").val()){
			layer.alert("您输入的同义词中不能与动态词相同")
			return;
		}
	}
	getAjax($ctx + "modifyDynaWord", {
		id: JSON.parse(localStorage.getItem("data")).id,
		wname: noun,
		wften: wften,
		state: state,
		remarks: $("textarea[name=note]").val(),
		synonym: nearWord
	}, "post", function(data, status) {
		if(data.ret == 0) {
            layer.alert("修改成功", function() {
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