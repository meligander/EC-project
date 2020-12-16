import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadRelatives } from "../../../actions/user";
import PropTypes from "prop-types";

const DashboardRelative = ({
   loadRelatives,
   users: { user, relatives, relativesLoading },
   tutor,
}) => {
   useEffect(() => {
      loadRelatives(user._id, tutor);
   }, [loadRelatives, user._id, tutor]);

   return (
      <>
         {!relativesLoading && (
            <div className=" p-3 bg-light-grey">
               <h3 className="heading-tertiary text-primary text-center">
                  {tutor ? "Tutores" : "Alumnos a Cargo"}
               </h3>
               {relatives.length !== 0 ? (
                  <div className="relatives">
                     {relatives.map((relative, index) => (
                        <div key={index} className="relative">
                           <p>
                              {relative.lastname}, {relative.name}
                           </p>
                           <Link
                              className="btn-text"
                              to={`/dashboard/${relative._id}`}
                           >
                              Ver Info
                           </Link>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="heading-tertiary text-center py-2">
                     No hay {tutor ? "tutores" : "alumnos"} resgistrados
                  </p>
               )}
            </div>
         )}
      </>
   );
};

DashboardRelative.propTypes = {
   loadRelatives: PropTypes.func.isRequired,
   users: PropTypes.object.isRequired,
   tutor: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadRelatives })(DashboardRelative);
