// TODO calling $(this)[0] seems really clumsy

// return array of buyers from string, or false if invalid
var str_to_buyers = function(str)
{
	// TODO be permissive of whitespace
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
	$('#input').keydown(function(event)
	{
		if (event.which === 13)
			$('#enter_price').click();
	});

	$('#enter_price').click(function()
	{
		$('.current').append($('<li class="price">' + $('#input').val() + '</li>'));
		$('#input').val('');
	});

	$('#add').hover(function()
	{
		$(this).addClass('active');
	}, function()
	{
		$(this).removeClass('active');
	}).click(function()
	{
		$('ul.current').removeClass('current');

		var new_list = $('<ul class="price_list current"><label for="buyers">Paid for by</label></ul>');
		var buyers = $("<input type='text' id='buyers'>");
		new_list.append(buyers);

		$(this).before(new_list);
		buyers.focus();
	});
});

$(document).on('blur', '#buyers', function()
{
	$(this).remove();

	if ($('ul.current .buyers').length === 0)
	{
		$('ul.current').remove();
		$('ul.price_list').last().addClass('current');
	}
}).on('keydown', '#buyers', function(event)
{
	if (event.which !== 13) return;

	var buyers = str_to_buyers($(this).val());

	if (buyers)
	{
		$(this).after('<span class="buyers"> ' + buyers + '</span>');
		$(this).blur();
	}
	else
	{
		// TODO more helpful error
		$('#status p').text("That is not a valid buyer string.");
	}
});

$(document).on('click', 'ul.price_list', function()
{
	$('.current').removeClass('current');
	$(this).addClass('current');
});
