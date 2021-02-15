const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        input: null
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
                this.elements.input = element;
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            })
        })

        this.elements.keysContainer.addEventListener('click', event => {
            const classList = event.target.classList;
            const parentClassList = event.target.parentNode.classList;

            this.properties.value = this.elements.input.value;
            if (!classList.contains('keyboard__key') && !parentClassList.contains('keyboard__key')) {
                return;
            } else if (classList.contains('keyboard__key--extra-wide') || parentClassList.contains('keyboard__key--extra-wide')) {
                this.properties.value += ' ';
                this._triggerEvent('oninput');
            } else if (classList.contains('backspace') || parentClassList.contains('backspace')) {
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                this._triggerEvent('oninput');
            } else if (classList.contains('keyboard__key--activatable') || parentClassList.contains('keyboard__key--activatable')) {
                this._toggleCapsLock();
                keyboard_capslock.parentNode.classList.toggle('keyboard__key--active', this.properties.capslock);
            } else if (classList.contains('return') || parentClassList.contains('return')) {
                this.properties.value += '\n';
                this._triggerEvent('oninput');
            } else if (classList.contains('done') || parentClassList.contains('done')) {
                this.close();
                this._triggerEvent('onclose');
            } else {
                this.properties.value += this.properties.capsLock ?
                    event.target.textContent.toUpperCase() :
                    event.target.textContent.toLowerCase();
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
        this.properties.value = '';
        this.eventHandlers.oninput = null;
        this.eventHandlers.onclose = null;
        this.elements.main.classList.add('keyboard--hidden');
    }
};

window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init();
}); 