import { EventEmitter } from '../EventEmitter/EventEmitter';

export class Mouse extends EventEmitter {
	public constructor(element: HTMLElement) {
		super();
		const events: Array<keyof HTMLElementEventMap> = ['mousedown', 'mouseup', 'mousemove'];
		for (const eventType of events) {
			element.addEventListener(eventType, e => this.trigger(e.type, e));
		}
	}
}
