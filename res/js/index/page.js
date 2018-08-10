$(function() {
	initInputtags();
	delModule();
	editModule();
	var dokey = $("ul.ul_List>li.active").attr("dokey").replace(/[\s\|]/g, ",");
	$("input[name=enter_anwer]").val(dokey);
	$("input[name=enter_anwer]").attr("near", dokey.replace(/,/g, '|'));
	$("input[name=enter_anwer]").tagsinput();
	$("p.order_title").html($("div.secondOrder li.active").html());
})
//初始化inputtags
function initInputtags() {
	$('input').on('itemAdded', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).attr("near", a)
	});
	$('input').on('itemRemoved', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).attr("near", a)
	});
	$('input[name=enter_anwer]').on('itemRemoved', function(event) {
		var a = $(this).val().replace(/,/g, '|');
		$(this).attr("near", a);
		loadMsg();
		event.stopPropagation();
	});
}
//修改
$("a.modify_token").bind("click", function(event) {
	$("div.bootstrap-tagsinput").find("input").show();
	$("div.bootstrap-tagsinput").find("input").focus();
	$("div.bootstrap-tagsinput").addClass("borderActive");
	event.stopPropagation();
})
$("div.noborder").bind("click", function(event) {
	event.stopPropagation();
})
$("ul.ul_List").bind("click", function(event) {
	event.stopPropagation();
})
//点击空白处提交
$("div.tainMAin").unbind("click").bind("click", function(event) {
	if($("input[name=enter_anwer]").prev().hasClass("borderActive")) {
		loadMsg();
	}
});

function loadMsg() {
	var dokeyArr = $("input[name=enter_anwer]").attr("near").replace(/[\s\|]/g, ",").split(",");
	if(dokeyArr.length > 5) {
		layer.msg("触发关键词最多不能超过5个", {
			icon: 0,
			time: 800
		});
		return false;
	}
	if($("input[name=enter_anwer]").attr("near") == "") {
		layer.msg("触发问题不能为空", {
			icon: 0,
			time: 800
		});
		return false;
	}
	getAjax($ctx + "configRobot", {
		"cid": localStorage.getItem("cid"),
		"answer": '',
		"stype": '',
		"iconurl": '',
		"idM": $("ul.ul_List>li.active").attr("idM"),
		"dokey": $("input[name=enter_anwer]").attr("near").replace(/,/g, '|'),
		"idAc": $("input.user_name").val(),
		"isModifyDoKey": 1,
		"cidMIdDt": $("li.orderlist:eq(0)").attr("idDts"),
		"dialogId": $("input.dokeyId").attr("dialogId"),
		"idDt": $("li.active").attr("idDts"),
	}, 'post', function(data, status) {
		if(data.ret == 0) {
			$("input[name=enter_anwer]").prev().removeClass("borderActive");
			$("ul.ul_List>li.active").attr("dokey", $("input[name=enter_anwer]").attr("near").replace(/,/g, '|'))
			$("div.bootstrap-tagsinput").children("input").hide();
			$("div.bootstrap-tagsinput").children("input").blur();
			layer.msg('保存成功', {
				icon: 1,
				time: 800
			},function(){
				info(1,10)
			});
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info);
		}
	})
}
//点击删除该模块
function delModule() {
	$("img.delIcon").bind("click", function() {
		layer.open({
			type: 1,
			skin: '', //加上边框
			area: ['280px', '180px'], //宽高
			content: $("#idDel"),
			btn: ['确认', '取消'],
			yes: function(index, layero) {
				getAjax($ctx + "delRobotModelById", {
					idM: $("ul.ul_List>li.active").attr("idM")
				}, "post", function(data, status) {
					if(data.ret == 0) {
						layer.alert("该模块已经删除成功", function(index) {
							$("div.secondOrder li.active").remove();
							var len = $("div.secondOrder li").length - 2;
							$("div.secondOrder li:eq(" + len + ")").addClass("active");
							if($("div.secondOrder li").length == 2) {
								location.reload()
							} else {
								$("div#changeLink").load("res/views/index/page.html");
								linkList()
							}
							layui.layer.close(index);
						})
					} else if(data.ret == 20003) {
						layer.alert(data.info, function() {
							window.open("res/views/user/login.html", "_self");
						})
					} else {
						layer.alert(data.info);
					}
				})
				layui.layer.close(index);
			},
			cancel: function(index, layero) {
				layui.layer.close(index);
			}
		});
	})
}
//点击修改该情景模块
function editModule() {
	$("img.editIcon").bind("click", function() {
		//获取要修改的idM
		$("input#modifyMsg").attr("idM", $("ul.ul_List>li.active").attr("idM"));
		//获取情景模块名称
		$("input[name=editmodel]").val($("li.active").html());
		layer.open({
			type: 1,
			skin: '', //加上边框
			area: ['400px', '200px'], //宽高
			content: $("#idEdit"),
			btn: ['确认', '取消'],
			yes: function(index, layero) {
				getAjax($ctx + "modifyRobotModelById", {
					'idM': $("input#modifyMsg").attr("idM"),
					'mname': $("input[name=editmodel]").val(),
					'dokey': '' /*$("input[name=editenter_anwer]").attr("near")*/
				}, "post", function(data, status) {
					if(data.ret == 0) {
						var newTitle = $("input[name=editmodel]").val();
						$("ul.ul_List>li.active").html(newTitle); /*修改情景模块名称*/
						$("p.order_title").html(newTitle); /*修改情景模块名称下面的titlte*/
						$("input[name=enter_anwer]").attr("near", $("input[name=editenter_anwer]").attr("near"));
						$("li.active").attr("dokey", $("input[name=editenter_anwer]").attr("near"));
						$("div#changeLink").load("res/views/index/page.html");
						linkList()
						layui.layer.close(index);
						//layer.alert("修改成功");
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
}

function linkList() {
	getAjax($ctx + "getRobotInfoByIdAndMid", {
		"cid": localStorage.getItem("cid"),
		"idM": $("li.active").attr("idM"),
		"iscommon": $("li.active").attr("iscommon"),
		"sizeSingle": 5,
		"pageSingle": 1,
		"stateDialog": '',
		"descSingle": "",
		"descSingleCol": "",
		"keyword": '',
		"isI": 2
	}, "get", function(data, status) {
		if(data.ret == 0) {
			//新能力的列表
			var abalityList = data.returnData.abalityList
			for(var i = 0; i < abalityList.length; i++) {
				var li = '';
				var first = abalityList[i].atname.charAt(0)
				li = '<li id="' + abalityList[i].id + '"><span class="title">' + first + '</span><span class="name"><span>' + abalityList[i].atname + '</span></span></li>'
				$("div.abilityList ul").append(li);
			}

			initBG1();
			//触发关键字
			var dokey = data.returnData.dokey;
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}