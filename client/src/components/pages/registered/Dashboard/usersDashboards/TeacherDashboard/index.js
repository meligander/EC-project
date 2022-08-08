import React, { useEffect } from "react";
import { connect } from "react-redux";

import { clearClass, loadClasses } from "../../../../../../actions/class";
import { clearSearch } from "../../../../../../actions/user";

import ClassesTable from "../../../sharedComp/tables/ClassesTable";

const TeacherDashboard = ({
   classes: { classes, loading },
   user,
   loadClasses,
   clearClass,
   clearSearch,
}) => {
   useEffect(() => {
      if (loading)
         loadClasses(
            { ...(user.type === "teacher" && { teacher: user._id }) },
            false
         );
   }, [user._id, loadClasses, loading, user]);

   return (
      <div className="p-4 bg-white">
         <h3 className="heading-secondary text-dark p-1">Clases</h3>
         {!loading && (
            <>
               {classes.length > 0 ? (
                  <ClassesTable
                     classes={classes}
                     all={user.type !== "teacher"}
                     clearClass={clearClass}
                     clearSearch={clearSearch}
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

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadClasses,
   clearClass,
   clearSearch,
})(TeacherDashboard);
