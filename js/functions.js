// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var offsetX = 335;
var offsetY = 257;

function resizeHeartLayout() {
	$loveHeart = $("#loveHeart");
	$garden = $("#garden");
	gardenCanvas = $garden[0];

	var viewportWidth = window.innerWidth;
	var viewportHeight = window.innerHeight;
	var loveWidth;
	var loveHeight;

	if (viewportWidth <= 700) {
		loveWidth = viewportWidth;
		loveHeight = loveWidth * 625 / 670;
		if (loveHeight > viewportHeight) {
			loveHeight = viewportHeight;
			loveWidth = loveHeight * 670 / 625;
		}
	} else {
		loveWidth = 670;
		loveHeight = 625;
	}

	$loveHeart.css({ width: loveWidth + "px", height: loveHeight + "px" });
	gardenCanvas.width = loveWidth;
	gardenCanvas.height = loveHeight;
	offsetX = loveWidth / 2;
	offsetY = loveHeight / 2 - 55;

	$("#content").css({ width: loveWidth + "px", height: loveHeight + "px", margin: "0" });
	gardenCtx = gardenCanvas.getContext("2d");
	gardenCtx.globalCompositeOperation = "lighter";
	garden = new Garden(gardenCtx, gardenCanvas);
}

$(function () {
	resizeHeartLayout();
	setInterval(function () {
		garden.render();
	}, Garden.options.growSpeed);
});

$(window).resize(function () {
	resizeHeartLayout();
	adjustWordsPosition();
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	var heart = $("#loveHeart");
	var heartLeft = heart.offset().left;
	var heartTop = heart.offset().top;

	$('#words').css("position", "absolute");
	if ($(window).width() <= 700) {
		$('#words').css({
			"top": (heartTop + heart.height() * 0.31) + "px",
			"left": (heartLeft + heart.width() * 0.13) + "px",
			"width": (heart.width() * 0.74) + "px"
		});
	} else {
		$('#words').css({
			"top": (heartTop + 195) + "px",
			"left": (heartLeft + 70) + "px",
			"width": "500px"
		});
	}
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}