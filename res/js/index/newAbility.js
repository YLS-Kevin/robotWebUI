$(function() {
	loadAbility()
})
//加载新能力
function loadAbility() {
	layui.use('form', function() {
		var form = layui.form;
		//渲染新能力列表
		setTimeout(function() {
			if($("input#key").val() == "") {
				atname = "";
			} else {
				atname = $("input#key").val()
			}
			getAjax($ctx + "listShareAbility", {
				"idAc": $("input#sid").val(),
				"atname": atname
			}, 'get', function(data, status) {
				if(data.ret == 0) {
					$("div.abilityList ul").empty();
					var data = data.returnData;
					for(var i = 0; i < data.length; i++) {
						var li = '';
						var first = data[i].atname.charAt(0)
						li = '<li id="' + data[i].id + '"><span class="title">' + first + '</span><span class="name"><span>' + data[i].atname + '</span><form class="layui-form"><input type="checkbox" name="' + data[i].atname + '" title="" lay-skin="primary" lay-filter="filter"></form></span></li>'
						$("div.abilityList ul").append(li);
						//$("div.abilityList li:eq("+i+")").find("input[type=checkbox]").prop("checked",true);
						form.render();
						var ids = $("input#sid").attr("ids");
						var arrIds = ids.split(",");
						for(var j = 0; j < arrIds.length; j++) {
							if(arrIds[j] == data[i].id) {
								$("div.abilityList li:eq(" + i + ")").find("input[type=checkbox]").prop("checked", true);
								form.render();
							}
						}

					}
					initBG();
				} else {
					layer.alert(data.info)
				}
			})
		}, 0)

	});
}
//渲染不同的列表的背景色
function initBG() {
	var li = $("div.abilityList li");
	for(var i = 0; i < li.length; i++) {
		var title = $("div.abilityList li:eq(" + i + ")").find("span.title");
		var name = $("div.abilityList li:eq(" + i + ")").find("span.name");
		if(i % 4 == 0) {
			title.css("background-color", "#79A3FF")
			name.css("background-color", "rgba(121,163,255,0.2)")
		} else if(i % 4 == 1) {
			title.css("background-color", "#FD8DA3");
			name.css("background-color", "rgba(253,141,163,0.2)");
		} else if(i % 4 == 2) {
			title.css("background-color", "#B1D081");
			name.css("background-color", "rgba(177,208,129,0.2)");
		} else if(i % 4 == 3) {
			title.css("background-color", "#FFCA7E");
			name.css("background-color", "rgba(255,202,126,0.2)")
		}
	}
}
//点击“完成”
$("div.abilityBtn>button").bind("click", function() {
	//获取机器人id
	var cid = localStorage.getItem("cid");
	//模块id
	var idM = $("input#sid").attr("idM")
	var arrBg = [],
		arrName = [],
		arrIds = [],
		arrBgAp = [];
	$("div.layui-form-checked").each(function(index) {
		var name = $(this).prev().attr("name");
		var id = $(this).parents("li").attr("id");
		var bgColor = $(this).prev().parents("span.name").prev().css("background-color");
		var ap = $(this).prev().parents("span.name").css("background-color");
		arrBg.push(bgColor);
		arrName.push(name);
		arrIds.push(id);
		arrBgAp.push(ap)
	})
	console.log(arrIds.toString())
	getAjax($ctx + "selectMulSkill", {
		"cid": cid,
		"idM": idM,
		"idDt": arrIds.toString()
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			var index = parent.layer.getFrameIndex(window.name);
			parent.$("#getA_List").attr("bgColor", arrBg);
			parent.$("#getA_List").attr("name", arrName);
			parent.$("#getA_List").attr("ap", arrBgAp);
			parent.$("#getA_List").val(0);
			parent.layer.close(index);
		} else {
			layer.alert(data.info)
		}
	})

})
//查询(按钮)
$("div.searchInput>i").bind("click", function() {
	alert(55)
	loadAbility()
})
//查询(回车)
$('input#key').keydown(function(event) {
	if(event.keyCode == 13) {
		loadAbility()
		return false;
	}
});