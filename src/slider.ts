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
      // 'user-select': 'none'
    });


    this._setupHandle(handle);

    return handle;
  }


  private _setupHandle(handle: HTMLElement) {
    this._on(handle, 'mousedown', this._armSlider.bind(this));
  }


  private moveCb(e: MouseEvent) {
    ValueSlider.mousePosition = e.screenY;
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
      this._off(document, 'mousemove', moveListener);
      this._off(document, 'mouseup', boundStopListener);

      stopClock();
    };

    const boundStopListener = _stopSlider.bind(this);

    this._on(document, 'mousemove', moveListener);
    this._on(document, 'mouseup', boundStopListener);

    ValueSlider.mousePosition = e.screenY;
    this.startClock();
  }

  private _throttleUpdate(cb: () => void) {
    cb.apply(this);
  }


  getCurrentPosition() {
    return ValueSlider.mousePosition;
  }


  startClock() {

    const samplesPerSecond = 30;

    let previousPos = this.getCurrentPosition();

    let mediumVel = 1;

    acceleratorInterval = setInterval(() => {
      let velocity = 0;
      const thisPos = this.getCurrentPosition();
      const diff = previousPos - thisPos;

      let direction = 0;
      if (diff > 0) {
        direction = 1;
      } else if (diff < 0) {
        direction = -1;
      }

      const absDiff = Math.abs(diff);

      if (absDiff == 0) {
        velocity = 0;
      } else if (absDiff < 8) {
        velocity = 1;
      } else if (absDiff < 22) {
        velocity = 10;
      } else if (absDiff < 50) {
        velocity = 300;
      } else if (absDiff < 90) {
        velocity = 1000;
      }

      velocity *= direction;

      const newMedium = (3 * mediumVel + velocity) / 4;

      mediumVel = Math.floor(newMedium * 100) / 100;

      previousPos = thisPos;

      stackedMove = mediumVel;


      moveTotal += stackedMove;
      // stackedMove = 0;

      let currentValue = moveTotal / samplesPerSecond;

      if (currentValue > 0) {
        currentValue = Math.floor(currentValue);
      } else {
        currentValue = Math.ceil(currentValue);
      }

      this.value = currentValue;

      this._throttleUpdate(() => {
        this.handle.innerHTML = String(this.value);
      });


    }, 1000 / samplesPerSecond)
  }
}


new ValueSlider(<HTMLInputElement>document.querySelector('.from'));

let moveTotal = 0,
  stackedMove = 0,
  acceleratorInterval: number = null;


function stopClock() {
  if (!acceleratorInterval) {
    return;
  }

  clearInterval(acceleratorInterval);
}
