import {paddy} from "./helpers";
interface Handle extends HTMLElement {
  updated: (newVal: number) => void
}
interface Handles {day: Handle, month: Handle, year: Handle}

interface TickData {
  mediumVel: number
  samplesPerSecond: number
  previous: {
    velocity: number,
    position: number
  }
  handle: Handle
}

class ValueSlider {
  private initialType: string;

  private static mousePosition: number;
  private acceleratorInterval: number;
  private handles: Handles;
  private wrapper: HTMLElement;
  private value: string;
  private divider: number = 8;
  private date: Date = new Date;
  private tickData: TickData;

  constructor(private el: HTMLInputElement) {
    this.initialType = el.type;
    this.value = el.value;
    this._init();
  }

  private _init() {
    this.el.type = 'hidden';
    this.wrapper = this._createWrapper(this.el);

    this.handles = this._createHandles();

    this.wrapper.appendChild(this.handles.year);
    this.wrapper.appendChild(document.createTextNode('-'));
    this.wrapper.appendChild(this.handles.month);
    this.wrapper.appendChild(document.createTextNode('-'));
    this.wrapper.appendChild(this.handles.day);

    this.el.parentElement.insertBefore(this.wrapper, this.el);

    this._updateText();
  }

  private _createWrapper(el: HTMLInputElement): HTMLElement {
    const container = document.createElement('div');
    el.className.split(' ').forEach(className => container.classList.add(className));

    return container;
  }


  private _setupHandle(handle: Handle) {
    this._on(handle, 'mousedown', this._getSliderCb(handle).bind(this));
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


  private _getSliderCb(handle: Handle): (e: MouseEvent) => void {
    return (e: MouseEvent) => {

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
      this.startClock(handle);
    }
  }

  private _throttleUpdate(cb: () => void) {
    cb.apply(this);
  }


  static getCurrentPosition() {
    return ValueSlider.mousePosition;
  }


  startClock(handle: Handle) {

    this.tickData = {
      mediumVel: 1,
      samplesPerSecond: 30,
      previous: {
        velocity: 0,
        position: ValueSlider.getCurrentPosition()
      },
      handle: handle
    };

    this.acceleratorInterval = setInterval(this._tick.bind(this), 1000 / this.tickData.samplesPerSecond);
  }

  _tick() {
      const currentPosition = ValueSlider.getCurrentPosition();

      const diff = this.tickData.previous.position - currentPosition;
      const absDiff = Math.abs(diff);

      let direction = 0;

      if (diff > 0) {
        direction = 1;
      } else if (diff < 0) {
        direction = -1;
      }


      let velocity = (absDiff == 0 ? 0 : 1) * direction;

      let newMedium = this._calculateNewMediumVelocity(velocity);

      this.tickData.mediumVel = Math.floor(newMedium * 100) / 100;

      if (Math.abs(this.tickData.mediumVel) < 1) {
        this.tickData.mediumVel = 0;
      }

      this.tickData.previous.position = currentPosition;

      // handle.pixelsMoved = handle.pixelsMoved + diff;

      this._throttleUpdate(() => {
        this.tickData.handle.updated(Math.floor(this.tickData.mediumVel));
        this._updateText();
      });

      this.tickData.previous.velocity = this.tickData.mediumVel;
  }

  _calculateNewMediumVelocity(currentVelocity: number) {
    return this.tickData.previous.velocity == 0 ? Math.floor(currentVelocity) : ((this.tickData.mediumVel + currentVelocity * 2) / 3);
  }

  stopClock() {
    if (!this.acceleratorInterval) {
      return;
    }

    clearInterval(this.acceleratorInterval);
  }

  private _createHandles(): Handles {
    let handles: any = {};
    ['day', 'month', 'year'].forEach((handleName) => {
      const element = <Handle><any>document.createElement('a');
      element.classList.add(handleName);

      Object.assign(element.style, {
        cursor: 'ns-resize',
        // 'user-select': 'none'
      });

      handles[handleName] = element;
    });
    let year = handles.year;
    let month = handles.month;
    let day = handles.day;

    this._setupHandle(year);
    this._setupHandle(month);
    this._setupHandle(day);


    let [yearText, monthText, dayText] = this.value.split('-');
    this.date.setFullYear(parseInt(yearText));
    this.date.setMonth(parseInt(monthText) - 1);
    this.date.setDate(parseInt(dayText));

    let val;

    // YEAR
    val = parseInt(yearText);
    year.pixelsMoved = Math.floor(val * this.divider);
    year.updated = (newVal:number) => {
      this.date.setFullYear(this.date.getFullYear() + newVal);
    };


    // MONTH
    val = parseInt(monthText);
    month.pixelsMoved = Math.floor(val * this.divider);
    month.updated = (newVal:number) => {
      this.date.setMonth(this.date.getMonth() + newVal);
    };

    val = parseInt(dayText);
    day.pixelsMoved = Math.floor(val * this.divider);
    day.updated = (newVal:number) => {
      this.date.setDate(this.date.getDate() + newVal);
    };

    return handles;
  }

  private _updateText() {
    this.handles.year.innerText = paddy(String(this.date.getFullYear()), 4);
    this.handles.month.innerText = paddy(String(this.date.getMonth() + 1), 2);
    this.handles.day.innerText = paddy(String(this.date.getDate()), 2);
  }
}


new ValueSlider(<HTMLInputElement>document.querySelector('.from'));

