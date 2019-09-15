import { Context } from '../Context';

export abstract class Tool {
	public constructor(protected readonly context: Context) {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onActivate(): void {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onDeactivate(): void {}
}
