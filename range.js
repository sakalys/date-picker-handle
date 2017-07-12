var picker = document.querySelector('.sakalys-date-range');

var from = picker.querySelector('.skl-from'),
    fromHandle = from.querySelector('.handle');

var screenSize = screen.height;

var realChange = 0;

console.log('Screen height', screenSize);

var to = picker.querySelector('.skl-to'),
    toHandle = to.querySelector('.handle');

var out = document.querySelector('.testFrom');

var fromPressed = false,
  toPressed = false;

var lastPos = -1,
  change = 0;

function setupHandle (el) {
  var stop = function (e) {
    e.preventDefault();
  };
  el.addEventListener('dragstart', stop);
  el.addEventListener('touchstart', stop);
}

setupHandle(fromHandle);
setupHandle(toHandle);

var fromDownCb = function (e) {
  fromPressed = true;
  enableScroll(e);
};
var fromUpCb = function () {
  fromPressed = false;
  disableScroll();
};
var toDownCb = function (e) {
  toPressed = true;
  enableScroll(e);
};
var toUpCb = function () {
  toPressed = true;
  disableScroll();
};

// FROM
// down
fromHandle.addEventListener('mousedown', fromDownCb);
fromHandle.addEventListener('touchstart', fromDownCb);
// up
fromHandle.addEventListener('mouseup', fromUpCb);
fromHandle.addEventListener('touchend', fromUpCb);
fromHandle.addEventListener('touchcancel', fromUpCb);

// TO
// down
toHandle.addEventListener('mousedown', toDownCb);
toHandle.addEventListener('touchstart', toDownCb);
// up
toHandle.addEventListener('mouseup', toUpCb);
toHandle.addEventListener('touchend', toUpCb);
toHandle.addEventListener('touchcancel', toUpCb);

function applyChange(date, change) {
  date.setTime(date.getTime() + (change * 1000 * 60 * 60 * 24));

  return date;
}
var moveListener = function (e) {

  var pos;
  if (e.touches) {
    pos = e.touches[0].screenY;
  } else {
    if (e.which === 0) {
      fromPressed = false;
      toPressed = false;
      return;
    }
    pos = e.screenY;
  }

  var diff;

  if (lastPos > -1) {
    diff = (pos - lastPos) * -1;
  } else {
    diff = 0;
  }

  change += diff;

  lastPos = pos;

  var date = new Date();

  realChange = (change / 2);

  if (realChange > 0) {
    realChange = Math.floor(realChange);
  } else {
    realChange = Math.ceil(realChange);
  }
  applyChange(date, realChange);

  out.innerHTML = formatDate(date);
};

function formatDate(date) {
  return paddy(date.getDate(), 2) + "/" + paddy((date.getMonth() + 1), 2) + "/" + date.getFullYear();
}
function paddy(subject, length, padChar) {
  var pad_char = typeof padChar !== 'undefined' ? padChar : '0';
  var pad = new Array(1 + length).join(pad_char);
  return (pad + subject).slice(-pad.length);
}

var enableScroll = function (e) {
  out.innerHTML = formatDate(applyChange(new Date(), realChange));

  lastPos = e.screenY;

  document.addEventListener('mousemove', moveListener);
  document.addEventListener('touchmove', moveListener);
};

var disableScroll = function () {
  document.removeEventListener('mousemove', moveListener);
  document.removeEventListener('touchmove', moveListener);
};

