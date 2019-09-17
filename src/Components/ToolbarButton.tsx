import * as React from 'react';

export const ToolbarButton = (props: { text: string; onClick: () => void; style: React.CSSProperties }) => (
	<button style={props.style} onClick={props.onClick}>
		{props.text}
	</button>
);
