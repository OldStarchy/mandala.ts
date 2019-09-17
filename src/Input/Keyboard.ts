import { EventEmitter } from '../EventEmitter/EventEmitter';
import { ButtonState } from './ButtonState';
import { KeyboardState } from './KeyboardState';

type AttachableObject = Document;

export class Keyboard extends EventEmitter {
	public keys: { [propName: string]: ButtonState } = {};
	public hadInput = false;
	private preventDefault = false;

	public element: AttachableObject | null = null;
	private attach: () => void;
	private detach: () => void;

	public constructor(element?: AttachableObject) {
		super();

		const keyEvent = (event: KeyboardEvent) => {
			this.hadInput = true;

			if (event.type == 'keyup') {
				this.keys[event.key] = ButtonState.RELEASED;
			} else {
				this.keys[event.key] = ButtonState.PRESSED;

				this.trigger(event.type, event);
			}

			if (this.preventDefault) event.preventDefault();
		};

		this.attach = () => {
			this.element!.addEventListener('keydown', keyEvent, false);
			this.element!.addEventListener('keyup', keyEvent, false);
		};

		this.detach = () => {
			this.element!.removeEventListener('keydown', keyEvent, false);
			this.element!.removeEventListener('keyup', keyEvent, false);
		};

		if (element) {
			this.setElement(element);
		}
	}

	public setElement(element: AttachableObject) {
		if (this.element !== null) this.detach();

		this.element = element;

		if (this.element !== null) this.attach();
	}

	public setPreventDefault(prevent: boolean) {
		this.preventDefault = prevent;
	}

	public clear() {
		this.keys = {};
	}

	public getKey(code: string) {
		if (typeof this.keys[code] == 'number') return this.keys[code];
		else return ButtonState.UP;
	}

	public update() {
		for (const key in this.keys) {
			if (this.keys.hasOwnProperty(key)) {
				this.keys[key] |= 1;
			}
		}
		this.hadInput = false;
	}

	public getState() {
		const state = new KeyboardState();

		state.keys = {};
		for (const key in this.keys) {
			if (this.keys.hasOwnProperty(key)) {
				if (this.keys[key] != 1) state.keys[key] = this.keys[key];
			}
		}
		return state;
	}

	public isDown(code: string) {
		const key = this.getKey(code);

		return key == ButtonState.DOWN || key == ButtonState.PRESSED;
	}
}
