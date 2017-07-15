import {prepareDate} from "./helpers";


const picker = document.querySelector('.sakalys-date-range');

const from = picker.querySelector('.skl-from'),
  fromHandle = from.querySelector('.handle'),
  to = picker.querySelector('.skl-to'),
  toHandle = to.querySelector('.handle');

const out = document.querySelector('.testFrom');

let daysFromToday = 0,
  moveTotal = 0,
  stackedMove = 0,
  acceleratorInterval: number = null,
  currentPosition: number;

function setupHandleElement(el: Element) {
  function stop(e: MouseEvent) {
    e.preventDefault();
  }

  el.addEventListener('dragstart', stop);
  el.addEventListener('touchstart', stop);
}

setupHandleElement(fromHandle);
setupHandleElement(toHandle);

function pressedCb(e: MouseEvent) {
  enableScroll(e);
}
function unpressedCb() {
  disableScroll();
}

fromHandle.addEventListener('mousedown', pressedCb);
fromHandle.addEventListener('touchstart', pressedCb);


function moveListener(e: MouseEvent) {

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

function formatDate(date: Date) {
  return paddy(String(date.getDate()), 2)
    + "/"
    + paddy(String(date.getMonth() + 1), 2)
    + "/"
    + date.getFullYear();
}

function paddy(subject: string, length: number, padChar = '0') {
  const pad = new Array(1 + length).join(padChar);
  return (pad + subject).slice(-pad.length);
}

function enableScroll(e: MouseEvent) {
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

  const samplesPerSecond = 30;

  let previousPos = getCurrentPosition();

  let mediumVel = 1;

  acceleratorInterval = setInterval(function () {
    let velocity = 1;
    const thisPos = getCurrentPosition();
    const diff = previousPos - thisPos;

    const absDiff = Math.abs(diff);

    if (absDiff < 8) {
      velocity = 1;
    } else if (absDiff < 22) {
      velocity = 10;
    } else if (absDiff < 50) {
      velocity = 300;
    } else if (absDiff < 90) {
      velocity = 1000;
    }

    const newMedium = (3 * mediumVel + velocity) / 4;

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