import React, { useState } from "react";

import UserSearch from "../../../../../sharedComp/search/UserSearch";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";

const TutorInfo = ({ setChildren, children, clearProfile, isAdmin }) => {
   const [selectedStudent, setSelectedStudent] = useState({});

   return (
      <div className="my-4">
         {isAdmin && (
            <UserSearch
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
