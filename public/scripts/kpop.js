const kpop = {
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

  initBindElements() {
    kpop.line.$element = $('.line');
    kpop.history.$content = $('.history-content');
  },

  initLine() {
    kpop.line.height = kpop.line.$element.height();
    kpop.line.$element.height(kpop.line.height + kpop.line.speed);
    window.scrollTo(0, kpop.line.$element.height() - 400);
    kpop.line.handler = requestAnimationFrame(kpop.initLine);
  },

  lineCheck() {
    if (kpop.lineChecker.current == 0) {
      if (kpop.line.height > 300) {
        kpop.routine();
      }
    } else if (kpop.lineChecker.current == 1) {
      if (kpop.line.height > 600) {
        kpop.routine();
      }
    } else if (kpop.lineChecker.current == 2) {
      if (kpop.line.height > 900) {
        kpop.routine();
      }
    } else if (kpop.lineChecker.current == 3) {
      if (kpop.line.height > 1200) {
        kpop.routine();
      }
    } else if (kpop.lineChecker.current == 4) {
      if (kpop.line.height > 1500) {
        kpop.routine();
      }
    } else if (kpop.lineChecker.current == 5) {
      if (kpop.line.height > 1800) {
        kpop.stopLine();
        kpop.onContent();
      }
    }
  },

  routine() {
    kpop.onContent();
    kpop.stopLine();
    kpop.moveLine(kpop.line.stopTimer);
  },

  onContent() {
    $('.history-content')[kpop.lineChecker.current].classList.add('on-content');
    kpop.lineChecker.current++;
  },

  moveLine(timer) {
    setTimeout(() => {
      kpop.line.handler = requestAnimationFrame(kpop.initLine);
    }, timer);
  },

  stopLine() {
    cancelAnimationFrame(kpop.line.handler);
  },
};

window.addEventListener('load', function (e) {
  kpop.initBindElements();
  kpop.initLine();
  kpop.lineChecker.handler = setInterval(kpop.lineCheck, 100);
});
