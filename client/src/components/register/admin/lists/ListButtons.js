import React from 'react';
import PropTypes from 'prop-types';

const ListButtons = ({ changePage, items, page, pdfGeneratorSave }) => {
	const itemsNumber = page * 10;
	const sub = items.length - itemsNumber;
	return (
		<>
			{items.length > 10 && (
				<div className='btn-ctr	'>
					{page !== 0 && (
						<button
							onClick={() => changePage(page - 1)}
							className='btn btn-primary'
						>
							<i className='fas fa-angle-double-left'></i>
						</button>
					)}

					{sub >= 10 && (
						<button
							onClick={() => changePage(page + 1)}
							className='btn btn-primary'
						>
							<i className='fas fa-angle-double-right'></i>
						</button>
					)}
				</div>
			)}

			<div className='btn-right'>
				<button className='btn btn-secondary' onClick={pdfGeneratorSave}>
					<i className='far fa-save'></i>
				</button>
				<button className='btn btn-secondary'>
					<i className='fas fa-print'></i>
				</button>
			</div>
		</>
	);
};

ListButtons.propTypes = {
	page: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired,
	changePage: PropTypes.func.isRequired,
};

export default ListButtons;
