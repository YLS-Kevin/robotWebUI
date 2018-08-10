$(function() {
	//获取面包屑导航
	var cname = localStorage.getItem("cname");
	$(".t1>a").html(cname);
	//返回上一级导航
	$("span.t1").bind("click", function() {
		$("div#robotDiv").load("res/views/index/table.html");
		$("div.m_robot").show();
	})
	var limitcount_log = 10;
	var curnum_log = 1;
	loadLogTable(curnum_log, limitcount_log);
})

function loadLogTable(curnum_log, limitcount_log) {
	layui.use(['table', 'element', 'form', 'laypage', 'layer', 'laydate'], function() {
		var table = layui.table,
			element = layui.element, //元素操作
			form = layui.form,
			laydate1 = layui.laydate,
			laydate2 = layui.laydate;
		laypage = layui.laypage;
		form.render();
		//日期
		laydate1.render({
			elem: '#start_date',
			type: 'datetime',
			done: function(value, date, endDate) {
				$("input.start_data").val(value);
				start(value)
			}
		});
		laydate2.render({
			elem: '#end_date',
			type: 'datetime',
			done: function(value, date, endDate) {
				end(value)
			}
		});
		getAjax($ctx + 'listChatLog', {
			"mansay": $("input.person").val(),
			"robotsay": $("input.robot").val(),
			"cip": $("input.ip").val(),
			"scity": $("input.city").val(),
			"bDate": $("input.s_date").val(),
			"eDate": $("input.e_date").val(),
			"idCu": localStorage.getItem("cid"), //机器人终端id*/
			"page": curnum_log,
			"size": limitcount_log,
			"isfind": $("form.formIsFind dd.layui-this").attr("lay-value")
		}, 'get', function(data, status) {
			var list;
			if(data.ret == 0) {
				var list = data.returnData.list;
				var total = data.returnData.total
			} else if(data.ret == 20003) {
				layer.alert(data.info, function() {
					window.open("res/views/user/login.html", "_self");
				})
			} else {
				layer.alert(data.info)
			}
			/*var list=[{"cip":"10.10.1.6","mansay":"今天天气如何","robotsay":"深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 深圳今天多云， 有阵雨或雷阵雨； 气温28 - 32℃； 西南风2 - 3 级； 相对湿度65 % -95 % ，外出建议带伞。 当前空气质量指数31， 优。 空气很好！ ","lon":"114.0259700000","lat":"22.5460530000","scity":"深圳市","saddr":"广东省深圳市广东省深圳市广东省深圳市广东省深圳市","vdate":"2018-07-06 15:12:57","participle":"[今天/t, 天气/n,今天/t, 天气/n,今天/t, 天气/n,今天/t, 天气/n]","isfind":"0"},
			{"cip":"100.100.100.600","mansay":"今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何今天天气如何","robotsay":" 当前空气质量指数31， 优。 空气很好！ ","lon":"114.0259700000","lat":"22.5460530000","scity":"深圳市","saddr":"广东省深圳市广东省深圳市广东省深圳市广东省深圳市","vdate":"2018-07-06 15:12:57","participle":"[今天/t, 天气/n,今天/t, 天气/n,今天/t, 天气/n,今天/t, 天气/n]","isfind":"0"}
			]*/
			table.render({
				elem: '#logTable',
				data: list,
				cols: [
					[ //表头
						{
							type: "numbers",
							title: '序号'
						}, {
							field: 'cip',
							title: 'IP',
							width:130,
							unresize: true,
							templet: function(d) {
								return "<p>" + d.cip + "</p>"
							}
						}, {
							field: 'mansay',
							title: '问题',
							unresize: true,
							templet: function(d) {
								if(d.mansay.length >120){
									return "<p class='normal tip' data-tipso='" + d.mansay + "'>" + d.mansay.substring(0,120) + "...</p>"
								}else{
									return "<p class='normal'>" + d.mansay + "</p>"
								}							
							}
						}, {
							field: 'robotsay',
							title: '回答',
							unresize: true,
							templet: function(d) {
								if(d.robotsay.length>120){
									return "<p class='normal tip' data-tipso='" + d.robotsay + "'>" + d.robotsay.substring(0,120) + "...</p>"
								}else{
									return "<p class='normal'>" + d.robotsay + "</p>"
								}
								
							}
						}, {
							field: 'lon',
							title: '经度',
							width:80,
							unresize: true,
							templet: function(d) {
								return "<p class='dot tip' data-tipso='" + d.lon + "'>" + d.lon + "</p>"
							}
						}, {
							field: 'lat',
							title: '纬度',
							width:80,
							unresize: true,
							templet: function(d) {
								return "<p class='dot tip' data-tipso='" + d.lat + "'>" + d.lat + "</p>"
							}
						}, {
							field: "saddr",
							title: '详细地址',
							width:120,
							unresize: true,
							templet: function(d) {
								return "<p class='dot tip' data-tipso='" + d.saddr + "'>" + d.saddr + "</p>"
							}
						}, {
							field: "vdate",
							title: '访问时间',
							unresize: true,
							width:170,
							templet: function(d) {
								return "<p>" + d.vdate + "</p>"
							}
						}, {
							field: "participle",
							title: '分词结果',
							unresize: true,
							width:120,
							templet: function(d) {
								return "<p class='dot tip' data-tipso='" + d.participle + "'>" + d.participle + "</p>"
							}
						}, {
							field: "isfind",
							title: '是否命中',
							width:90,
							unresize: true,
							templet: function(d) {
								if(d.isfind == 1) {
									return "<p style='color:green'>命中</p>"
								} else {
									return "<p style='color:red'>未命中</p>"
								}
							}
						}
					]
				],
				page: false,
				id: "tableLog",
				done: function(res, curr, count) {
					//如果是异步请求数据方式，res即为你接口返回的信息。  
					//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度  
					laypage.render({
						elem: 'logPage',
						count: total,
						curr: curnum_log,
						limit: limitcount_log,
						layout: ['prev', 'page', 'next', 'skip', 'count'],
						jump: function(obj, first) {
							if(!first) {
								curnum_log = obj.curr;
								limitcount_log = obj.limit;
								loadLogTable(curnum_log, limitcount_log)
							}
						}
					})
				}
			})
			$("p.tip").tipso({
				useTitle:false,
				position:'right',
				background:'#e6e6e6',
				delay:0
			})
		})
	})
}
//查询(按钮)
$("button.searchBtn").bind("click", function() {
	loadLogTable(1, 10)
})

function start(value) {
	$("input.s_date").val(value)
}

function end(value) {
	$("input.e_date").val(value)
}