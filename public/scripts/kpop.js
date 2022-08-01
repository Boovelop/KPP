const kpopObj = {
	line: {
		$element: null,
		handler: null,
		height: 0,
		speed: 2,
		stopTimer: 1500,
	},
	lineChecker: {
		handler: null,
		current: 0,
	},
	history: {
		$content: null,
	},
	scroll: {
		isStart: false,
	},
};
const $ELEMENT = $('div');

window.addEventListener('load', function (e) {
	kpop_initObj();
	kpop_lineAnim();
	kpopObj.lineChecker.handler = setInterval(kpop_lineCheck, 100);
});

function kpop_initObj() {
	kpopObj.line.$element = $('.line');
	kpopObj.history.$content = $('.history-content');
}

function kpop_lineAnim() {
	kpopObj.line.height = kpopObj.line.$element.height();

	kpopObj.line.$element.height(kpopObj.line.height + kpopObj.line.speed);

	window.scrollTo(0, kpopObj.line.$element.height() - 400);

	kpopObj.line.handler = requestAnimationFrame(kpop_lineAnim);
}
function kpop_lineCheck() {
	if (kpopObj.lineChecker.current == 0) {
		if (kpopObj.line.height > 300) {
			kpop_routine();
		}
	} else if (kpopObj.lineChecker.current == 1) {
		if (kpopObj.line.height > 600) {
			kpop_routine();
		}
	} else if (kpopObj.lineChecker.current == 2) {
		if (kpopObj.line.height > 900) {
			kpop_routine();
		}
	} else if (kpopObj.lineChecker.current == 3) {
		if (kpopObj.line.height > 1200) {
			kpop_routine();
		}
	} else if (kpopObj.lineChecker.current == 4) {
		if (kpopObj.line.height > 1500) {
			kpop_routine();
		}
	} else if (kpopObj.lineChecker.current == 5) {
		if (kpopObj.line.height > 1800) {
			kpop_stopLine();
			kpop_onContent();
		}
	}
}
function kpop_routine() {
	kpop_onContent();
	kpop_stopLine();
	kpop_moveLine(kpopObj.line.stopTimer);
}
function kpop_moveLine(timer) {
	setTimeout(() => {
		kpopObj.line.handler = requestAnimationFrame(kpop_lineAnim);
	}, timer);
}
function kpop_stopLine() {
	cancelAnimationFrame(kpopObj.line.handler);
}

function kpop_onContent() {
	$('.history-content')[kpopObj.lineChecker.current].classList.add('on-content');
	kpopObj.lineChecker.current++;
}
