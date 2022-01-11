import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FaChalkboardTeacher } from "react-icons/fa";

import { updateCurrentNav } from "../../../../../actions/mixvalues";

const StudentNavbar = ({
   auth: {
      userLogged: { classInfo },
   },
   mixvalues: { menuToggle, currentNav },
   updateCurrentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "class" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to={`/class/single/${classInfo._id}`}
               onClick={() => {
                  window.scroll(0, 0);
                  updateCurrentNav("class", true);
               }}
            >
               <FaChalkboardTeacher />
               <span className="hide-md">&nbsp; Clase</span>
            </Link>
         </li>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, { updateCurrentNav })(StudentNavbar);
