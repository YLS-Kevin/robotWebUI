$(function() {
	initInputtags();
	$(".t1>a").html(localStorage.getItem("cname"));
	//返回上一级导航
	$("span.t1").bind("click", function() {
		$("div#robotDiv").load("res/views/index/table.html");
		$("div.m_robot").show();
	})
	layui.use(['form', 'table'], function() {
		var form = layui.form,
			table1 = layui.table,
			table2 = layui.table;
		form.render();
	});
	getOrder()
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
}
//点击菜单切换
function changeTab() {
	$("div.secondOrder li.orderlist").unbind("click").bind("click", function(event) {
		event.stopPropagation();
		var $this = $(this);
		$(this).addClass("active").siblings().removeClass("active");
		$("div.searchInfos").attr("searchInfos","")
		if($(this).attr("name") == "common") {
			$("div#changeLink").load("res/views/index/common.html");
		} else if($(this).attr("name") == "page") {
			$("div#changeLink").load("res/views/index/page.html");
		}		
		//删除之后的页面上的其他内容的显示
		$("div.orderInfo").show()
		$("div.dialog_content").show();
		$("div#changeLink").show();
	})
}

//添加“主页”
function addPage() {
	$("li.addBtn").bind("click", function() {
		$("div.bootstrap-tagsinput").find("input").show();
		$('input[name=enter_anwer1]').tagsinput('removeAll');
		$('input[name=enter_anwer1]').attr("near", "")
		$("input[name=model]").val("");
		layer.open({
			type: 1,
			skin: '', //加上边框
			area: ['500px', '300px'], //宽高
			content: $("#ids"),
			btn: ['确认', '取消'],
			yes: function(index, layero) {
				var dokeyArr = $("input[name=enter_anwer1]").attr("near").replace(/[\s\|]/g, ",").split(",")
				if($("input[name=model]").val() == "") {
					layer.alert("情景模块名称不能为空");
					return false;
				}
				if($("input[name=enter_anwer1]").attr("near") == "") {
					layer.alert("触发关键词不能为空");
					return false;
				}
				if(dokeyArr.length > 5) {
					layer.alert("触发关键词最多不能超过5个");
					return false;
				}
				getAjax($ctx + "addRobotModel", {
					"cid": localStorage.getItem("cid"),
					"mname": $("input[name=model]").val(),
					"dokey": $("input[name=enter_anwer1]").attr("near"),
					"idAc": $("input.user_name").val(),
					"cidMIdDt": $("li.orderlist:eq(0)").attr("idDts"),
					"cidM":$("li.orderlist:eq(0)").attr("idM")
				}, "post", function(data, status) {
					if(data.ret == 0) {
						var order = "";
						order = "<li class='orderlist' name='page' dialogId=" + data.returnData.dialogId + " idDts=" + data.returnData.idDt + " idM=" + data.returnData.cidM + " iscommon='2' dokey=" + $("input[name=enter_anwer1]").attr("near") + ">" + $("input[name=model]").val() + "</li>";
						var num = $("div.secondOrder>ul.ul_List>li.orderlist").length - 1;
						$("div.secondOrder>ul.ul_List>li.orderlist:eq(" + num + ")").after(order);
						layer.closeAll();
						$("li[dialogId=" + data.returnData.dialogId + "]").addClass("active").siblings().removeClass("active")
						$("div#changeLink").load("res/views/index/page.html");
						//var $this = $("li[dialogId=" + data.returnData.dialogId + "]")
						//getRobotList($this);
						changeTab();
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

//获取训练机器人的菜单项
function getOrder() {
	getAjax($ctx + "getRobotInfoByIdAndMid", {
		"cid": localStorage.getItem("cid"),
		"idM": localStorage.getItem("idM"),
		"iscommon": localStorage.getItem("iscommon"),
		"sizeSingle": 10,
		"pageSingle": 1,
		"stateDialog": '',
		"descSingle": "",
		"descSingleCol": "",
		"keyword": '',
		"isI": 2
	}, "get", function(data, status) {
		if(data.ret == 0) {
			//菜单列表
			var mnameList = data.returnData.mnameList;
			for(var i = 0; i < mnameList.length; i++) {
				var liHTML = '';
				if(mnameList[i].mname == "通用") {
					var str = mnameList.splice(i, 1);
					mnameList.unshift(str[0]);
					console.log(mnameList)
				}
			}
			for(var j = 0; j < mnameList.length; j++) {
				if(j == 0) {
					liHTML = '<li class="orderlist active" name="common" dialogId="' + data.returnData.dialogId + '" iscommon="' + mnameList[j].iscommon + '" cid="' + mnameList[j].cid + '" idM="' + mnameList[j].cidM + '" idDts="' + mnameList[j].idDts + '" dokey="' + mnameList[j].dokey + '">' + mnameList[j].mname + '</li>'
					$("p.order_title").html(mnameList[j].mname);
				} else {
					liHTML = '<li class="orderlist"  name="page" dialogId="' + data.returnData.dialogId + '" iscommon="' + mnameList[j].iscommon + '" cid="' + mnameList[j].cid + '" idM="' + mnameList[j].cidM + '" idDts="' + mnameList[j].idDts + '" dokey="' + mnameList[j].dokey + '">' + mnameList[j].mname + '</li>'
				}
				$("div.secondOrder>ul.ul_List").append(liHTML);
			}
			var num = mnameList.length - 1
			$("div.secondOrder>ul.ul_List>li:eq(" + num + ")").after('<li class="addBtn">+</li>')
			$("div#changeLink").load("res/views/index/common.html");
			changeTab();
			addPage() //添加主页
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info)
		}
	})
}
/*机器人聊天功能*/
//点击“交流体验”按钮
$("div.experiance>img").bind("click", function() {
	$("div.contentDiv").show();
	$("span.robot_name").html(localStorage.getItem("cname"));
	event.stopPropagation()
})
//点击“关闭”按钮
$("span.close").bind("click", function(event) {
	$("div.contentDiv").hide();
	event.stopPropagation()
})
//点击“发送”开始聊天
$("button#send").bind("click", function() {
	chatting();
})
//回车提交聊天内容
$("input#chatMsg").keydown(function(event) {
	if(event.keyCode == 13) {
		chatting();
	}
})

function chatting() {
	var len = $("ul#contentUL>li").length - 1;
	var chatMsg = $("input#chatMsg").val();
	if(chatMsg == ""){
		$("p.error").show();
		setTimeout(function(){
			$("p.error").hide();
		},1000)
		return false
	}
	$("p.error").hide()
	var msg = '<li class="layim-chat-mine">' +
		'<div class="layim-chat-user"><img src="./res/image/user/userIcon.png"></div>' +
		'<div class="layim-chat-text">' + chatMsg + '</div>' +
		'</li>'
	$("ul#contentUL").find("li:eq(" + len + ")").after(msg);
	getAjax($ctx + "interfaceDebug", {
		"acid": $("input.user_name").val(), //账户id
		"cid_m": $("ul.ul_List>li.active").attr("idm"), //机器人模块id
		"cid": $("li.orderlist:eq(0)").attr("cid"), //机器人id
		"info": chatMsg //人说的话
	}, "post", function(data, status) {
		if(data.ret == 0) {
			$("input#chatMsg").val("");
			var returnData = JSON.parse(data.returnData)
			if(returnData.ret == 1) {
				var answer = returnData.returnData.result;
			}else if(returnData.ret == 10 || returnData.ret == 9){
				var answer = returnData.returnData.result;
			} else if(data.ret == 0) {
				var answer = returnData.info;
			}
			var l = $("ul#contentUL>li").length - 1;
			var answerHTML = "";
			var answerHTML = '<li class="">' +
				'<div class="layim-chat-user">' +
				'<img src="./res/image/index/r_icon.png">' +
				'</div>' +
				'<div class="layim-chat-text">' + answer + '</div>' +
				'</li>'
			$("ul#contentUL").find("li:eq(" + l + ")").after(answerHTML);
			$('#contentUL').scrollTop( $('#contentUL')[0].scrollHeight);
		} else if(data.ret == 20003) {
			layer.alert(data.info, function() {
				window.open("res/views/user/login.html", "_self");
			})
		} else {
			layer.alert(data.info);
		}
	})
}
//清除消息记录
$("p.chatTitle>a").bind("click", function() {
	$("ul#contentUL").find("li:eq(0)").siblings().remove()
})