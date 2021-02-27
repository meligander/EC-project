import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearClass, loadClasses } from "../../../../../../actions/class";
import { clearSearch } from "../../../../../../actions/user";

import ClassesTable from "../../../sharedComp/tables/ClassesTable";
import Loading from "../../../../../modal/Loading";

const TeacherDashboard = ({
   classes: { classes, loadingClasses },
   users: { user },
   loadClasses,
   clearClass,
   clearSearch,
}) => {
   useEffect(() => {
      if (loadingClasses) loadClasses({ teacher: user._id });
   }, [user._id, loadClasses, loadingClasses]);

   return (
      <div className="p-4 bg-white">
         {!loadingClasses ? (
            <>
               <h3 className="heading-secondary text-dark p-1">Clases</h3>
               {classes.length > 0 ? (
                  <ClassesTable
                     classes={classes}
                     all={false}
                     clearClass={clearClass}
                     clearSearch={clearSearch}
                  />
               ) : (
                  <p className="heading-tertiary text-center">
                     No hay classes registradas
                  </p>
               )}
            </>
         ) : (
            <Loading />
         )}
      </div>
   );
};

TeacherDashboard.propTypes = {
   classes: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadClasses: PropTypes.func.isRequired,
   clearClass: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadClasses,
   clearClass,
   clearSearch,
})(TeacherDashboard);
