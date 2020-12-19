import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadClasses } from "../../../../../actions/class";

import ClassesTable from "../../../../tables/ClassesTable";

const TeacherDashboard = ({
   loadClasses,
   classes: { classes, loadingClasses },
   users: { user },
}) => {
   useEffect(() => {
      loadClasses({ teacher: user._id });
   }, [user._id, loadClasses]);
   return (
      <div className="p-4 bg-white">
         {!loadingClasses && (
            <>
               <h3 className="heading-secondary text-dark p-1">Cursos</h3>
               {classes.length > 0 ? (
                  <ClassesTable classes={classes} all={false} />
               ) : (
                  <p className="heading-tertiary text-center">
                     No hay classes registradas
                  </p>
               )}
            </>
         )}
      </div>
   );
};

TeacherDashboard.propTypes = {
   classes: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadClasses: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, { loadClasses })(TeacherDashboard);
