import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ tablist, panellist }) => {
	let refs = [
		useRef(),
		useRef(),
		useRef(),
		useRef(),
		useRef(),
		useRef(),
		useRef(),
	];

	const [isActive, setIsActive] = useState(0);
	const [width, setWidth] = useState(0);
	const [position, setPosition] = useState(0);

	const changeActive = (nb) => {
		setIsActive(nb);
		setWidth(refs[nb].current.offsetWidth);
		setPosition(refs[nb].current.offsetLeft);
	};

	return (
		<section className='section-tab mt-3'>
			<div className='tab-header'>
				{tablist.map((tab, index) => (
					<button
						className='tab-header-btn'
						key={index}
						onClick={() => changeActive(index)}
						ref={refs[index]}
						style={{ height: refs[0].current && refs[0].current.offsetHeight }}
					>
						{tablist.length > 3 ? (
							<>
								{tab.substring(0, 4)}
								<span className='hide-sm'>{tab.substring(4)}</span>
							</>
						) : (
							tab
						)}
					</button>
				))}
			</div>
			<div className='tab-header-line'>
				<div style={{ width, left: position }} className='line'></div>
			</div>
			<div className='mt-1'>
				{panellist.map((Panel, index) => (
					<div
						key={index}
						className={`tab-content-panel ${
							isActive === index ? 'active' : ''
						}`}
					>
						<Panel typeF={tablist[index]} period={index + 1} />
					</div>
				))}
			</div>
		</section>
	);
};

Tabs.prototypes = {
	tablist: PropTypes.array.isRequired,
	panellist: PropTypes.array.isRequired,
};

export default Tabs;
