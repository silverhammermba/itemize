$(document).ready(function()
{
	$('#add').hover(function()
	{
		$(this).addClass('active');
	}, function()
	{
		$(this).removeClass('active');
	}).click(function()
	{
		var new_list = $('<ul class="price_list"></ul>');
		$(this).before(new_list);

		var buyers = $("<input type='text' class='buyers'>");
		new_list.append(buyers);
		buyers.focus();
	});
});
