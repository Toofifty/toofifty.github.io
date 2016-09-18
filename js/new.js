$(document).ready(function() {

	var scroll_colour = false;

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

	var sel = "#scr-home";
	var perc = 0;
	var anchor = $("#about").offset().top;
	var document_height = $(document).innerHeight();

	$(document).scroll(function() {
		// 
		var scroll = $(this).scrollTop();

		perc = scroll / document_height;

		// change navbar
		if (scroll > anchor && sel == "#scr-home") {

			$(".nav > a").css({
				"padding-top": "5px",
				"padding-bottom": "5px",
				"margin-top": "5px",
				"margin-bottom": "5px"
			});

			$(".logo").css({
				"margin-top": "3px",
				"margin-bottom": "3px"
			})

		} else if (scroll < anchor && sel != "#scr-home") {

			$(".nav > a").css({
				"padding-top": "10px",
				"padding-bottom": "10px",
				"margin-top": "10px",
				"margin-bottom": "10px"
			});

			$(".logo").css({
				"margin-top": "13px",
				"margin-bottom": "13px"
			})

		}

		var set = function(id) {
			if (sel == id) return;
			$(sel).removeClass("btn-sel");
			$(id).addClass("btn-sel");
			sel = id;
			console.log(sel);
		}

		if (scroll < $("#about").offset().top) 
			set("#scr-home");
		else if (scroll < $("#portfolio").offset().top)
			set("#scr-about");
		else if (scroll < $("#contact").offset().top)
			set("#scr-portfolio");
		else
			set("#scr-contact");

		// update fill colour
		if (!scroll_colour) return;

		hue = perc * 255;
		$(".ko-bg").css("background", hsl());
	});

	if (!scroll_colour) {
		var update_colour = function() {
			hue += 1;
			hue %= 255;
			$(".ko-bg").css("background", hsl());
			setTimeout(update_colour, 200);
		}

		setTimeout(update_colour, 200);
	}

	$(".skill").each(function() {
		var width = $(this).children(".skill-progress").innerWidth() / $(this).innerWidth();
		//$(this).css("background", "hsl(" + (width * 128) + ", 65%, 35%)");
		$(this).children(".skill-progress").css("background", "hsl(" + (width * 128) + ", 50%, 50%)");
	});

});

function scrollTo(element) {
    var position = 0;
    if (element != 0) {
        position = $(element).offset().top;
    }
    $("html, body").animate({ scrollTop: position }, "slow");
}
