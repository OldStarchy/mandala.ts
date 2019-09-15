import * as React from 'react';

export interface MyCanvasProps {
	width: number;
	height: number;
}

export const MyCanvas = ({ width, height }: MyCanvasProps) => <canvas width={width} height={height} />;
