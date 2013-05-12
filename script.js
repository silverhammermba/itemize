// TODO warn when leaving page

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

// TODO separate the responsibility here
var check_input = function(str)
{
	var bought_for = str_to_buyers(str);

	if (bought_for)
	{
		$('#bought_for').text('For ' + bought_for);
		$('#input').val('');
		return false;
	}
	else
	{
		var match = str.match(/^((\d+)\s*[@*]\s*)?(-?\d+)(\.(\d{0,2}))?$/);

		if (match)
		{
			// TODO negatives don't work
			// normalize
			var cents = match[3];

			if (match[5] !== undefined)
			{
				for (var i = match[5].length; i < 2; i++)
					match[5] += '0'
				cents = cents * 100 + parseInt(match[5], 10);
			}

			if (match[2])
				cents = cents * match[2];

			var display = cents.toString();

			for (var i = display.length; i < 3; i++)
				display = '0' + display;

			display = display.substring(0, display.length - 2) + '.' + display.substring(display.length - 2);

			return [display, cents];
		}
		else
		{
			$('#status p').text('You must enter a buyer string or a price.');
			return false;
		}
	}
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
		var price = check_input($('#input').val());

		if (price)
		{
			// TODO error message when bought for isn't set
			if ($('.current').length > 0)
			{
				$('.current').append($('<li class="price">' + price[0] + '</li>'));
				$('#input').val('');
			}
			else
			{
				$('#status p').text('You need to create a price list to add prices.');
			}
		}
	});

	$('#add').hover(function()
	{
		$(this).addClass('active');
	}, function()
	{
		$(this).removeClass('active');
	}).click(function()
	{
		$('.current').removeClass('current');

		var new_list = $('<div class="price_block prices current"><span class="close">&#x2715;</span><label for="buyers">Paid for by</label><ul></ul></div>');
		var buyers = $("<input type='text' id='buyers'>");
		new_list.children('ul').before(buyers);

		$(this).before(new_list);
		buyers.focus();
	});
});

$(document).on('blur', '#buyers', function()
{
	$(this).remove();

	if ($('.current .buyers').length === 0)
	{
		$('.current').remove();
		$('.prices').last().addClass('current');
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

$(document).on('click', '.close', function(event)
{
	var current = $(this).parent().hasClass('current');

	$(this).parent().remove();
	event.stopPropagation();

	if (current)
	{
		// TODO maybe a smarter way to set this
		$('.prices').last().addClass('current');
	}
});

$(document).on('click', '.prices', function()
{
	$('.current').removeClass('current');
	$(this).addClass('current');
});
