import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ImSearch } from "react-icons/im";
import { FaChalkboardTeacher } from "react-icons/fa";

import { clearSearch } from "../../../../../actions/user";
import { updateCurrentNav } from "../../../../../actions/global";

const TeacherNavbar = ({
   global: { currentNav, menuToggle },
   clearSearch,
   updateCurrentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "user" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/user/search"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  updateCurrentNav("user", true);
               }}
            >
               <ImSearch />
               <span className="hide-md">&nbsp; Búsqueda</span>
            </Link>
         </li>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "class" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/class/all"
               onClick={() => {
                  window.scroll(0, 0);
                  updateCurrentNav("class", true);
               }}
            >
               <FaChalkboardTeacher />
               <span className="hide-md">&nbsp; Clases</span>
            </Link>
         </li>
      </>
   );
};

const mapStateToProps = (state) => ({
   global: state.global,
});

export default connect(mapStateToProps, {
   clearSearch,
   updateCurrentNav,
})(TeacherNavbar);
