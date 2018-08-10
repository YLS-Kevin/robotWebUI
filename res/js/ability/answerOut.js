$(function() {
	$(".t1>a").html(localStorage.getItem("dname"));
	$(".t3>a").html($("li.themeActive").find("a").html());
	$("span.t3>a").bind('click', function() {
		$("div#duolun_main").load("res/views/ability/themeTable.html");
	})
})
//保存（关键词匹配+接口回答 模糊匹配+固定回答 关键词匹配+固定回答）
function saveInterface() {
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	if(editCheckIsSubmit() == false) {
		return false;
	}
	match()
	//账号id
	var idAc = $("input.user_name").val();
	//对话库类别id
	var idDt = localStorage.getItem("idDt");
	//aptype 匹配类型。1-模糊匹配，2-关键词匹配
	var aptype = $("div.part_one li.layui-this").attr("aptype");
	if(aptype == 1) {
		//人说的话---awords  [{"question":"你是谁"},{"question":"你是谁"},{"question":"你是谁"}]
		var awords = [];
		var keywords = "";
		$("input.mohu").each(function() {
			var speaking = new Object();
			speaking.question = $(this).val();
			awords.push(speaking);
		})
		var awords = JSON.stringify(awords);
	} else if(aptype == 2) {
		//关键词+同义词---keywords  [{"id":"","value":[{"wkey":"今天","near":"天气|气候"},{"wkey":"今天","near":"天气|气候"}]},{"id":"","value":[{"wkey":"今天","near":"天气|气候"},{"wkey":"今天","near":"天气|气候"}]}];
		var awords = "";
		var keywords = [];
		var k_list = new Object();
		var near = "";
		for(var i = 0; i < $("div.keyWorldList").length; i++) {
			var value = [];
			for(var j = 0; j < $("input.key").length; j++) {
				var wkey = $("div.keyWorldList:eq(" + i + ")").find("input.key:eq(" + j + ")").val();
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
	}
	//对话类别 2固定对话  3 接口回答
	var isInterface = $("div.part_two li.layui-this").attr("isInterface");
	if(isInterface == 2) {
		var idDi = ""; //数据接口
		var stype = 1; //是否返回脚本
		var answer = [];
		$("input.fixed_answer").each(function() {
			var answing = new Object();
			answing.answer = $(this).val();
			answer.push(answing)
		})
		var answer = JSON.stringify(answer);
		var script = [];
		var footData = $("textarea#script").val();
		var scriptObj = new Object();
		scriptObj.repara = '';
		scriptObj.sin = '';
		scriptObj.sinword = '';
		scriptObj.scripts = footData;
		script.push(scriptObj);
		var script = JSON.stringify(script)
	} else if(isInterface == 3) {
		//数据接口id
		var idDi = $("input#interList").attr("idDi");
		//stype	是否返回脚本 1-无，2-接口中返回，3-自定义返回。 当为接口应答时，该字段才有意义
		var stype = $("div.layui-form-radioed").prev().val();
		var answer = "";
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
	}
	getAjax($ctx + "addMulDialog", {
		"keywords": keywords,
		"awords": awords,
		"stype": stype,
		"script": script,
		"aptype": aptype,
		"atype": localStorage.getItem("atype"),
		"idAp": $("li.themeActive").attr("t_id"),
		"idAc": idAc,
		"idDt": idDt,
		"idDi": idDi,
		"anwers": answer,
		"type": isInterface
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			layer.alert("新增成功", function(index) {
				$("div#duolun_main").load("res/views/ability/themeTable.html");
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