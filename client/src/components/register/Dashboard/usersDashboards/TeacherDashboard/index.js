import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearClasses, loadClasses } from "../../../../../actions/class";
import { clearSearch } from "../../../../../actions/user";

import ClassesTable from "../../../../tables/ClassesTable";
import { updatePreviousPage } from "../../../../../actions/mixvalues";

const TeacherDashboard = ({
   loadClasses,
   classes: { classes, loadingClasses },
   users: { user },
   clearClasses,
   clearSearch,
   updatePreviousPage,
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
                  <ClassesTable
                     classes={classes}
                     all={false}
                     clearClass={clearClasses}
                     clearSearch={clearSearch}
                     updatePreviousPage={updatePreviousPage}
                  />
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
   clearClasses: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadClasses,
   clearClasses,
   clearSearch,
   updatePreviousPage,
})(TeacherDashboard);
