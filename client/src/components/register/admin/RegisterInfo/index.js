import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadRegister } from "../../../../actions/register";
import { loadExpenceTypes } from "../../../../actions/expence";

import Loading from "../../../modal/Loading";
import Tabs from "../../../sharedComp/Tabs";
import RegisterTab from "./tabs/RegisterTab";
import IncomeExpenceTab from "./tabs/IncomeExpenceTab";

import "./style.scss";

const RegisterInfo = ({
   loadRegister,
   loadExpenceTypes,
   registers: { register, loading },
}) => {
   const [date, setDate] = useState(new Date());

   useEffect(() => {
      if (!loading) {
         if (register.temporary) setDate(register.date);
      } else {
         loadRegister();
         loadExpenceTypes();
      }
   }, [loadRegister, loadExpenceTypes, loading, register]);

   return (
      <>
         {!loading ? (
            <>
               <h1 className="text-center">Caja</h1>
               <h3 className="heading-tertiary my-4 text-dark">
                  <i className="fas fa-calendar-day"></i>{" "}
                  <Moment format="LLLL" locale="es" date={date} />
               </h3>
               <Tabs
                  tablist={["Caja Diaria", "Ingreso/Egreso"]}
                  panellist={[RegisterTab, IncomeExpenceTab]}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

RegisterInfo.propTypes = {
   registers: PropTypes.object.isRequired,
   loadRegister: PropTypes.func.isRequired,
   loadExpenceTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   registers: state.registers,
});

export default connect(mapStateToProps, { loadRegister, loadExpenceTypes })(
   RegisterInfo
);
