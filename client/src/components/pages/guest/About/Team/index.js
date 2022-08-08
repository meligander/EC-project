import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
   HiOutlineChevronDoubleLeft,
   HiOutlineChevronDoubleRight,
} from "react-icons/hi";

import { loadUsers } from "../../../../../actions/user";

//import video from "../../../../../img/entrance.mp4";
import "./style.scss";

const Team = ({ users: { loading, users }, loadUsers }) => {
   const [teamNumber, setTeamNumber] = useState(0);

   useEffect(() => {
      if (loading) loadUsers({ active: true, type: "team" }, false, true);
   }, [loading, loadUsers]);

   const moveUp = () => {
      if (teamNumber < users.length - 1) {
         setTeamNumber(teamNumber + 1);
      }
   };

   const moveDown = () => {
      if (teamNumber > 0) {
         setTeamNumber(teamNumber - 1);
      }
   };

   const name = (type, sex) => {
      switch (type) {
         case "admin&teacher":
            return `Director${sex === "Femenino" ? "a" : ""} y Profesor${
               sex === "Femenino" ? "a" : ""
            }`;
         case "teacher":
            return `Profesor${sex === "Femenino" ? "a" : ""}`;
         case "secretary":
            return `Secretari${sex === "Femenino" ? "a" : "o"}`;
         case "classManager":
            return `Coordinador${sex === "Femenino" ? "a" : ""} Pedagógic${
               sex === "Femenino" ? "a" : "o"
            }`;

         default:
            return "";
      }
   };

   return (
      <section className="section-team">
         {/* <div className="bg-video">
            <video className="bg-video-content" autoPlay muted loop>
               <source src={video} type="video/mp4" />
               Your browser is not supported!
            </video>
         </div> */}
         <h1 className="heading-secondary text-center text-primary mb-5">
            Conoce nuestro equipo
         </h1>
         {!loading && users.length > 0 && (
            <div className="row">
               <div className="btns">
                  <button
                     type="button"
                     className={`btn-icon ${
                        teamNumber === 0 ? "text-dark" : "text-primary"
                     }`}
                     onClick={(e) => {
                        e.preventDefault();
                        moveDown();
                     }}
                  >
                     <h2>
                        <HiOutlineChevronDoubleLeft />
                     </h2>
                  </button>
                  <div className="show-md">
                     <button
                        type="button"
                        className={`btn-icon ${
                           teamNumber === users.length - 1
                              ? "text-dark"
                              : "text-primary"
                        }`}
                        onClick={(e) => {
                           e.preventDefault();
                           moveUp();
                        }}
                     >
                        <h2>
                           <HiOutlineChevronDoubleRight />
                        </h2>
                     </button>
                  </div>
               </div>
               <div className="person">
                  <figure className="person-shape">
                     <img
                        src={
                           users[teamNumber].img.url === ""
                              ? "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                              : users[teamNumber].img.url
                        }
                        alt={
                           users[teamNumber].type +
                           " of Villa de Merlo English Centre"
                        }
                        className="person-img"
                     />
                  </figure>
                  <div className="person-text">
                     <h2 className="heading-secondary text-dark">
                        {users[teamNumber].name +
                           " " +
                           users[teamNumber].lastname}
                     </h2>
                     <h3 className="heading-tertiary">
                        {name(users[teamNumber].type, users[teamNumber].sex)}
                     </h3>
                  </div>
               </div>
               <div className="hide-md">
                  <button
                     type="button"
                     className={`btn-icon ${
                        teamNumber === users.length - 1
                           ? "text-dark"
                           : "text-primary"
                     }`}
                     onClick={(e) => {
                        e.preventDefault();
                        moveUp();
                     }}
                  >
                     <h2>
                        <HiOutlineChevronDoubleRight />
                     </h2>
                  </button>
               </div>
            </div>
         )}
      </section>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadUsers })(Team);
