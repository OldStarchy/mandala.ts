import { IEventEmitter } from './IEventEmitter';
import { EventHandler } from '../mandala';
export class EventEmitter implements IEventEmitter {
	private _handlers: {
		[propName: string]: EventHandler<unknown>[];
	} = {};
	public one(type: string, handler: EventHandler) {
		const once = (event: unknown) => {
			handler(event);
			this.off(type, once);
		};
		this.on(type, once);
	}
	public on(type: string, handler: EventHandler) {
		(this._handlers[type] || (this._handlers[type] = [])).push(handler);
	}
	public off(type: string, handler: EventHandler) {
		let index;
		if (
			this._handlers[type] &&
			(index = this._handlers[type].indexOf(handler)) !== -1
		) {
			this._handlers[type].splice(index, 1);
		}
	}
	public trigger<T = any>(type: string, event: T) {
		const handlers = (this._handlers[type] || []).slice();
		if (handlers.length > 0) {
			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
