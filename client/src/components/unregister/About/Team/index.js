import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadTeam } from "../../../../actions/user";

import video from "../../../../img/entrance.mp4";
import "./style.scss";

const Team = ({ users: { loadingUsers, users }, loadTeam }) => {
   const [teamNumber, setTeamNumber] = useState(0);

   useEffect(() => {
      if (loadingUsers) {
         loadTeam();
      }
   }, [loadingUsers, loadTeam]);

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

               <div className="row">
                  <div className="btns">
                     <button
                        className={`btn-icon ${
                           teamNumber === 0 ? "text-dark" : "text-primary"
                        }`}
                        onClick={moveDown}
                     >
                        <h2>
                           <i className="fas fa-chevron-circle-left"></i>
                        </h2>
                     </button>
                     <div className="show-md">
                        <button
                           className={`btn-icon ${
                              teamNumber === users.length - 1
                                 ? "text-dark"
                                 : "text-primary"
                           }`}
                           onClick={moveUp}
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
                           src={users[teamNumber].img}
                           alt={
                              users[teamNumber].type +
                              " de Villa de Merlo English Center"
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
                           {users[teamNumber].type === "Admin/Profesor"
                              ? "Directora y Profesora"
                              : users[teamNumber].type}
                        </h3>
                        <p className="paragraph">
                           {users[teamNumber].description}
                        </p>
                     </div>
                  </div>
                  <div className="hide-md">
                     <button
                        className={`btn-icon ${
                           teamNumber === users.length - 1
                              ? "text-dark"
                              : "text-primary"
                        }`}
                        onClick={moveUp}
                     >
                        <h2>
                           <i className="fas fa-chevron-circle-right"></i>
                        </h2>
                     </button>
                  </div>
               </div>
            </section>
         )}
      </>
   );
};

Team.prototypes = {
   users: PropTypes.object.isRequired,
   loadTeam: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadTeam })(Team);
