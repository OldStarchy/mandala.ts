import { EventHandler } from './EventEmitter';

export interface IEventEmitter {
	on(type: string, handler: EventHandler): void;
	off(type: string, handler: EventHandler): void;
	one(type: string, handler: EventHandler): void;
}
