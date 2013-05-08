// return array of buyers from string, or false if invalid
var str_to_buyers = function(str)
{
	str = str.toUpperCase();

	// must be all letters
	if (!str.match(/^[A-Z]+$/))
		return false;

	// must not have duplicate characters
	for (var i = 0; i < str.length - 1; i++)
		if (str.indexOf(str[i], i + 1) !== -1)
			return false;

	return str.split().sort();
};

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
		var new_list = $('<ul class="price_list current"><label for="buyers">Paid for by</label></ul>');
		var buyers = $("<input type='text' id='buyers'>");
		new_list.append(buyers);

		$(this).before(new_list);
		buyers.focus();
	});
});

$(document).on('blur', '#buyers', function()
{
	var buyers = str_to_buyers($(this)[0].value);

	if (buyers)
	{
		$(this).replaceWith('<div class="buyers">' + buyers + '</div>');
	}
	else
	{
		$('#status p').text("That is not a valid buyer string.");
		$('ul.current').remove();
	}
});

$(document).on('click', 'ul.price_list', function()
{
	$('.current').removeClass('current');
	$(this).addClass('current');
});
