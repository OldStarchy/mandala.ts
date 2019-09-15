import { Command } from './Command';
import { Context } from '../Context';
export class CommandManager {
	private readonly commands: {
		[id: string]: Command;
	} = {};
	public constructor(private readonly context: Context) {}
	public register(id: string, command: Command) {
		if (this.commands[id]) {
			throw `Duplicate command id "${id}"`;
		}
		this.commands[id] = command;
	}
	public run(id: string) {
		if (!this.commands[id]) {
			throw `Command "${id}" does not exist`;
		}
		console.log(`Running command "${id}"`);
		this.commands[id](this.context);
	}
}
