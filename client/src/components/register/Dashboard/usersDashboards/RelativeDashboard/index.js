import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearProfile } from "../../../../../actions/user";

import "./style.scss";

const RelativeDashboard = ({
   users: { user, users, usersLoading },
   clearProfile,
}) => {
   const student = user.studentnumber;

   const relatives = (user) => {
      return (
         <>
            <p>
               {user.lastname}, {user.name}
            </p>
            <Link
               className="btn-text"
               to={`/dashboard/${user._id}`}
               onClick={() => {
                  window.scroll(0, 0);
                  clearProfile();
               }}
            >
               Ver Info
            </Link>
         </>
      );
   };

   return (
      <>
         {!usersLoading && (
            <div className=" p-3 bg-lightest-secondary">
               <h3 className="heading-tertiary text-primary text-center">
                  {student ? "Tutores" : "Alumnos a Cargo"}
               </h3>
               {users.length !== 0 || user.children.length !== 0 ? (
                  <div className="relatives">
                     {!student
                        ? user.children.map((child, index) => (
                             <div key={index} className="relative">
                                {relatives(child)}
                             </div>
                          ))
                        : users.map((parent, index) => (
                             <div key={index} className="relative">
                                {relatives(parent)}
                             </div>
                          ))}
                  </div>
               ) : (
                  <p className="heading-tertiary text-center py-2">
                     No hay {student ? "tutores" : "alumnos"} resgistrados
                  </p>
               )}
            </div>
         )}
      </>
   );
};

RelativeDashboard.propTypes = {
   users: PropTypes.object.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, {
   clearProfile,
})(RelativeDashboard);
