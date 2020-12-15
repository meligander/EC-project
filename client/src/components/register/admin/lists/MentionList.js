import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const MentionList = ({ enrollments: { enrollments, loadingEnrollments } }) => {
   return <div></div>;
};

MentionList.propTypes = {
   enrollments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
   enrollments: state.enrollments,
});

export default connect()(MentionList);
