const kpopObj = {
	line: {
		$element: null,
		handler: null,
		height: 0,
		speed: 2,
	},
	lineChecker: {
		handler: null,
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
}

function kpop_lineAnim() {
	kpopObj.line.height = kpopObj.line.$element.height();

	kpopObj.line.$element.height(kpopObj.line.height + kpopObj.line.speed);

	kpopObj.line.animHandeler = requestAnimationFrame(kpop_lineAnim);
}
function kpop_lineCheck() {}
