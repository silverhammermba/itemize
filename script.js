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

	// if they entered a buyer string, set that
	if (bought_for)
	{
		$('#input_desc').text('For ').append($('<span id="bought_for">' + bought_for + '</span>'));
		$('#input').val('');
		return false;
	}
	else
	{
		// if the buyer string hasn't been set yet, error
		if ($('#bought_for').length === 0)
		{
			$('#status p').text('Who was this purchased for?');
			return false;
		}

		var match = str.match(/^((\d+)\s*[@*]\s*)?(-?\d+)(\.(\d{0,2}))?$/);

		// if they entered a price
		if (match)
		{
			// normalize
			var cents = match[3];

			if (match[5] !== undefined)
			{
				for (var i = match[5].length; i < 2; i++)
					match[5] += '0'
				cents = cents * 100 + parseInt(match[5], 10);
			}

			var display = cents.toString();
			var prefix = '';

			if (cents < 0)
			{
				prefix = '-';
				display = display.substring(1);
			}

			for (var i = display.length; i < 3; i++)
				display = '0' + display;

			display = prefix + '$' + display.substring(0, display.length - 2) + '.' + display.substring(display.length - 2);

			if (match[2])
			{
				cents = cents * match[2];
				display = match[2] + ' @ ' + display;
			}

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
	// pressing enter in input clicks the add button
	$('#input').keydown(function(event)
	{
		if (event.which === 13)
			$('#enter_price').click();
	});

	// clicking the add button
	$('#enter_price').click(function()
	{
		var price = check_input($('#input').val());

		// if there were no errors parsing input
		if (price)
		{
			if ($('.current_list').length > 0)
			{
				$('.current_list').append($('<li class="price">' + price[0] + '<span class="cents">' + price[1] + '</span> <span class="for">' + $('#bought_for').text() + '</span></li>'));
				$('#input').val('');
			}
			else
			{
				$('#status p').text('You need to create a price list to add prices.');
			}
		}
	});

	// button for adding new lists
	$('#add').hover(function()
	{
		$(this).addClass('active');
	}, function()
	{
		$(this).removeClass('active');
	}).click(function()
	{
		// add a new price list
		$('.current_list').removeClass('current_list');

		var new_list = $('<div class="price_block prices current_list"><span class="close">&#x2715;</span><label for="buyers">Paid for by</label><ul></ul></div>');
		var buyers = $("<input type='text' id='buyers'>");
		new_list.children('ul').before(buyers);

		$(this).before(new_list);
		buyers.focus();
	});
});

// hooks for elements created after page ready

// remove price list if buyers aren't set
$(document).on('blur', '#buyers', function()
{
	$(this).remove();

	if ($('.current_list .buyers').length === 0)
	{
		$('.current_list').remove();
		$('.prices').last().addClass('current_list');
	}
// create buyers for price list
}).on('keydown', '#buyers', function(event)
{
	if (event.which !== 13) return;

	// TODO check for price lists with same buyers
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

// delete price list
$(document).on('click', '.close', function(event)
{
	var current_list = $(this).parent().hasClass('current_list');

	$(this).parent().remove();
	event.stopPropagation();

	if (current_list)
	{
		// TODO maybe a smarter way to set this
		$('.prices').last().addClass('current_list');
	}
});

// switch current price list
$(document).on('click', '.prices', function()
{
	$('.current_list').removeClass('current_list');
	$(this).addClass('current_list');
});

$(document).on('mouseenter', '.price', function()
{
	$('.current_price').removeClass('current_price');
	$(this).addClass('current_price');
}).on('mouseleave', '.price', function()
{
	$(this).removeClass('current_price');
}).on('click', '.price', function()
{
	$(this).remove();

	return false;
});
