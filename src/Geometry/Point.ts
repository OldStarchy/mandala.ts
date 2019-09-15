export class Point {
	public constructor(public readonly x: number, public readonly y: number) {}
	public sub(other: Point) {
		return new Point(this.x - other.x, this.y - other.y);
	}

	public magnitudeSqr() {
		return this.x ** 2 + this.y ** 2;
	}

	public xy(): [number, number] {
		return [this.x, this.y];
	}
}
