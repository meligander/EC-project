import React, { useEffect } from "react";
import { connect } from "react-redux";

import { getInvoiceNumber } from "../../../../../../actions/invoice";

import Tabs from "../../../sharedComp/Tabs";
import InstallmentsSearchTab from "./tabs/InstallmentsSearchTab";
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
         {invoiceNumber !== "" && (
            <Tabs
               tablist={["Cuotas", "Factura"]}
               panellist={[InstallmentsSearchTab, InvoiceTab]}
            />
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(mapStateToProps, { getInvoiceNumber })(
   InvoiceGeneration
);
