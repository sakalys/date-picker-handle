(function() {
  var picker = document.querySelector('.sakalys-date-range');

  var from = picker.querySelector('.skl-from'),
    fromHandle = from.querySelector('.handle');

  var to = picker.querySelector('.skl-to'),
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
    disableScroll(e);
  }

  fromHandle.addEventListener('mousedown', pressedCb);
  fromHandle.addEventListener('touchstart', pressedCb);


  function prepareDate(dayDiff) {
    var date = new Date();

    date.setTime(date.getTime() + (dayDiff * 1000 * 60 * 60 * 24));

    return date;
  }

  function moveListener (e) {

    currentPosition = e.screenY;

    moveTotal += stackedMove;
    stackedMove = 0;

    daysFromToday += (moveTotal / 60);
    console.log(moveTotal);
    // console.log(daysFromToday);


    if (daysFromToday > 0) {
      daysFromToday = Math.floor(daysFromToday);
    } else {
      daysFromToday = Math.ceil(daysFromToday);
    }

    out.innerHTML = formatDate(prepareDate(daysFromToday));
  }

  function formatDate(date) {
    return paddy(date.getDate(), 2)
      + "/"
      + paddy((date.getMonth() + 1), 2)
      + "/"
      + date.getFullYear();
  }

  function paddy(subject, length, padChar) {
    var pad_char = typeof padChar !== 'undefined' ? padChar : '0';
    var pad = new Array(1 + length).join(pad_char);
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

    var samplesPerSecond = 10;

    var previousPos = getCurrentPosition();

    acceleratorInterval = setInterval(function () {
      var accelerate = 1;
      var diff = previousPos - getCurrentPosition();

      var absDiff = Math.abs(diff);

      if (absDiff < 9) {
        accelerate = 1;
      } else if (absDiff < 16) {
        accelerate = 2;
      } else if (absDiff < 20) {
        accelerate = 20;
      } else if (absDiff < 30) {
        accelerate = 40;
      }

      stackedMove += accelerate * (diff/100);
    }, 1000 / samplesPerSecond)
  }

  function stopAccelerator() {
    if (!acceleratorInterval) {
      return;
    }

    clearInterval(acceleratorInterval);
  }

})();