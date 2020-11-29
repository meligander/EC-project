import React from 'react';
import spinner from '../../img/spinner.gif';

const Loading = () => {
	return (
		<div className={'popup'}>
			<img
				src={spinner}
				style={{
					width: '300px',
					display: 'flex',
					margin: '0 auto',
				}}
				alt=''
			/>
		</div>
	);
};

export default Loading;
