import { EventEmitter } from '../EventEmitter/EventEmitter';

export class Keyboard extends EventEmitter {
	public constructor() {
		super();
		const events: Array<keyof HTMLElementEventMap> = ['keydown', 'keyup'];
		for (const eventType of events) {
			document.addEventListener(eventType, e => this.trigger(e.type, e));
		}
	}
}
