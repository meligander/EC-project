import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadUsers } from "../../../../../actions/user";

import video from "../../../../../img/entrance.mp4";
import "./style.scss";

const Team = ({ users: { loadingUsers, users }, loadUsers }) => {
   const [teamNumber, setTeamNumber] = useState(0);

   useEffect(() => {
      if (loadingUsers) {
         loadUsers({ active: true, type: "team" });
      }
   }, [loadingUsers, loadUsers]);

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

   return (
      <>
         {!loadingUsers && (
            <section className="section-team">
               <div className="bg-video">
                  <video className="bg-video-content" autoPlay muted loop>
                     <source src={video} type="video/mp4" />
                     Your browser is not supported!
                  </video>
               </div>
               <h1 className="heading-secondary text-center text-primary mb-5">
                  Conoce nuestro equipo
               </h1>
               {users.length > 0 && (
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
                              <i className="fas fa-chevron-circle-left"></i>
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
                                 <i className="fas fa-chevron-circle-right"></i>
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
                           <figcaption className="person-caption">
                              {users[teamNumber].name +
                                 " " +
                                 users[teamNumber].lastname}
                           </figcaption>
                        </figure>
                        <div className="person-text">
                           <h3 className="heading-tertiary text-dark">
                              {users[teamNumber].type === "admin&teacher"
                                 ? "Directora y Profesora"
                                 : users[teamNumber].type === "teacher"
                                 ? "Profesor"
                                 : "Secretaria"}
                           </h3>
                           <p className="paragraph">
                              {users[teamNumber].description}
                           </p>
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
                              <i className="fas fa-chevron-circle-right"></i>
                           </h2>
                        </button>
                     </div>
                  </div>
               )}
            </section>
         )}
      </>
   );
};

Team.prototypes = {
   users: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadUsers })(Team);
