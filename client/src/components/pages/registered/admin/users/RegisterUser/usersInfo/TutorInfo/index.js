import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

import UsersSearch from "../../../../../sharedComp/search/UsersSearch";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";
import Alert from "../../../../../../sharedComp/Alert";

const TutorInfo = ({ setChildren, children, clearProfile, isAdmin }) => {
   const [selectedUser, setSelectedUser] = useState(null);

   return (
      <div className="my-4">
         {isAdmin && (
            <>
               <h3 className="heading-tertiary text-primary">
                  Búsqueda de Alumnos
               </h3>
               <Alert type="3" />
               <UsersSearch
                  autoComplete="off"
                  selectUser={(user) => setSelectedUser(user)}
                  selectedUser={selectedUser}
                  usersType="student"
                  primary={true}
                  restore={() => setSelectedUser(null)}
               />
               <div className="btn-right mt-2">
                  <button
                     type="button"
                     className="btn btn-dark"
                     onClick={(e) => {
                        e.preventDefault();
                        setChildren(selectedUser, true);
                        setSelectedUser(null);
                     }}
                  >
                     <FaPlus />
                     <span className="hide-md">&nbsp; Agregar</span>
                  </button>
               </div>
            </>
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
