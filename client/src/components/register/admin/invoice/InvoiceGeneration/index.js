import React from "react";

import Tabs from "../../../../sharedComp/Tabs";
import InstallmentsSearch from "../../../../sharedComp/search/InstallmentsSearch";
import InvoiceTab from "./tabs/InvoiceTab";

const InvoiceGeneration = () => {
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

export default InvoiceGeneration;
