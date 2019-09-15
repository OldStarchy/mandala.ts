export interface IShortcut {
	matches(event: KeyboardEvent): boolean;
	equals(other: IShortcut): boolean;
	toString(): string;
}
