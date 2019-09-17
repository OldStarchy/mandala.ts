import { ButtonState } from './ButtonState';

export class KeyboardState {
	public keys: {
		[propName: string]: ButtonState;
	} = {};

	public getKey(code: string) {
		if (typeof this.keys[code] == 'number') return this.keys[code];
		else return ButtonState.UP;
	}
}
