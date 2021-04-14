/* eslint-disable import/extensions */
import buttons from './buttons.js';
import createElementDom from './domhelp.js';

class KeyBoard {
  constructor() {
    this.buttons = {
      ru: buttons.ru.flat(),
      en: buttons.en.flat(),
    };
    this.capsLockState = false;
    this.shiftState = false;
    this.storage = window.localStorage;
    this.textArea = document.createElement('textarea');
    this.wrapper = document.createElement('div');
    this.setLanguage(this.getLanguage() || 'ru');
  }

  changeLanguage() {
    if (this.getLanguage() === 'ru') {
      this.setLanguage('en');
    } else {
      this.setLanguage('ru');
    }
    this.showKeysDefult();
  }

  setLanguage(language) {
    this.storage.setItem('language', language);
  }

  getLanguage() {
    return this.storage.getItem('language');
  }

  showKeysDefult() {
    const buttonsKeyboard = this.wrapper.querySelectorAll('.keyboard__button');
    this.buttons[this.getLanguage()]
      .forEach((item, index) => { buttonsKeyboard[index].innerHTML = item.key; });
  }

  showKeysShift() {
    const buttonsKeyboard = this.wrapper.querySelectorAll('.keyboard__button');
    this.buttons[this.getLanguage()]
      .forEach((item, index) => { buttonsKeyboard[index].innerHTML = item.shiftKey; });
  }

  showKeysCapsLock() {
    const buttonsKeyboard = this.wrapper.querySelectorAll('.keyboard__button');
    this.buttons[this.getLanguage()]
      .forEach((item, index) => {
        if (item.capsLockKey) {
          buttonsKeyboard[index].innerHTML = item.capsLockKey;
        }
      });
  }

  showKeysUnCapsLock() {
    const buttonsKeyboard = this.wrapper.querySelectorAll('.keyboard__button');
    this.buttons[this.getLanguage()]
      .forEach((item, index) => {
        if (item.capsLockKey) {
          buttonsKeyboard[index].innerHTML = item.key;
        }
      });
  }


  keyAnimation(key) {
    const btn = this.wrapper.querySelector(`button[data-key = ${key}]`);
    btn.classList.toggle('keyboard__button_active');
  }

  capsLockEvent() {
    if (this.capsLockState) {
      this.showKeysCapsLock();
    } else {
      this.showKeysUnCapsLock();
    }
  }

  shiftEvent() {
    this.shiftState = !this.shiftState;
    if (this.shiftState) {
      this.showKeysShift();
    } else {
      this.showKeysDefult();
    }
  }

  tabEvent() {
    this.writeTextArea('\t');
  }

  enterEvent() {
    this.writeTextArea('\n');
  }

  backSpaceEvent() {
    const position = this.textArea.selectionStart;
    if (this.textArea.value && position !== 0) {
      const text = this.textArea.value.slice(0, this.textArea.selectionStart - 1)
        + this.textArea.value.slice(this.textArea.selectionStart);
      this.textArea.value = '';
      this.writeTextArea(text);
      this.setPositionCursor(position - 1);
    } else {
      this.setPositionCursor(0);
    }
  }

  arrowDown() {
    this.setPositionCursor(this.textArea.value.length);
  }

  arrowUp() {
    this.setPositionCursor(0);
  }

  arrowLeft() {
    this.setPositionCursor(this.textArea.selectionStart - 1);
  }

  arrowRight() {
    this.setPositionCursor(this.textArea.selectionStart + 1);
  }

  setPositionCursor(pos) {
    this.textArea.selectionStart = pos;
    this.textArea.selectionEnd = this.textArea.selectionStart;
    this.textArea.focus();
  }

  writeTextArea(key) {
    if (key === '&amp;') {
      key = '&';
    }
    this.textArea.setRangeText(key, this.textArea.selectionStart, this.textArea.selectionEnd, 'end');
    this.textArea.focus();
  }

  keyClickMouseEvent(e) {
    if (e.target.tagName === 'BUTTON') {
      if (e.ctrlKey && e.target.dataset.key === 'ShiftLeft') {
        this.changeLanguage();
        if (this.capsLockState) {
          this.showKeysCapsLock();
        }
      }
      switch (e.target.dataset.key) {
        case 'CapsLock':
          this.capsLockState = !this.capsLockState;
          this.keyAnimation(e.target.dataset.key);
          this.capsLockEvent(e);
          break;
        case 'Backspace':
          this.backSpaceEvent(e);
          break;
        case 'Tab':
          this.tabEvent(e);
          break;
        case 'Enter':
          this.enterEvent(e);
          break;
        case 'ArrowUp':
          this.arrowUp(e);
          break;
        case 'ArrowDown':
          this.arrowDown(e);
          break;
        case 'ArrowLeft':
          this.arrowLeft(e);
          break;
        case 'ArrowRight':
          this.arrowRight(e);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'ControlRight':
        case 'MetaLeft':
        case 'AltLeft':
        case 'AltRight':
          break;
        case 'ControlLeft':
          if (this.shiftState) {
            this.changeLanguage();
            if (this.capsLockState) {
              this.showKeysCapsLock();
            }
          }
          break;
        default:
          this.writeTextArea(e.target.innerHTML, 1);
      }
    }
  }

