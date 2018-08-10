$(function() {
	//获取面包屑菜单
	$(".t11>a").html($("ul.ul_List>li.active").html());
	$(".t11>a").bind("click", function() {
		if($("div.secondOrder li.active").html() == "通用") {
			$("#changeLink").load("res/views/index/common.html");
		} else {
			$("#changeLink").load("res/views/index/page.html");
		}
		$("div.trainTop").show();
	})
})
//保存（固定对话的保存 1.模糊匹配+固定回答 2.关键词匹配+固定回答）
function save() {
	//匹配类型。1-模糊匹配，2-关键词匹配
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	if(editCheckIsSubmit() == false) {
		return false;
	}
	//账号id
	var idAc = $("input.user_name").val();
	var idDt = localStorage.getItem("iddts");
	//脚本数据---script
	var script = new Object();
	var footData = $("textarea#script").val();

	if(aptype == 1) {
		//人说的话---awords  [{"question":"你是谁"},{"question":"你是谁"},{"question":"你是谁"}]
		var awords = [];
		var keywords = "";
		$("input.mohu").each(function() {
			var speaking = new Object();
			speaking.question = $(this).val();
			awords.push(speaking);
		})
		var awords = JSON.stringify(awords)
	} else if(aptype == 2) {
		//关键词+同义词---keywords  [{"id":"","value":[{"wkey":"今天","near":"天气|气候"},{"wkey":"今天","near":"天气|气候"}]},{"id":"","value":[{"wkey":"今天","near":"天气|气候"},{"wkey":"今天","near":"天气|气候"}]}];
		var awords = "";
		var keywords = [];
		var k_list = new Object();
		var near = "";
		for(var i = 0; i < $("div.keyWorldList").length; i++) {
			var value = [];
			for(var j = 0; j < $("input.key").length; j++) {
				var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val();;
				if($("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val() == "") {
					continue
				}
				if(wkey == "undefined" || wkey == undefined) {
					break
				}
				if(wkey.indexOf("{") != -1) {
					var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").attr("groupcnname");
					var wdyna = wkey;
					var wkey = "";
					var wtype = "2";
					var near = "";
				} else {
					var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val();;
					var wkey = wkey;
					var wdyna = "";
					var wtype = "1";
					/*var near = $("div.keyWorldList:eq(" + i + ")").find(".singleKeyWorld:eq(" + j + ")").attr("near");*/
					var near = ""
					var nears = $("div.keyWorldList:eq(" + i + ")").find(".bootstrap-tagsinput:eq(" + j + ")").find("span.tag");
					for(var k = 0; k < nears.length; k++) {
						console.log(near)
						near += $("div.keyWorldList:eq(" + i + ")").find(".bootstrap-tagsinput:eq(" + j + ")").find("span.tag:eq(" + k + ")").text() + "|"
					}
					if(near.length > 0) {
						near = near.substr(0, near.length - 1);
					}
				}

				//alert(near.replace(new RegExp(",",'gm'),'|'))
				var valueMsg = new Object();
				valueMsg.wdyna = wdyna;
				valueMsg.near = near;
				valueMsg.wpara = "";
				valueMsg.wkey = wkey;
				valueMsg.wtype = wtype;
				value.push(valueMsg);
				k_list.id = "";
				k_list.value = value;
				//var k_list={"id":"","value":JSON.stringify(value)};
				$("div.keyWorldList:eq(" + i + ")").attr("msg", JSON.stringify(k_list))
			}
			if($("div.keyWorldList:eq(" + i + ")").attr("msg") == "undefined" || $("div.keyWorldList:eq(" + i + ")").attr("msg") == undefined) {

			} else {
				keywords.push(JSON.parse($("div.keyWorldList:eq(" + i + ")").attr("msg")));
			}
			/*keywords.push(JSON.parse($("div.keyWorldList:eq(" + i + ")").attr("msg")));*/
		}
		if(keywords.length == 0) {
			layer.alert("关键词不能为空");
			return false
		}
		var keywords = JSON.stringify(keywords);
		console.log(keywords)
	}
	//固定回答---answer  [{"answer":"我是小缘,我是小缘气象机器人"},{"answer":"我是小缘,我是小缘气象机器人"}]
	var answer = [];
	$("input.fixed_answer").each(function() {
		var answing = new Object();
		answing.answer = $(this).val();
		answer.push(answing)
	})
	getAjax($ctx + "addFixedDialog", {
		"idAc": idAc,
		"idDt": idDt,
		"awords": awords,
		"keywords": keywords,
		"anwers": JSON.stringify(answer),
		"script": footData,
		"aptype": aptype,
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			layer.alert("添加成功", function(index) {
				if($("div.secondOrder li.active").html() == "通用") {
					$("#changeLink").load("res/views/index/common.html");
				} else {
					$("#changeLink").load("res/views/index/page.html");
				}
				$("div.trainTop").show();
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

}
//保存（关键词匹配+接口回答）
function saveInterface() {
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	if(editCheckIsSubmit() == false) {
		return false;
	}
	match()
	//数据接口id
	var idDi = $("input#interList").attr("idDi")
	//账号id
	var idAc = $("input.user_name").val();
	//对话库类别id
	var idDt = localStorage.getItem("iddts");
	//人说的话
	var awords = "";
	//keywords   	关键词(wkey)+url参数(wpara)+动态词类型(wdyna) + 关键词类型(wtype)+同义词(near) 关键词类型。1-固定，2-变化 如果为变化关键词则无同义词\ 关键词
	var keywords = [];
	var k_list = new Object();
	var near = "";
	for(var i = 0; i < $("div.keyWorldList").length; i++) {
		var value = [];
		for(var j = 0; j < $("input.key").length; j++) {
			var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val();;
			if($("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val() == "") {
				continue
			}
			if(wkey == "undefined" || wkey == undefined) {
				break
			}
			if(wkey.indexOf("{") != -1) {
				var wdyna = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").attr("groupcnname");
				var wkey = "";
				var wtype = "2";
				var near = "";
				var wpara = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").attr("paramname"); //参数值
			} else {
				var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val();;
				var wkey = wkey;
				var wdyna = "";
				var wtype = "1";
				/*var near = $("div.keyWorldList:eq(" + i + ")").find(".singleKeyWorld:eq(" + j + ")").attr("near");*/
				var near = ""
				var nears = $("div.keyWorldList:eq(" + i + ")").find(".bootstrap-tagsinput:eq(" + j + ")").find("span.tag");
				for(var k = 0; k < nears.length; k++) {
					console.log(near)
					near += $("div.keyWorldList:eq(" + i + ")").find(".bootstrap-tagsinput:eq(" + j + ")").find("span.tag:eq(" + k + ")").text() + "|"
				}
				if(near.length > 0) {
					near = near.substr(0, near.length - 1);
				}
				var wpara = ""
			}
			var valueMsg = new Object();
			valueMsg.wdyna = wdyna;
			valueMsg.near = near;
			valueMsg.wpara = wpara;
			valueMsg.wkey = wkey;
			valueMsg.wtype = wtype;
			value.push(valueMsg);
			k_list.id = "";
			k_list.value = value;
			//var k_list={"id":"","value":JSON.stringify(value)};
			$("div.keyWorldList:eq(" + i + ")").attr("msg", JSON.stringify(k_list))
		}
		if($("div.keyWorldList:eq(" + i + ")").attr("msg") == "undefined" || $("div.keyWorldList:eq(" + i + ")").attr("msg") == undefined) {

		} else {
			keywords.push(JSON.parse($("div.keyWorldList:eq(" + i + ")").attr("msg")));
		}
		/*keywords.push(JSON.parse($("div.keyWorldList:eq(" + i + ")").attr("msg")));*/
	}
	if(keywords.length == 0) {
		layer.alert("关键词不能为空");
		return false
	}
	var keywords = JSON.stringify(keywords);

	//stype	是否返回脚本 1-无，2-接口中返回，3-自定义返回。 当为接口应答时，该字段才有意义
	var stype = $("div.layui-form-radioed").prev().val();
	if(stype == 1 || stype == 2) {
		//script 返回脚本数组
		var script = [];
		var scriptObj = new Object();
		scriptObj.id = "";
		scriptObj.repara = "";
		scriptObj.sin = "";
		scriptObj.sinword = "";
		scriptObj.scripts = "";
		script.push(scriptObj);
	} else {
		var script = [];
		for(var i = 0; i < $("div.radioDiv").length; i++) {
			var $this = $("div.radioDiv:eq(" + i + ")")
			var repara = $this.find("div.script_t0>input").val();
			var sin = $this.find("dd.layui-this").attr("lay-value");
			var sinword = $this.attr("near");
			var scripts = $this.find("textarea").val();
			var scriptObj = new Object();
			scriptObj.repara = repara;
			scriptObj.sin = sin;
			scriptObj.sinword = sinword;
			scriptObj.scripts = scripts;
			script.push(scriptObj);
		}
	}
	var script = JSON.stringify(script)
	//aptype 匹配类型。1-模糊匹配，2-关键词匹配
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	getAjax($ctx + "addIDialog", {
		"idAc": idAc,
		"idDt": idDt,
		"awords": awords,
		"keywords": keywords,
		"stype": stype,
		"script": script,
		"aptype": aptype,
		"idDi": idDi
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			layer.alert("添加成功", function(index) {
				if($("div.secondOrder li.active").html() == "通用") {
					$("#changeLink").load("res/views/index/common.html");
				} else {
					$("#changeLink").load("res/views/index/page.html");
				}
				$("div.trainTop").show();
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
}