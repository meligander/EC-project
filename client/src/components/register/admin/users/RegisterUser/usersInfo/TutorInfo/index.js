import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearSearch } from "../../../../../../../actions/user";
import { setAlert } from "../../../../../../../actions/alert";

import ChosenChildrenTable from "../../../../../../tables/ChosenChildrenTable";
import StudentSearch from "../../../../../../sharedComp/search/StudentSearch";

const TutorInfo = ({
   setChildren,
   children,
   setAlert,
   clearSearch,
   isAdmin,
}) => {
   const [selectedStudent, setSelectedStudent] = useState({
      _id: "",
      name: "",
   });

   const selectStudent = (user) => {
      setSelectedStudent({
         ...selectedStudent,
         _id: user._id,
         name: user.lastname + " " + user.name,
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
            />
         )}
         <h3 className="heading-tertiary text-primary">
            Lista de Alumnos a Cargo
         </h3>
         {children.length > 0 && (
            <ChosenChildrenTable
               children={children}
               deleteChild={deleteChild}
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
};

export default connect(null, {
   setAlert,
   clearSearch,
})(TutorInfo);