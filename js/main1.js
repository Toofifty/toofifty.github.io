var hue = 0;
var pages = 3;

$(document).scroll(function() {
    var scroll = $(this).scrollTop();

    var perc = scroll / $(this).innerHeight();
    hue = parseInt(perc * 255);

    $("body").css({"background": "linear-gradient(to right,hsl(" + hue + ", 50%, 50%), hsl(" + (hue + 5) + ", 50%, 50%))"});
	$("knockout-text").css({"color": "hsl(" + hue + ", 50%, 50%)"});

    if (scroll > 10 && !$(".more").hasClass("more-hide")) {
    	$(".more").addClass("more-hide");
    } else if (scroll < 10 && $(".more").hasClass("more-hide")) {
    	$(".more").removeClass("more-hide");
    }

    var page_perc = perc * pages;
    console.log(page_perc);
    if (page_perc < 1) {
    	if (page_perc > 0.2) {
    		$(".bhead").removeClass("hidden");
    	} else {
    		$(".bhead").addClass("hidden");
    	}
    }
});

var disable_press = function() {
	$(this).removeClass("knockout-text");
	$(".btn").css({"color": "#FFF"});
}

$(".btn").mousedown(function() {
	$(this).addClass("knockout-text");
	$(".knockout-text").css({"color": "hsl(" + hue + ", 50%, 50%)"});
}).mouseup(disable_press).mouseout(disable_press);