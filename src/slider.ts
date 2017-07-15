import {formatDate, prepareDate} from "./helpers";


class ValueSlider {
  private value: number;
  private initialType: string;
  private handle: HTMLElement;

  private static mousePosition: number;

  constructor(private el: HTMLInputElement) {
    this.initialType = el.type;
    this.value = parseInt(el.value);
    this._init();
  }

  private _init() {
    this.el.type = 'hidden';
    this.handle = this._createHandle(this.el);
    this.el.parentElement.insertBefore(this.handle, this.el);
  }

  private _createHandle(el: HTMLInputElement): HTMLElement {
    const handle = document.createElement('a');
    handle.innerHTML = String(el.value);
    el.className.split(' ').forEach(className => handle.classList.add(className));

    Object.assign(handle.style, {
      cursor: 'ns-resize',
      'user-select': 'none'
    });


    this._setupHandle(handle);

    return handle;
  }


  private _setupHandle(handle: HTMLElement) {
    this._on(handle, 'mousedown touchstart', this._armSlider.bind(this));
  }


  private moveCb(e: MouseEvent) {
    // console.log(this, e);

    currentPosition = e.screenY;

    moveTotal += stackedMove;
    // stackedMove = 0;

    daysFromToday = moveTotal / 30;

    if (daysFromToday > 0) {
      daysFromToday = Math.floor(daysFromToday);
    } else {
      daysFromToday = Math.ceil(daysFromToday);
    }

    this.handle.innerHTML = formatDate(prepareDate(daysFromToday));
  }


  private _on(el: Node, events: string, cb: (e: Event | void) => boolean | void) {
    events.split(' ').forEach((eventName: string) => {
      el.addEventListener(eventName, cb);
    });
  }

  private _off(el: Node, events: string, cb: (e: Event | void) => boolean | void) {
    events.split(' ').forEach((eventName: string) => {
      el.removeEventListener(eventName, cb);
    });
  }


  private _armSlider(e: MouseEvent) {
    e.preventDefault();

    let moveListener = this.moveCb.bind(this);

    const _stopSlider = () => {
      console.log('Stopped');
      this._off(document, 'mousemove', moveListener);
      this._off(document, 'mouseup', bindedStop);

      stopClock();
    };

    const bindedStop = _stopSlider.bind(this);

    this._on(document, 'mousemove', moveListener);
    this._on(document, 'mouseup', bindedStop);

    ValueSlider.mousePosition = e.screenY;
    startClock();
  }
}


new ValueSlider(<HTMLInputElement>document.querySelector('.from'));

let daysFromToday = 0,
  moveTotal = 0,
  stackedMove = 0,
  acceleratorInterval: number = null,
  currentPosition: number;

function startClock() {

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

function stopClock() {
  if (!acceleratorInterval) {
    return;
  }

  clearInterval(acceleratorInterval);
}
