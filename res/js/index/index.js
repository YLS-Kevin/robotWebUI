$(function() {
	$("div#robotDiv").load("res/views/index/table.html")
})
//查询(按钮)
$("p.m_search>i").bind("click", function() {
	loadRobotTable(1, 5)
})
//查询(回车)
$('input#key').keydown(function(event) {
	if(event.keyCode == 13) {
		loadRobotTable(1, 5);
		return false;
	}
});