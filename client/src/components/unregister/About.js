import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadTeam } from "../../actions/user";
import cambridge from "../../img/cambridge.png";
import canada1 from "../../img/canada.jpg";
import canada2 from "../../img/canada2.jpg";
import canada3 from "../../img/canada3.jpg";
import video from "../../img/entrance.mp4";
import gallery1 from "../../img/gallery-1.jpg";
import gallery2 from "../../img/gallery-2.jpg";
import gallery3 from "../../img/gallery-3.JPG";
import gallery4 from "../../img/gallery-4.jpg";
import gallery5 from "../../img/gallery-5.png";
import gallery6 from "../../img/gallery-6.JPG";
import gallery7 from "../../img/gallery-7.jpg";
import gallery8 from "../../img/gallery-8.JPG";
import gallery9 from "../../img/gallery-9.jpg";
import gallery10 from "../../img/gallery-10.JPG";
import gallery11 from "../../img/gallery-11.JPG";
import gallery12 from "../../img/gallery-12.jpg";
import gallery13 from "../../img/gallery-13.JPG";
import gallery14 from "../../img/gallery-14.jpg";

const About = ({ users: { loadingUsers, users }, loadTeam }) => {
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
      <Fragment>
         <header className="header">
            <div className="header-textbox">
               <h2 className="heading-secondary text-white mb-4">
                  Instituto de Ingles en la Villa de Merlo
               </h2>
               <p className="heading-tertiary text-light mb-5">
                  Clases de ingles para todas las edades. bla bla bla
               </p>
            </div>
         </header>

         <section className="section-history">
            <div className="row">
               <div className="history-container">
                  <div className="history-text">
                     <h2 className="heading-secondary text-primary">
                        Un poco de{" "}
                        <span className="indentation">historia...</span>
                     </h2>
                     <p className="paragraph py-3">
                        Nuestro instituto comenzo... bla bla bla Lorem, ipsum
                        dolor sit amet consectetur adipisicing elit. Voluptatem
                        totam cupiditate consequatur velit ut optio corporis
                        beatae, illum tempora necessitatibus et eligendi ad
                        exercitationem magnam eaque ullam ea corrupti porro unde
                        excepturi non voluptas. Dolor illum nostrum suscipit
                        repudiandae itaque?
                     </p>
                  </div>
               </div>
            </div>
         </section>

         <section className="section-cambridge" id="cambridge">
            <div className="row">
               <img
                  className="cmb-img"
                  src={cambridge}
                  alt="Cambrige University"
               />

               <div className="cmb-text">
                  <h2 className="heading-secondary text-light">
                     Examenes Internacionales
                  </h2>
                  <br />
                  <p className="paragraph text-secondary">
                     Cada año los estudiantes tienen la posibilidad de rendir
                     examenes internacionales, los cuales les ayudaran en futuro
                     para ampliar su curriculum... bla bla bla Lorem, ipsum
                     dolor sit amet consectetur adipisicing elit. Voluptatem
                     totam cupiditate consequatur velit ut optio corporis
                     beatae, illum tempora necessitatibus et eligendi ad
                     exercitationem magnam eaque ullam ea corrupti porro unde
                     excepturi non voluptas. Dolor illum nostrum suscipit
                     repudiandae itaque?
                  </p>
               </div>
            </div>
         </section>

         <section className="section-canada">
            <h2 className="heading-secondary text-primary text-center">
               Viajes a Canada
            </h2>
            <div className="row">
               <div className="text-left section-canada-text">
                  <p className="paragraph">
                     Cada año los estudiantes tienen la posibilidad de viajar a
                     Canadá durante el mes de Julio... bla bla bla Lorem, ipsum
                     dolor sit amet consectetur adipisicing elit. Voluptatem
                     totam cupiditate consequatur velit ut optio corporis
                     beatae, illum tempora necessitatibus et eligendi ad
                     exercitationem magnam eaque ullam ea corrupti porro unde
                     excepturi non voluptas. Dolor illum nostrum suscipit
                     repudiandae itaque?
                  </p>
               </div>
               <div className="composition">
                  <img
                     alt="Foto Canada 1"
                     className="composition-photo composition-photo--p1"
                     src={canada1}
                  />
                  <img
                     alt="Foto Canada 2"
                     className="composition-photo composition-photo--p2"
                     src={canada2}
                  />
                  <img
                     alt="Foto Canada 3"
                     className="composition-photo composition-photo--p3"
                     src={canada3}
                  />
               </div>
            </div>
         </section>

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
               {!loadingUsers && (
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
               )}
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
         <section className="gallery hide-sm">
            <figure className="gallery-item gallery-item--1">
               <img src={gallery1} alt="Gallery 1" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--2">
               <img src={gallery2} alt="Gallery 2" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--3">
               <img src={gallery3} alt="Gallery 3" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--4">
               <img src={gallery4} alt="Gallery 4" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--5">
               <img src={gallery5} alt="Gallery 5" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--6">
               <img src={gallery6} alt="Gallery 6" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--7">
               <img src={gallery7} alt="Gallery 7" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--8">
               <img src={gallery8} alt="Gallery 8" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--9">
               <img src={gallery9} alt="Gallery 9" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--10">
               <img src={gallery10} alt="Gallery 10" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--11">
               <img src={gallery11} alt="Gallery 11" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--12">
               <img src={gallery12} alt="Gallery 12" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--13">
               <img src={gallery13} alt="Gallery 13" className="gallery-img" />
            </figure>
            <figure className="gallery-item gallery-item--14">
               <img src={gallery14} alt="Gallery 14" className="gallery-img" />
            </figure>
         </section>
      </Fragment>
   );
};

About.prototypes = {
   users: PropTypes.object.isRequired,
   loadTeam: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadTeam })(About);
