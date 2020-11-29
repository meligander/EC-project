import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ClassInfo = ({ classInfo }) => {
	return (
		<div className='class-info'>
			<h3>{classInfo.category.name}</h3>
			<div className='heading-tertiary'>
				<p>
					<span className='text-dark'>Profesor: </span>
					{classInfo.teacher.lastname} {classInfo.teacher.name}
				</p>
				<p className='paragraph'>
					<span className='text-dark'>Aula:</span> {classInfo.classroom}
				</p>
			</div>
			<p></p>
			<div className='days'>
				<div>
					<p>
						<span className='text-dark'>Día 1: </span>
						{classInfo.day1}
					</p>
					<div className='schedule'>
						<p>
							<span className='text-dark'>Entrada: </span>
							<Moment format='HH:mm' date={classInfo.hourin1} />
						</p>
						<p>
							<span className='text-dark'>Salida: </span>
							<Moment format='HH:mm' date={classInfo.hourout1} />
						</p>
					</div>
				</div>
				<div>
					<p>
						<span className='text-dark'>Día 2: </span>
						{classInfo.day2}
					</p>
					<div className='schedule'>
						<p>
							<span className='text-dark'>Entrada: </span>
							<Moment format='HH:mm' date={classInfo.hourin2} />
						</p>
						<p>
							<span className='text-dark'>Salida: </span>
							<Moment format='HH:mm' date={classInfo.hourout2} />
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

ClassInfo.propTypes = {
	classInfo: PropTypes.object.isRequired,
};

export default ClassInfo;
