import {prepareDate} from "./helpers";


const picker = document.querySelector('.sakalys-date-range');

const from = picker.querySelector('.skl-from'),
  fromHandle = from.querySelector('.handle'),
  to = picker.querySelector('.skl-to'),
  toHandle = to.querySelector('.handle');

var out = document.querySelector('.testFrom');

var daysFromToday = 0,
  moveTotal = 0,
  stackedMove = 0,
  acceleratorInterval = null,
  currentPosition;

function setupHandleElement(el) {
  function stop(e) {
    e.preventDefault();
  }

  el.addEventListener('dragstart', stop);
  el.addEventListener('touchstart', stop);
}

setupHandleElement(fromHandle);
setupHandleElement(toHandle);

function pressedCb(e) {
  enableScroll(e);
}
function unpressedCb(e) {
  disableScroll();
}

fromHandle.addEventListener('mousedown', pressedCb);
fromHandle.addEventListener('touchstart', pressedCb);


function moveListener(e) {

  currentPosition = e.screenY;

  moveTotal += stackedMove;
  // stackedMove = 0;

  daysFromToday = moveTotal / 30;

  if (daysFromToday > 0) {
    daysFromToday = Math.floor(daysFromToday);
  } else {
    daysFromToday = Math.ceil(daysFromToday);
  }

  out.innerHTML = formatDate(prepareDate(daysFromToday));
}

function formatDate(date) {
  return paddy(String(date.getDate()), 2)
    + "/"
    + paddy(String(date.getMonth() + 1), 2)
    + "/"
    + date.getFullYear();
}

function paddy(subject, length, padChar = '0') {
  var pad = new Array(1 + length).join(padChar);
  return (pad + subject).slice(-pad.length);
}

function enableScroll(e) {
  document.addEventListener('mouseup', unpressedCb);
  document.addEventListener('touchend', unpressedCb);
  document.addEventListener('touchcancel', unpressedCb);
  out.innerHTML = formatDate(prepareDate(daysFromToday));

  currentPosition = e.screenY;

  document.addEventListener('mousemove', moveListener);
  document.addEventListener('touchmove', moveListener);
  startAccelerator();
}

function disableScroll() {
  document.removeEventListener('mousemove', moveListener);
  document.removeEventListener('touchmove', moveListener);
  stopAccelerator();
}

function startAccelerator() {

  function getCurrentPosition() {
    return currentPosition;
  }

  var samplesPerSecond = 30;

  var previousPos = getCurrentPosition();

  var mediumVel = 1;

  acceleratorInterval = setInterval(function () {
    var velocity = 1;
    var thisPos = getCurrentPosition();
    var diff = previousPos - thisPos;

    var absDiff = Math.abs(diff);

    if (absDiff < 8) {
      velocity = 1;
    } else if (absDiff < 22) {
      velocity = 10;
    } else if (absDiff < 50) {
      velocity = 300;
    } else if (absDiff < 90) {
      velocity = 1000;
    }

    var newMedium = (3 * mediumVel + 1 * velocity) / 4;

    mediumVel = Math.floor(newMedium * 100) / 100;

    previousPos = thisPos;

    stackedMove = mediumVel - 1;
  }, 1000 / samplesPerSecond)
}

function stopAccelerator() {
  if (!acceleratorInterval) {
    return;
  }

  clearInterval(acceleratorInterval);
}