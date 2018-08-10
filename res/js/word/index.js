$(function() {
	initWordType();
})
//渲染动态词类型的列表
function initWordType() {
	getAjax($ctx + "listDynaWordType", {
		idAc: $("input.user_name").val(),
		page: 1,
		size: 10,
		groupName: $("input#key").val(),
		idAc: $("input.user_name").val(),
	}, "get", function(data, status) {
		if(data.ret == 0) {
			$("div.wordType>ul").empty();
			var list = data.returnData.list;
			init1(list)
			layui.use(['element', 'laypage', ], function() {
				var element = layui.element, //元素操作
					laypage = layui.laypage;
				laypage.render({
					elem: 'sharePage',
					count: data.returnData.total,
					limit: 10,
					layout:['prev', 'page', 'next', 'refresh', 'skip','count'],
					jump: function(obj, first) {
						if(!first) {
							$("div.wordType>ul").empty();
							getAjax($ctx + "listDynaWordType", {
								groupName: $("input#key").val(),
								page: obj.curr,
								size: obj.limit,
								idAc: $("input.user_name").val(),
							}, 'get', function(data, status) {
								if(data.ret == 0) {
									var list = data.returnData.list;
									init1(list)
								} else {

								}
							})
						}

					}
				})
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

function init1(list) {
	for(var i = 0; i < list.length; i++) {
		var firstName = list[i].groupCnName.charAt(0);
		if(list[i].isShare == 1) {
			state = "已共享";
			stateBtn = "取消共享"
			name = 0;
		} else {
			state = "未共享";
			stateBtn = "共享";
			name = 1;
		}
		var liHTML = "";
		liHTML = '<a href="#/word/words"><li class="wordList" isDefault="' + list[i].isDefault + '" groupId="' + list[i].id + '">' +
			'<p class="firstWord ">' + firstName + '</p>' +
			'<div class="names"><p class="name_ch">' + list[i].groupCnName + '</p>' +
			'<p class="name_en">' + list[i].groupName + '</p></div>' +
			'<p class="state" state="' + list[i].isShare + '">状态<span>&nbsp;&nbsp;●&nbsp;</span><span class="fare">' + state + '</span></p>' +
			'<p class="share" name="' + name + '"><span>' + stateBtn + '</span></p>'
		if(list[i].isDefault == 1) { //不可以删除和修改
			liHTML += ''
		} else { //2是可以删除和修改
			liHTML += '<p class="delete"><i class="layui-icon editIcon" style="color:rgb(30,191,8);margin-right:10px">&#xe642;</i><i class="layui-icon delIcon">&#xe640;</i></p>' 
		}
		liHTML += '</div>' +
			'</div>' +
			'</li></a>'
		$("div.wordType>ul").append(liHTML);
		$("div.words_list").bind("click",function(e){
			e.stopPropagation()
		})
	}
	delWordType();
	editWordType();
	isShare();
	dropList();
	addWord();
	delIcon()
}
//渲染动态词列表
function initWord(groupId, $this) {
	var pageNum
	for(var i = 0; i < $("li.wordList").length; i++) {
		if(groupId == $("li.wordList:eq(" + i + ")").attr("groupId")) {
			pageNum = i
		}
	}
	getAjax($ctx + "listDynaWord", {
		idDwg: groupId,
		page: 1,
		size: 20,
		wname: $this.find("input#wordKey").val(),
	}, "get", function(data, status) {
		$this.parent().find("div.allList").empty();
		var listWord = data.returnData.list;
		init2(listWord , $this);
		searchword();
		layui.use(['element', 'laypage', ], function() {
			var element = layui.element, //元素操作
				laypage = layui.laypage;
			laypage.render({
				elem: 'wordPage_' + pageNum,
				count: data.returnData.total,
				limit: 20,
				prev: "<",
				next: ">",
				jump: function(obj, first) {
					if(!first) {
						$this.parent().find("div.allList").empty();
						getAjax($ctx + "listDynaWord", {
							idDwg: groupId,
							page: obj.curr,
							size: obj.limit,
							wname: $this.find("input#wordKey").val(),
						}, 'get', function(data, status) {
							if(data.ret == 0) {
								$this.parent().find("div.allList").empty();
								var listWord = data.returnData.list;
                                init2(listWord,$this)
							} else if(data.ret == 20003) {
								layer.alert(data.info, function() {
									window.open("res/views/user/login.html", "_self");
								})
							} else {

							}
							searchword();
							return false;
						})
					}

				}
			})
		})
	})
}

function init2(listWord,$this) {
	for(var i = 0; i < listWord.length; i++) {
		var wordHTML = "";
		wordHTML = '<a id="' + listWord[i].id + '" href="javascript:void(0)">' + listWord[i].wname + '<img src="res/image/word/del.png"></a>';
		$this.parent().find("div.allList").append(wordHTML);
		
	}
	delIcon()
}
//新增动态词组类型
$("button.addBtn").bind("click", function() {
	$("input[name=ch]").val("");
	$("input[name=en]").val("");
	layer.open({
		type: 1,
		skin: '', //加上边框
		area: ['400px', '240px'], //宽高
		content: $("#formType"),
		btn: ['确认', '取消'],
		yes: function(index, layero) {
			var name_ch = $("input[name=ch]").val();
			var name_en = $("input[name=en]").val();
			var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/; //必须是中文，英文下划线或者数字
			var reg1 = /^[a-zA-Z0-9_]+$/ //必须是英文下划线或者数字
			if(!reg.test(name_ch)) {
				layer.alert("您只能输入中文，英文下划线或者数字");
				return false;
			}
			if(name_ch.length > 10) {
				layer.alert("中文名称的长度不能超过10个字符");
				return false;
			}
			if(!reg1.test(name_en)) {
				layer.alert("您只能输入英文，数字或者下划线");
				return false;
			}
			if(name_en.length > 24) {
				layer.alert("英文名称的长度不能超过24个字符");
				return false;
			}

			var first_ch = name_ch.charAt(0);
			getAjax($ctx + "addDynaWordType", {
				"groupName": name_en,
				"isShare": 2,
				"groupCnName": name_ch,
				"idAc": $("input.user_name").val()
			}, "post", function(data, status) {
				if(data.ret == 0) {
					initWordType(); //点击刷新的时候重新加载列表，方便分页展示
					layer.closeAll();
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
//删除动态词的类别
function delWordType() {
	$("p.delete>i.delIcon").bind("click", function(event) {
		event.stopPropagation();
		var $this = $(this).parent().parent();
		layer.confirm("您确定要删除该动态词组吗？", function(index) {
			getAjax($ctx + "delDynaWordType", {
				id: $this.attr("groupId")
			}, "post", function(data, status) {
				if(data.ret == 0) {
					layer.close(index);
					initWordType()
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
		}, function(index) {
			//取消
			layer.close(index);
		})
    return false;
	})
}
//修改动态词的类别
function editWordType() {
	$("p.delete>i.editIcon").bind("click", function(event) {
		var $this = $(this);
		var groupID = $(this).parent().parent().attr("groupId");
		event.stopPropagation();
		//修改的时候赋值(中文名+英文名+是否共享)
		$("input[name=ch]").val($(this).parent().parent().find("p.name_ch").html());
		$("input[name=en]").val($(this).parent().parent().find("p.name_en").html());
		layer.open({
			type: 1,
			skin: '', //加上边框
			area: ['400px', '240px'], //宽高
			btn: ['确认', '取消'],
			content: $("#formType"),
			yes: function(index, layero) {
				var name_ch = $("input[name=ch]").val();
				var name_en = $("input[name=en]").val();
				var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\""]+$/; //必须是中文，英文下划线或者数字
				var reg1 = /^[a-zA-Z0-9_]+$/ //必须是英文下划线或者数字
				if(!reg.test(name_ch)) {
					layer.alert("您只能输入中文，英文下划线或者数字");
					return false;
				}
				if(name_ch.length > 10) {
					layer.alert("中文名称的长度不能超过10个字符");
					return false;
				}
				if(!reg1.test(name_en)) {
					layer.alert("您只能输入英文，数字或者下划线");
					return false;
				}
				if(name_en.length > 32) {
					layer.alert("英文名称的长度不能超过32个字符");
					return false;
				}
				var first_ch = name_ch.charAt(0);
				getAjax($ctx + "modifyDynaWordType", {
					"groupName": name_en,
					"isShare": $this.parent().siblings("p.state").attr("state"),
					"groupCnName": name_ch,
					"id": groupID, //主键id，
					"idAc": $("input.user_name").val()
				}, "post", function(data, status) {
					if(data.ret == 0) {
						layer.alert("修改成功", function() {
							$this.parent().parent().find("p.name_ch").html($("input[name=ch]").val());
							$this.parent().parent().find("p.name_en").html($("input[name=en]").val())
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
				return false;
			},
			cancel: function(index, layero) {
				layui.layer.close(index);
			}
		});
	return false;
	})
}

//动态词是否共享
function isShare() {
	$("p.share>span").bind("click", function(event) {
		event.stopPropagation();
		var name = $(this).parent().attr("name");
		if(name == 0) {
			$(this).html("共享");
			$(this).parent().prev().children("span.fare").html("未共享");
			$(this).parent().attr("name", 1);
		} else {
			$(this).html("取消共享");
			$(this).parent().prev().children("span.fare").html("已共享");
			$(this).parent().attr("name", 0)
		}
		return false;
	})
}
//下拉动态词
function dropList() {
	$("li.wordList").bind("click", function(event) {
		var groupId = $(this).attr("groupId");
		var t_en=$(this).find("p.name_en").html();
		localStorage.setItem("isDefault",$(this).attr("isdefault"));
		localStorage.setItem("groupId",groupId);
		localStorage.setItem("wname","");
		localStorage.setItem("t_en",t_en);
		//记录搜索的内容和页码数
		/*var searchMsg = $("input#key").val();
		var curPage = $("span.layui-laypage-curr").find("em:eq(1)").html();
		var condation=new Object();
		condation.searchMsg = searchMsg;
		condation.curPage = curPage;
        localStorage.setItem("condation",JSON.stringify(condation));*/
	})
}

$("div.robotManager").unbind("click").bind("click",function(e) {
	var _con1 = $("div.words");
	if(!_con1.is(e.target) && _con1.has(e.target).length === 0) {
		$("li.wordList").removeClass("active");
		$("li.wordList").children("div.words ").hide();
		$("input#wordKey").val("")
	}
})
//添加动态词
function addWord() {
	$("a.addwords").bind("click", function(event) {
		event.stopPropagation();
		var $this = $(this).parent().parent().parent().parent();
		var $ul = $(this).parent().next("div.allList");
		$("input[name=noun]").val("");
		$("textarea[name=note]").val("");
		$("input[name=count]").val("");
		layui.use(['element', 'form'], function() {
			var element = layui.element, //元素操作
				form = layui.form;
			layui.use('form', function() {
				var form = layui.form;
				form.render();
			})
		})
		layer.open({
			type: 1,
			skin: '', //加上边框
			area: ['600px', '500px'], //宽高
			btn: ['确认', '取消'],
			content: $('#wordType'),
			yes: function(index, layero) {
				var noun = $("input[name=noun]").val();
				var wften = $("input[name=count]").val();
				var nounReg = /^[a-zA-Z0-9\u4e00-\u9fa5\""]+$/; //必须是中文，英文下划线或者数字
				/*if(!nounReg.test(noun)) {
					layer.alert("您输入的名词只能是中文，英文或者数字")
					return false;
				}*/
				if(noun.length > 31) {
					layer.alert("您输入的名词长度不能超过30位")
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
				getAjax($ctx + "addReplaceDynaWord", {
					idDwg: $this.attr("groupId"),
					wname: noun,
					idAc: $("input.user_name").val(),
					wften: wften,
					state: state,
					remarks: $("textarea[name=note]").val(),
				}, "post", function(data, status) {
					if(data.ret == 0) {
						var wordHTML = "";
						wordHTML = '<a href="javascript:void(0)" id="' + data.returnData.Id + '">' + $("input[name=noun]").val() + '<img src="res/image/word/del.png"></a>';
						$ul.append(wordHTML);
						initWord($this.attr("groupId"), $this);
						layui.layer.close(index);
					} else if(data.ret == 20003) {
						layer.alert(data.info, function() {
							window.open("res/views/user/login.html", "_self");
						})
					} else {
						layer.alert(data.info)
					}
					delIcon()
				})
				return false
			},
			cancel: function(index, layero) {
				layui.layer.close(index);
			}
		});
	})
}

//显示关键词的删除按钮
function delIcon() {
	$("div.allList>a").bind("mouseover", function() {
		$(this).children().show();
	}).bind("mouseout", function() {
		$(this).children().hide();
	})
	$("div.allList>a>img").bind("click", function(event) {
		event.stopPropagation();
		var $this = $(this).parent();
		layer.confirm('您确定删除该动态词吗？', function(index) {
			var $index = index;
			getAjax($ctx + "delDynaWord", {
				id: $this.attr("id")
			}, "post", function(data, status) {
				if(data.ret == 0) {
					$this.remove();
					layer.close($index)
				} else if(data.ret == 20003) {
					layer.alert(data.info, function() {
						window.open("res/views/user/login.html", "_self");
					})
				} else {
					layer.alert(data.info)
				}
			})
		});
	})
}

//查询动态词类型
//查询(按钮)
$("p.m_search>i").bind("click", function() {
	initWordType();
})
//查询(回车)
$('input#key').keydown(function(event) {
	if(event.keyCode == 13) {
		initWordType();
		return false;
	}
});
//查询动态词
function searchword() {
	$("p.mm_search>i").bind("click", function(event) {
		event.stopPropagation()
		var $this = $(this).parent().parent();
		var groupId = $(this).parent().parent().parent().parent().parent().attr("groupId");
		initWord(groupId, $this);
	})
	$("input#wordKey").keydown(function(event) {
		if(event.keyCode == 13) {
			var $this = $(this).parent().parent();
			var groupId = $(this).parent().parent().parent().parent().parent().attr("groupId");
			initWord(groupId, $this);
			return false;
		}
	})
	$("input#wordKey").bind("click", function(event) {
		event.stopPropagation()
	})
	$("div.wordPage span.layui-laypage-curr").bind("click", function(event) {
		event.stopPropagation();
		return false
	})
}