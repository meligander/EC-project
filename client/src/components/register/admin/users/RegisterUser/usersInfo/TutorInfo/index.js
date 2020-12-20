import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadRelatives, clearSearch } from "../../../../../../../actions/user";
import { setAlert } from "../../../../../../../actions/alert";

import ChosenChildrenTable from "../../../../../../tables/ChosenChildrenTable";
import StudentSearch from "../../../../../../sharedComp/search/StudentSearch";

const TutorInfo = ({
   setChildrenForm,
   isEditing,
   user_id,
   users: { relatives, relativesLoading },
   loadRelatives,
   setAlert,
   clearSearch,
   isAdmin,
}) => {
   const [selectedStudent, setSelectedStudent] = useState({
      _id: "",
      name: "",
   });
   const [children, setchildren] = useState([]);

   useEffect(() => {
      if (isEditing) {
         loadRelatives(user_id, false);
         let child = {};
         for (let x = 0; x < relatives.length; x++) {
            child = {
               _id: relatives[x]._id,
               name: relatives[x].lastname + ", " + relatives[x].name,
            };
            children.push(child);
            setChildrenForm(child._id);
         }
      }
      // eslint-disable-next-line
   }, [relativesLoading, isEditing, user_id]);

   const selectStudent = (user) => {
      setSelectedStudent({
         ...selectedStudent,
         name: user.lastname + " " + user.name,
         _id: user._id,
      });
   };

   const addToList = (e) => {
      e.preventDefault();
      let exist = false;
      for (let x = 0; x < children.length; x++) {
         if (children[x]._id === selectedStudent._id) exist = true;
      }
      if (!exist) {
         setchildren([...children, selectedStudent]);
         setChildrenForm(selectedStudent._id);
         setSelectedStudent({
            name: "",
            _id: "",
         });
         clearSearch();
      } else {
         setAlert("El alumno ya ha sido agregado", "danger", "3");
      }
   };

   const deleteChild = (e, childToDelete) => {
      e.preventDefault();
      setchildren(children.filter((child) => child._id !== childToDelete._id));
      setChildrenForm(childToDelete._id, false);
   };
   return (
      <div className="my-4">
         {isAdmin && (
            <StudentSearch
               addToList={addToList}
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
   users: PropTypes.object.isRequired,
   loadRelatives: PropTypes.func.isRequired,
   setChildrenForm: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, {
   loadRelatives,
   setAlert,
   clearSearch,
})(TutorInfo);
