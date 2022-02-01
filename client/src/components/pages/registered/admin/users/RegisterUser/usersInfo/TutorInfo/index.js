import React, { useState } from "react";

import StudentSearch from "../../../../../sharedComp/search/StudentSearch";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";

const TutorInfo = ({ setChildren, children, clearProfile, isAdmin }) => {
   const [selectedStudent, setSelectedStudent] = useState({});

   return (
      <div className="my-4">
         {isAdmin && (
            <StudentSearch
               actionForSelected={() => {
                  setSelectedStudent({});
                  setChildren(selectedStudent, true);
               }}
               selectedStudent={selectedStudent}
               selectStudent={(user) => setSelectedStudent(user)}
               typeSearch="student"
            />
         )}
         <h3 className="heading-tertiary text-primary pt-2">
            Lista de Alumnos a Cargo
         </h3>
         <StudentTable
            users={children}
            clearProfile={clearProfile}
            loadingUsers={true}
            actionWChild={(student) => setChildren(student, false)}
            type="chosen-child"
         />
      </div>
   );
};

export default TutorInfo;
