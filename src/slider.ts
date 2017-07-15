class ValueSlider {
  private value: number;
  private initialType: string;
  private handle: HTMLElement;

  private static mousePosition: number;
  private acceleratorInterval: number;
  private previousVelocity: number = 0;
  private moveTotal: number = 0;

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


  private static moveCb(e: MouseEvent) {
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

    let moveListener = ValueSlider.moveCb.bind(this);

    const _stopSlider = () => {
      this._off(document, 'mousemove', moveListener);
      this._off(document, 'mouseup', boundStopListener);

      this.stopClock();
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


  static getCurrentPosition() {
    return ValueSlider.mousePosition;
  }


  startClock() {

    const samplesPerSecond = 30;

    let previousPos = ValueSlider.getCurrentPosition();

    let mediumVel = 1;

    this.acceleratorInterval = setInterval(() => {
      let velocity = 0;
      const thisPos = ValueSlider.getCurrentPosition();
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
        velocity = 2;
      } else if (absDiff < 22) {
        velocity = 20;
      } else if (absDiff < 50) {
        velocity = 700;
      } else {
        velocity = 20000;
      }

      velocity *= direction;

      let newMedium;

      if (this.previousVelocity == 0) {
        newMedium = Math.floor(velocity * 1.2);
      } else {
        newMedium = (3 * mediumVel + velocity) / 4;
      }

      mediumVel = Math.floor(newMedium * 100) / 100;

      previousPos = thisPos;

      this.moveTotal += mediumVel;
      // stackedMove = 0;

      let currentValue = this.moveTotal / samplesPerSecond;

      if (currentValue > 0) {
        currentValue = Math.floor(currentValue);
      } else {
        currentValue = Math.ceil(currentValue);
      }

      this.value = currentValue;

      this._throttleUpdate(() => {
        this.handle.innerHTML = String(this.value);
      });


      this.previousVelocity = mediumVel;

    }, 1000 / samplesPerSecond)
  }


  stopClock() {
    if (!this.acceleratorInterval) {
      return;
    }

    clearInterval(this.acceleratorInterval);
  }
}


new ValueSlider(<HTMLInputElement>document.querySelector('.from'));

