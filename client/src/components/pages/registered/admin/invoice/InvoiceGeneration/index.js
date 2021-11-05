import React, { useEffect } from "react";
import { connect } from "react-redux";

import { getInvoiceNumber } from "../../../../../../actions/invoice";

import Tabs from "../../../sharedComp/Tabs";
import InstallmentsSearch from "../../../sharedComp/search/InstallmentsSearch";
import InvoiceTab from "./tabs/InvoiceTab";

const InvoiceGeneration = ({
   getInvoiceNumber,
   invoices: {
      otherValues: { invoiceNumber },
   },
}) => {
   useEffect(() => {
      if (invoiceNumber === "") getInvoiceNumber();
   }, [getInvoiceNumber, invoiceNumber]);
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

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(mapStateToProps, { getInvoiceNumber })(
   InvoiceGeneration
);
