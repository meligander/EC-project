import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadTowns } from "../../../../../../actions/town";
import { loadNeighbourhoods } from "../../../../../../actions/neighbourhood";

import Tabs from "../../../sharedComp/Tabs";
import TownsTab from "./tabs/TownsTab";
import NeighbourhoodTab from "./tabs/NeighbourhoodTab";

const EditNeigTowns = ({
   towns: { loading: loadingTowns },
   neighbourhoods: { loading },
   loadNeighbourhoods,
   loadTowns,
}) => {
   useEffect(() => {
      if (loadingTowns) loadTowns();
      if (loading) loadNeighbourhoods();
   }, [loadNeighbourhoods, loadTowns, loadingTowns, loading]);

   return (
      <>
         <h2>Localidades y Barrios</h2>
         {!loading && !loadingTowns && (
            <Tabs
               tablist={["Localidades", "Barrios"]}
               panellist={[TownsTab, NeighbourhoodTab]}
            />
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   towns: state.towns,
   neighbourhoods: state.neighbourhoods,
});

export default connect(mapStateToProps, {
   loadNeighbourhoods,
   loadTowns,
})(EditNeigTowns);
