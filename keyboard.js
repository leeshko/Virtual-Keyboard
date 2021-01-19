const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {

        //create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        //add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Auto use keyboard
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            })
        })

        const parentForKeyboard = document.querySelector('.keyboard__keys');
        parentForKeyboard.addEventListener('click', event => {
            if (Object.values(event.target.parentNode.classList).indexOf('keyboard__key') === -1 && Object.values(event.target.classList).indexOf('keyboard__key') === -1) {
                return;
            } else if (Object.values(event.target.classList).indexOf('keyboard__key--extra-wide') !== -1 || Object.values(event.target.parentNode.classList).indexOf('keyboard__key--extra-wide') !== -1) {
                this.properties.value += ' ';
                this._triggerEvent('oninput');
            } else if (Object.values(event.target.classList).indexOf('backspace') !== -1 || Object.values(event.target.parentNode.classList).indexOf('backspace') !== -1) {
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                this._triggerEvent('oninput');
            } else if (Object.values(event.target.classList).indexOf('keyboard__key--activatable') !== -1 || Object.values(event.target.parentNode.classList).indexOf('keyboard__key--activatable') !== -1) {
                this._toggleCapsLock();
                keyboard_capslock.parentNode.classList.toggle('keyboard__key--active', this.properties.capslock);  
            } else if (Object.values(event.target.classList).indexOf('return') !== -1 || Object.values(event.target.parentNode.classList).indexOf('return') !== -1) {
                this.properties.value += '\n';
                this._triggerEvent('oninput');
            } else if (Object.values(event.target.classList).indexOf('done') !== -1 || Object.values(event.target.parentNode.classList).indexOf('done') !== -1) {
                this.close();
                this._triggerEvent('onclose');
            } else {
                this.properties.value += this.properties.capsLock ? event.target.textContent.toUpperCase() : event.target.textContent.toLowerCase();
                this._triggerEvent('oninput');
            }
        })
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Create HTML for icons 
        const createIconsHTML = (icon_name) => {
            return `<span id="${icon_name}" class="material-icons">${icon_name}</span>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {

                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide', 'backspace');
                    keyElement.innerHTML = createIconsHTML("backspace");
                    break;

                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    keyElement.innerHTML = createIconsHTML('keyboard_capslock');
                    break;

                case 'enter':
                    keyElement.classList.add('keyboard__key--wide', 'return');
                    keyElement.innerHTML = createIconsHTML('keyboard_return');
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconsHTML('space_bar');
                    break;

                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'done');
                    keyElement.innerHTML = createIconsHTML('check_circle', 'keyboard__key--dark');
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    break;
            }

            fragment.appendChild(keyElement);
            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        })
        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] === 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = null;
        this.eventHandlers.onclose = null;
        this.elements.main.classList.add('keyboard--hidden');
    }
};

window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init();
}); 