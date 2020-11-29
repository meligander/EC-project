import {
	CLASSES_LOADED,
	CLASS_ERROR,
	CLASS_LOADED,
	CLASS_CLEARED,
	CLASSES_UPDATED,
	CLASS_REGISTERED,
	CLASS_UPDATED,
	CLASSSTUDENTS_LOADED,
	CLASSSTUDENTS_ERROR,
	CLASSES_DELETED,
} from '../actions/types';

const initialState = {
	loading: true,
	classInfo: null,
	loadingClasses: true,
	classes: [],
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case CLASS_LOADED:
		case CLASS_UPDATED:
			return {
				...state,
				classInfo: payload,
				loading: false,
				error: {},
			};
		case CLASSSTUDENTS_LOADED:
			return {
				...state,
				classInfo: {
					...state.classInfo,
					students: payload,
				},
				loading: false,
			};
		case CLASSES_DELETED:
			return {
				...state,
				classes: state.classes.filter((item) => item !== payload),
				loadingClasses: false,
			};
		case CLASSES_UPDATED:
			return {
				...state,
				classes: state.classes.map((oneclass) =>
					oneclass._id === payload._id ? payload : oneclass
				),
				loadingClasses: false,
			};
		case CLASSES_LOADED:
			return {
				...state,
				classes: payload,
				loadingClasses: false,
			};
		case CLASS_REGISTERED:
			return {
				...state,
				classes: state.classes.length > 0 && [...state.classes, payload],
				loadingClasses: false,
			};
		case CLASSSTUDENTS_ERROR:
			return {
				...state,
				classInfo: {
					...state.classInfo,
					students: [],
				},
				loading: false,
			};
		case CLASS_ERROR:
			return {
				...state,
				classInfo: null,
				classes: [],
				loading: false,
				loadingClasses: false,
				error: payload,
			};
		case CLASS_CLEARED:
			return initialState;
		default:
			return state;
	}
}
