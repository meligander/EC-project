import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadRegister, allowNewRegister } from "../../../../actions/register";
import { loadExpenceTypes } from "../../../../actions/expence";

import Tabs from "../../sharedComp/Tabs";
import RegisterTab from "./tabs/RegisterTab";
import IncomeExpenceTab from "./tabs/IncomeExpenceTab";

import "./style.scss";

const RegisterInfo = ({
   loadRegister,
   loadExpenceTypes,
   allowNewRegister,
   registers: { register, loading },
}) => {
   const [date, setDate] = useState(new Date());

   useEffect(() => {
      if (!loading) {
         if (register && register.temporary) setDate(register.date);
         if (
            !register ||
            (register && !register.temporary && register.registermoney === 0)
         ) {
            allowNewRegister();
         }
      } else {
         loadRegister();
         loadExpenceTypes();
      }
   }, [loadRegister, loadExpenceTypes, loading, register, allowNewRegister]);

   return (
      <>
         <h1 className="text-center">Caja</h1>
         <h3 className="heading-tertiary my-4 text-dark">
            <i className="fas fa-calendar-day"></i> &nbsp;
            <Moment format="LLLL" locale="es" date={date} />
         </h3>
         <Tabs
            tablist={["Caja Diaria", "Ingreso/Egreso"]}
            panellist={[RegisterTab, IncomeExpenceTab]}
         />
      </>
   );
};

RegisterInfo.propTypes = {
   registers: PropTypes.object.isRequired,
   loadRegister: PropTypes.func.isRequired,
   loadExpenceTypes: PropTypes.func.isRequired,
   allowNewRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   registers: state.registers,
});

export default connect(mapStateToProps, {
   loadRegister,
   loadExpenceTypes,
   allowNewRegister,
})(RegisterInfo);
