import { Context } from '../Context';
import { EventHandler } from '../EventEmitter/EventEmitter';
import { IShortcut } from './IShortcut';
import { ShortcutStroke } from './ShortcutStroke';

export class ShortcutManager {
	private readonly shortcuts: {
		input: IShortcut;
		command: string;
	}[] = [];

	private onKeyDownHandler: EventHandler<KeyboardEvent>;

	public constructor(private context: Context) {
		this.onKeyDownHandler = this.onKeyDown.bind(this);
		context.keyboard.on('keydown', this.onKeyDownHandler);
	}

	private onKeyDown(event: KeyboardEvent) {
		const sc = this.getShortcutForEvent(event);
		if (sc) {
			console.log(`Shortcut "${sc.input.toString()}" detected`);
			this.context.command.run(sc.command);
		}
	}

	public register(input: IShortcut, command: string): void;
	public register(input: string, command: string): void;
	public register(input: string | IShortcut, command: string): void {
		if (typeof input === 'string') {
			input = ShortcutStroke.parse(input);
		}
		for (const sc of this.shortcuts) {
			if (sc.input.equals(input)) {
				throw `Duplicate shortcut input "${input.toString()}"`;
			}
		}
		console.log(`Shortcut "${input.toString()}" registered for "${command}"`);
		this.shortcuts.push({
			input,
			command,
		});
	}

	public getShortcutForEvent(event: KeyboardEvent) {
		return this.shortcuts.find(sc => sc.input.matches(event)) || null;
	}
}
