import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserCircle, FaRegUserCircle } from "react-icons/fa";

import { clearProfile } from "../../../../../actions/user";
import { updateCurrentNav } from "../../../../../actions/mixvalues";

const GuardianNavbar = ({
   auth: { userLogged },
   mixvalues: { currentNav, menuToggle },
   updateCurrentNav,
   clearProfile,
}) => {
   return (
      <>
         {userLogged.children.length > 0 &&
            userLogged.children.map((child, index) => (
               <li
                  key={child._id}
                  className={`nav-item ${menuToggle ? "show" : ""} ${
                     currentNav === "child" + index ? "current" : ""
                  }`}
               >
                  <Link
                     className="nav-link"
                     to={`/index/dashboard/${child._id}`}
                     onClick={() => {
                        window.scroll(0, 0);
                        clearProfile();
                        updateCurrentNav(`child${index}`, true);
                     }}
                  >
                     {index % 2 === 0 ? <FaRegUserCircle /> : <FaUserCircle />}
                     <span className="hide-md">
                        &nbsp; {child.lastname + ", " + child.name}
                     </span>
                     <span className="show-md">
                        &nbsp;{child.lastname[0] + child.name[0]}
                     </span>
                  </Link>
               </li>
            ))}
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, { clearProfile, updateCurrentNav })(
   GuardianNavbar
);
