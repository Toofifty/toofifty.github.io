$(function () {
	var move_label = function () {
		if ($(this).val().length() > 0 && !$(this).parent().hasClass('isfilled'))
			if (!$(this).parent().hasClass('isfilled')) {
				$(this).parent().addClass('isfilled')
			}
		}
	}
	$('input').keyup(move_label)
})