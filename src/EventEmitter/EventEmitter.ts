import { IEventEmitter } from './IEventEmitter';

export type EventHandler<T = unknown> = (event: T) => void;

export class EventEmitter implements IEventEmitter {
	private _handlers: {
		[propName: string]: EventHandler[];
	} = {};

	public one<T = unknown>(type: string): Promise<T>;
	public one<T = unknown>(type: string, handler: EventHandler<T>): void;
	public one<T = unknown>(type: string, handler?: EventHandler<T>): Promise<T> | void {
		if (handler) {
			const once = (event: T) => {
				handler(event);
				this.off(type, once);
			};
			this.on(type, once);
		} else {
			return new Promise<T>((s, f) => {
				this.one<T>(type, s);
			});
		}
	}

	public on<T = unknown>(type: string, handler: EventHandler<T>) {
		(this._handlers[type] || (this._handlers[type] = [])).push(handler as EventHandler);
	}

	public off<T = unknown>(type: string, handler: EventHandler<T>) {
		let index;
		if (this._handlers[type] && (index = this._handlers[type].indexOf(handler as EventHandler)) !== -1) {
			this._handlers[type].splice(index, 1);
		}
	}

	public trigger<T = unknown>(type: string, event: T) {
		const handlers = (this._handlers[type] || []).slice();
		if (handlers.length > 0) {
			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
