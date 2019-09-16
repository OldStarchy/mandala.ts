import * as React from 'react';
import { Tool } from '../Tool/Tool';

export const ToolbarButton = (props: { tool: Tool; onClick: () => void; style: React.CSSProperties }) => (
	<button style={props.style} onClick={props.onClick}>
		{props.tool.getName()}
	</button>
);