  keyDownEvent(e) {
    if (this.buttons[this.getLanguage()].find((item) => item.keyCode === e.code)) {
      if (this.shiftState && e.repeat) {
        return false;
      }
      if (this.capsLockState && e.repeat) {
        return false;
      }
      if (e.key === 'Control' && e.repeat) {
        return false;
      }
      if (e.key === 'Alt' && e.repeat) {
        return false;
      }
      if (e.key === 'Enter' && e.repeat) {
        return false;
      }
      if (e.key === 'Backspace' && e.repeat) {
        return false;
      }

      if (e.shiftKey && e.ctrlKey) {
        this.changeLanguage();
        if (this.capsLockState) {
          this.showKeysCapsLock();
        }
      }
      switch (e.key) {
        case 'CapsLock':
          this.capsLockState = !this.capsLockState;
          this.keyAnimation(e.code);
          this.capsLockEvent(e);
          if (this.shiftState && this.capsLockState) {
            this.showKeysUnCapsLock();
          }
          if (this.shiftState && !this.capsLockState) {
            this.showKeysShift();
          }
          break;
        case 'Shift':
          e.preventDefault();
          this.shiftEvent(e);
          this.keyAnimation(e.code);
          if (this.capsLockState) {
            this.showKeysUnCapsLock();
          }
          break;
        case 'Backspace':
          this.keyAnimation(e.code);
          break;
        case 'Enter':
          this.keyAnimation(e.code);
          break;
        case 'Tab':
          this.tabEvent(e);
          e.preventDefault();
          this.keyAnimation(e.code);
          break;
        case 'Control':
          this.keyAnimation(e.code);
          break;
        case 'Alt':
          e.preventDefault();
          this.keyAnimation(e.code);
          break;
        case 'Space':
          e.preventDefault();
          this.keyAnimation(e.code);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
        case 'Meta':
          this.keyAnimation(e.code);
          break;
        default:
          e.preventDefault();
          this.writeTextArea(this.wrapper.querySelector(`button[data-key = ${e.code}]`).innerHTML);
          this.keyAnimation(e.code);
      }
      console.log(e.key);
    }
    return null;
  }

  keyUpEvent(e) {
    if (this.buttons[this.getLanguage()].find((item) => item.keyCode === e.code)) {
      switch (e.key) {
        case 'CapsLock':
          break;
        case 'Shift':
          e.preventDefault();
          this.shiftEvent(e);
          this.keyAnimation(e.code);
          if (this.capsLockState) {
            this.showKeysCapsLock();
          }
          break;
        case 'Control':
          e.preventDefault();
          this.keyAnimation(e.code);
          if (this.shiftState) {
            this.showKeysShift();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
          this.keyAnimation(e.code);
          break;
        default:
          e.preventDefault();
          this.keyAnimation(e.code);
      }
    }
    return null;
  }

  init() {
    this.wrapper.classList.add('wrapper');
    document.body.append(this.wrapper);

    this.textArea.classList.add('text');
    this.wrapper.append(this.textArea);

    const keyboard = createElementDom('div', this.wrapper, 'keyboard');
    const keyboardButtons = createElementDom('div', keyboard, 'keyboard__buttons');

    const info = createElementDom('div', this.wrapper, 'info');
    info.innerHTML = 'Keyboard created in Windows.To change the language, hold Shift + Control.';

    for (let i = 0; i < buttons[this.getLanguage()].length; i += 1) {
      const line = createElementDom('div', keyboardButtons, 'line');
      buttons[this.getLanguage()][i].forEach((item) => {
        const btn = createElementDom('button', line, 'keyboard__button');
        switch (item.keyCode) {
          case 'Backspace':
          case 'Tab':
          case 'CapsLock':
          case 'ControlLeft':
          case 'ControlRight':
          case 'AltRight':
            btn.classList.add('keyboard__button_middle');
            break;
          case 'Enter':
          case 'ShiftLeft':
          case 'ShiftRight':
            btn.classList.add('keyboard__button_long');
            break;
          case 'Space':
            btn.classList.add('keyboard__button_space');
            break;
          default:
            btn.classList.add('keyboard__button_default');
        }
        btn.innerHTML = item.key;
        btn.dataset.key = item.keyCode;
      });
    }

    window.addEventListener('keydown', this.keyDownEvent.bind(this));
    window.addEventListener('keyup', this.keyUpEvent.bind(this));
    keyboard.addEventListener('click', this.keyClickMouseEvent.bind(this));
  }
}


const keyboard = new KeyBoard();
keyboard.init();
