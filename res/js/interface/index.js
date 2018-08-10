$(function() {
	$("div#interfaceDiv").load("res/views/interface/table.html");
})
//查询(按钮)
$("p.m_search>i").bind("click", function() {
	$("p.interface_curr").html(1);
	$("div#interfaceDiv").load("res/views/interface/table.html");
})
//查询(回车)
$('input#key').keydown(function(event) {
	if(event.keyCode == 13) {
		$("p.interface_curr").html(1);
		$("div#interfaceDiv").load("res/views/interface/table.html");
		return false;
	}
});