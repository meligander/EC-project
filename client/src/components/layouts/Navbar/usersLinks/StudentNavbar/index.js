import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FaChalkboardTeacher } from "react-icons/fa";

import { updateCurrentNav } from "../../../../../actions/mixvalues";
import { loadEnrollments } from "../../../../../actions/enrollment";
import { clearProfile } from "../../../../../actions/user";

const StudentNavbar = ({
   auth: { userLogged },
   mixvalues: { menuToggle, currentNav },
   enrollments: { enrollments, loading },
   clearProfile,
   updateCurrentNav,
   loadEnrollments,
}) => {
   const [allEnroll, setAllEnroll] = useState([]);

   useEffect(() => {
      if (loading)
         loadEnrollments({ classroom: false, student: userLogged._id }, false);
      else setAllEnroll(enrollments);
   }, [loading, loadEnrollments, userLogged, enrollments]);

   return (
      <>
         {!loading && (
            <>
               {allEnroll
                  .sort((a, b) => {
                     if (a.date > b.date) return -1;
                     if (a.date < b.date) return 1;
                     return 0;
                  })
                  .slice(0, 4)
                  .map((item, index) => (
                     <li
                        key={item._id}
                        className={`nav-item ${menuToggle ? "show" : ""} ${
                           currentNav === "class-" + index ? "current" : ""
                        }`}
                     >
                        <Link
                           className="nav-link"
                           to={`/index/dashboard/${userLogged._id}/${item.classroom}`}
                           onClick={() => {
                              window.scroll(0, 0);
                              clearProfile(true);
                              updateCurrentNav("class-" + index, true);
                           }}
                        >
                           <FaChalkboardTeacher />
                           <span className="hide-md">
                              &nbsp; {item.category.name}
                           </span>
                           <span className="show-md">
                              &nbsp;{item.category.name.substring(0, 2)}
                           </span>
                        </Link>
                     </li>
                  ))}
            </>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   mixvalues: state.mixvalues,
   enrollments: state.enrollments,
});

export default connect(mapStateToProps, {
   updateCurrentNav,
   loadEnrollments,
   clearProfile,
})(StudentNavbar);
