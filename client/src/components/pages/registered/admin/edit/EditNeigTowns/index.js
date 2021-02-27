import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadTowns } from "../../../../../../actions/town";
import { loadNeighbourhoods } from "../../../../../../actions/neighbourhood";

import Tabs from "../../../sharedComp/Tabs";
import Loading from "../../../../../modal/Loading";
import TownsTab from "./tabs/TownsTab";
import NeighbourhoodTab from "./tabs/NeighbourhoodTab";

const EditNeigTowns = ({
   towns,
   neighbourhoods,
   loadNeighbourhoods,
   loadTowns,
}) => {
   useEffect(() => {
      if (towns.loading) {
         loadTowns();
      }
      if (neighbourhoods.loading) {
         loadNeighbourhoods();
      }
   }, [loadNeighbourhoods, loadTowns, towns.loading, neighbourhoods.loading]);

   return (
      <>
         {!towns.loading ? (
            <Fragment>
               <h2>Localidades y Barrios</h2>

               <Tabs
                  tablist={["Localidades", "Barrios"]}
                  panellist={[TownsTab, NeighbourhoodTab]}
               />
            </Fragment>
         ) : (
            <Loading />
         )}
      </>
   );
};

EditNeigTowns.propTypes = {
   towns: PropTypes.object.isRequired,
   neighbourhoods: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadTowns: PropTypes.func.isRequired,
   loadNeighbourhoods: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   towns: state.towns,
   neighbourhoods: state.neighbourhoods,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   loadNeighbourhoods,
   loadTowns,
})(EditNeigTowns);
