$(document).ready(function() {

	var hue = 0;

	var hsl = function() {
		return "hsl(" + hue + ", 50%, 50%)";
	}

	/* Knockout text handlers */
	$(".ko-hover").mouseover(function() {
		$(this).css("color", hsl());
	}).mouseout(function() {
		$(this).css("color", "#FFF");
	});

	/* Knockout children text handlers */
	$(".ko-hover-children").mouseover(function() {
		$.each($(this).children(), function() {
			$(this).css("color", hsl());
			$(this).children().css("color", hsl());
		});
		//$(this).children().css("color", hsl());
	}).mouseout(function() {
		$.each($(this).children(), function() {
			$(this).css("color", "#FFF");
			$(this).children().css("color", "#FFF");
		});
	});

	/* Scrolling title */
	var scroll_title = function() {
		$(".buzzword").css({
			"transition": "0.5s",
			"transform": "translateY(1.5em)"
		});

		$("#bw3").addClass("buzzword-hidden");
		$("#bw0").removeClass("buzzword-hidden");

		setTimeout(function() {
			scroll_h2s();

			$(".buzzword").css({
				"transition": "0s",
				"transform": "translateY(0)"
			})

			$("#bw0").addClass("buzzword-hidden");
			$("#bw3").removeClass("buzzword-hidden");

			setTimeout(scroll_title, 2000);
		}, 500);
	}

	var scroll_h2s = function() {
		var elems = [$("#bw3"), $("#bw2"), $("#bw1"), $("#bw0")];
		var bws = [];

		for ($e in elems) {
			if ($e != 0) bws.push(elems[$e].html());
		}

		for ($e in elems) {
			if ($e < bws.length) {
				elems[$e].html(bws[$e]);
			} else {
				elems[$e].html(bws[0]);
			}
		}
	}

	setTimeout(scroll_title, 2500);

	var test_hue = function() {
		hue += 1;
		$(".color-fill").css("background", hsl());
		setTimeout(test_hue, 200);
	}

	//setTimeout(test_hue, 200);

});