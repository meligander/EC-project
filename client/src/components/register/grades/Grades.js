import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	loadGradesByClass,
	loadGradeTypesByCategory,
} from '../../../actions/grade';
import { loadClass } from '../../../actions/class';
import GradesTab from './GradesTab';
import PropTypes from 'prop-types';
import ClassInfo from '../admin/classes/ClassInfo';
import Loading from '../../modal/Loading';
import Tabs from '../../Tabs';

const Grades = ({
	match,
	classes,
	grades: { gradeTypes, loading },
	loadGradesByClass,
	loadGradeTypesByCategory,
	loadClass,
}) => {
	const [oneLoad, setOneLoad] = useState(true);
	useEffect(() => {
		if (oneLoad) {
			loadGradesByClass(match.params.id);
			loadClass(match.params.id, false);
			setOneLoad(false);
		} else {
			if (gradeTypes.length === 0 && !classes.loading) {
				loadGradeTypesByCategory(classes.classInfo.category._id);
			}
		}
	}, [
		classes.loading,
		oneLoad,
		loadGradeTypesByCategory,
		classes.classInfo,
		loadClass,
		loadGradesByClass,
		match.params.id,
		gradeTypes,
	]);

	return (
		<>
			{!loading ? (
				<>
					<h1 className='text-center light-font p-1 mt-2'>Notas</h1>
					<ClassInfo classInfo={classes.classInfo} />
					<div className='few-tabs'>
						<Tabs
							tablist={[
								'1° Bimestre',
								'2° Bimestre',
								'3° Bimestre',
								'4° Bimestre',
								'Final',
							]}
							panellist={[
								GradesTab,
								GradesTab,
								GradesTab,
								GradesTab,
								GradesTab,
							]}
						/>
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

Grades.propTypes = {
	grades: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	loadGradesByClass: PropTypes.func.isRequired,
	loadGradeTypesByCategory: PropTypes.func.isRequired,
	loadClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	grades: state.grades,
	classes: state.classes,
});

export default connect(mapStateToProps, {
	loadGradesByClass,
	loadClass,
	loadGradeTypesByCategory,
})(withRouter(Grades));
