import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearSearch, clearProfile } from "../../../../../../../actions/user";
import { setAlert } from "../../../../../../../actions/alert";

import StudentSearch from "../../../../../sharedComp/search/StudentSearch";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";

const TutorInfo = ({
   setChildren,
   children,
   setAlert,
   clearSearch,
   clearProfile,
   isAdmin,
}) => {
   const [selectedStudent, setSelectedStudent] = useState({
      _id: "",
      name: "",
      lastname: "",
      dob: "",
      studentnumber: "",
   });

   const selectStudent = (user) => {
      setSelectedStudent({
         _id: user._id,
         name: user.name,
         lastname: user.lastname,
         dob: user.dob,
         studentnumber: user.studentnumber,
      });
   };

   const addToList = (e) => {
      e.preventDefault();
      let exist = false;
      for (let x = 0; x < children.length; x++) {
         if (children[x]._id === selectedStudent._id) exist = true;
      }
      if (!exist) {
         setChildren(selectedStudent, true);
         setSelectedStudent({
            _id: "",
            name: "",
            lastname: "",
            dob: "",
            studentnumber: "",
         });
         clearSearch();
      } else {
         setAlert("El alumno ya ha sido agregado", "danger", "3");
      }
   };

   const deleteChild = (e, childToDelete) => {
      e.preventDefault();
      setChildren(childToDelete, false);
   };
   return (
      <div className="my-4">
         {isAdmin && (
            <StudentSearch
               actionForSelected={addToList}
               selectedStudent={selectedStudent}
               selectStudent={selectStudent}
               typeSearch="student"
            />
         )}
         <h3 className="heading-tertiary text-primary">
            Lista de Alumnos a Cargo
         </h3>
         {children.length > 0 && (
            <StudentTable
               users={children}
               clearProfile={clearProfile}
               loadingUsers={true}
               actionWChild={deleteChild}
               type="chosen-child"
            />
         )}
      </div>
   );
};

TutorInfo.propTypes = {
   children: PropTypes.array.isRequired,
   setChildren: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

export default connect(null, {
   setAlert,
   clearSearch,
   clearProfile,
})(TutorInfo);
