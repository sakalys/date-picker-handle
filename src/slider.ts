import {paddy} from "./helpers";
interface Handle extends HTMLElement {
  value: number
  pixelsMoved: number
  updated: (newVal: number) => void
}
interface Handles {day: Handle, month: Handle, year: Handle}

class ValueSlider {
  private initialType: string;

  private static mousePosition: number;
  private acceleratorInterval: number;
  private previousVelocity: number = 0;
  private handles: Handles;
  private wrapper: HTMLElement;
  private value: string;
  private divider: number = 8;
  private date: Date = new Date;

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

    const samplesPerSecond = 30;

    let previousPos = ValueSlider.getCurrentPosition();

    let mediumVel = 1;

    this.acceleratorInterval = setInterval(() => {
      const thisPos = ValueSlider.getCurrentPosition();

      const diff = previousPos - thisPos;

      let direction = 0;

      if (diff > 0) {
        direction = 1;
      } else if (diff < 0) {
        direction = -1;
      }

      const absDiff = Math.abs(diff);

      let velocity = (absDiff == 0 ? 0 : 1) * direction;

      let newMedium;

      if (this.previousVelocity == 0) {
        newMedium = Math.floor(velocity);
      } else {
        newMedium = (mediumVel + velocity * 2) / 3;
      }

      mediumVel = Math.floor(newMedium * 100) / 100;

      if (Math.abs(mediumVel) < 1) {
        mediumVel = 0;
      }

      previousPos = thisPos;

      handle.pixelsMoved = handle.pixelsMoved + diff;

      this._throttleUpdate(() => {
        handle.updated(Math.floor(handle.pixelsMoved / this.divider));
        this._updateText();
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

  private _createHandles(): Handles {
    let handles: any = {};
    ['day', 'month', 'year'].forEach((handleName) => {
      const element = document.createElement('a');
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
      this.date.setFullYear(newVal);
    };


    // MONTH
    val = parseInt(monthText);
    month.pixelsMoved = Math.floor(val * this.divider);
    month.updated = (newVal:number) => {
      this.date.setMonth(newVal - 1);
    };

    val = parseInt(dayText);
    day.pixelsMoved = Math.floor(val * this.divider);
    day.updated = (newVal:number) => {
      this.date.setDate(newVal);
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

