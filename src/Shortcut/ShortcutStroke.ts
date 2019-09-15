import { IShortcut } from './IShortcut';
// class ShortcutChord implements IShortcut {
// 	public static parse(str: string) {
// 		const parts = str.split(',').map(part => part.trim());
// 		if (parts.length > 1) {
// 			throw 'Chorded shortcuts not implemented';
// 		}
// 		const stroke = parts[0];
// 		return ShortcutStroke.parse(stroke);
// 	}
// }
export class ShortcutStroke implements IShortcut {
	public constructor(
		public readonly key: string,
		public readonly ctrl: boolean = false,
		public readonly shift: boolean = false,
		public readonly alt: boolean = false,
	) {}

	public equals(other: IShortcut): boolean {
		if (other instanceof ShortcutStroke) {
			return this.key === other.key && this.ctrl === other.ctrl && this.shift === other.shift && this.alt === other.alt;
		}
		return false;
	}

	public matches(event: KeyboardEvent) {
		if (this.key !== event.key) return false;
		if (this.ctrl && !event.ctrlKey) return false;
		if (this.shift && !event.shiftKey) return false;
		if (this.alt && !event.altKey) return false;
		return true;
	}

	public toString() {
		return [this.alt ? 'alt' : null, this.ctrl ? 'ctrl' : null, this.shift ? 'shift' : null, this.key]
			.filter(v => v !== null)
			.join('+');
	}

	public static parse(str: string) {
		const keys = str.split('+').map(key => key.trim());
		if (keys.length == 0) {
			throw `Invalid shortcut string ${str}`;
		}
		let alt = false;
		let ctrl = false;
		let shift = false;
		const key = keys.pop()!;
		keys.forEach(modifier => {
			if (modifier === 'alt') {
				alt = true;
				return;
			}
			if (modifier === 'ctrl') {
				ctrl = true;
				return;
			}
			if (modifier === 'shift') {
				shift = true;
				return;
			}
			throw `Invalid shortcut string ${str}`;
		});
		return new ShortcutStroke(key, ctrl, shift, alt);
	}
}
