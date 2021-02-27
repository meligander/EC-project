import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getInvoiceNumber } from "../../../../../../actions/invoice";

import Tabs from "../../../sharedComp/Tabs";
import InstallmentsSearch from "../../../sharedComp/search/InstallmentsSearch";
import InvoiceTab from "./tabs/InvoiceTab";

const InvoiceGeneration = ({ getInvoiceNumber }) => {
   useEffect(() => {
      getInvoiceNumber();
   }, [getInvoiceNumber]);
   return (
      <>
         <h1>Facturación</h1>
         <Tabs
            tablist={["Cuotas", "Factura"]}
            panellist={[InstallmentsSearch, InvoiceTab]}
         />
      </>
   );
};

InvoiceGeneration.propTypes = {
   getInvoiceNumber: PropTypes.func.isRequired,
};

export default connect(null, { getInvoiceNumber })(InvoiceGeneration);
