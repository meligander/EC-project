import React, { useState } from "react";

import UsersSearch from "../../../../../sharedComp/search/UsersSearch";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";

const TutorInfo = ({ setChildren, children, clearProfile, isAdmin }) => {
   const [selectedUser, setSelectedUser] = useState(null);

   return (
      <div className="my-4">
         {isAdmin && (
            <UsersSearch
               autoComplete="off"
               selectUser={(user) => setSelectedUser(user)}
               selectedUser={selectedUser}
               usersType="student"
               primary={true}
               restore={() => setSelectedUser(null)}
               button="children"
               actionForSelected={(e) => {
                  e.preventDefault();
                  setChildren(selectedUser, true);
                  setSelectedUser(null);
               }}
            />
         )}
         <h3 className="heading-tertiary text-primary pt-4">
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
