$(function() {
	$("div#wordbankDiv").load("res/views/wordBank/table.html");
})
//查询(按钮)
$("p.m_search>i").bind("click", function() {
	$("p.wordbank_curr").html(1);
	loadTable(1, 10);
})
//查询(回车)
$('input#key').keydown(function(event) {
	if(event.keyCode == 13) {
		$("p.wordbank_curr").html(1);
		loadTable(1, 10);
		return false;
	}
});