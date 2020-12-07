import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";
import {
   loadExpenceTypes,
   loadExpences,
   deleteExpence,
   expencesPDF,
} from "../../../../actions/expence";
import { updatePageNumber } from "../../../../actions/mixvalues";
import Loading from "../../../modal/Loading";
import ListButtons from "./ListButtons";
import DateFilter from "./DateFilter";
import Confirm from "../../../modal/Confirm";

const ExpenceList = ({
   loadExpenceTypes,
   loadExpences,
   updatePageNumber,
   deleteExpence,
   expencesPDF,
   expences: { expences, loadingExpences, expencetypes, loadingET },
   mixvalues: { page },
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      expencetype: "",
   });

   const { startDate, endDate, expencetype } = filterData;

   const [otherValues, setOtherValues] = useState({
      expenceDelete: "",
      toggleModal: false,
   });

   const { expenceDelete, toggleModal } = otherValues;

   useEffect(() => {
      if (loadingExpences) {
         updatePageNumber(0);
         loadExpences({ startDate: "", endDate: "", expencetype: "" });
         loadExpenceTypes();
      }
   }, [loadingExpences, loadExpences, loadExpenceTypes, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = (expence_id) => {
      setOtherValues({
         expenceDelete: expence_id,
         toggleModal: !toggleModal,
      });
   };

   const search = (e) => {
      e.preventDefault();
      loadExpences(filterData);
   };

   const confirm = () => {
      deleteExpence(expenceDelete);
   };

   const pdfGeneratorSave = () => {
      expencesPDF(expences);
   };

   return (
      <>
         {!loadingExpences ? (
            <div>
               <h2>Listado Movimientos</h2>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el movimiento?"
                  confirm={confirm}
               />
               <form className="form">
                  <DateFilter
                     endDate={endDate}
                     startDate={startDate}
                     onChange={onChange}
                  />
                  <div className="form-group">
                     <select
                        className="form-input"
                        name="expencetype"
                        id="expencetype"
                        value={expencetype}
                        onChange={onChange}
                     >
                        <option value="">
                           * Seleccione el Tipo de Movimiento
                        </option>
                        {!loadingET &&
                           expencetypes.length > 0 &&
                           expencetypes.map((exp) => (
                              <option key={exp._id} value={exp._id}>
                                 {exp.name}
                              </option>
                           ))}
                     </select>
                     <label
                        htmlFor="expencetype"
                        className={`form-label ${
                           expencetype === "" ? "lbl" : ""
                        }`}
                     >
                        Tipo de Movimiento
                     </label>
                  </div>
                  <div className="btn-right mb-1">
                     <button onClick={search} className="btn btn-light">
                        <i className="fas fa-filter"></i> Buscar
                     </button>
                  </div>
               </form>
               <div className="wrapper">
                  <table className="my-2">
                     <thead>
                        <tr>
                           <th>Fecha</th>
                           <th>Tipo de Movimiento</th>
                           <th>Importe</th>
                           <th>Descripción</th>
                           <th>&nbsp;</th>
                        </tr>
                     </thead>
                     <tbody>
                        {!loadingExpences &&
                           expences.length > 0 &&
                           expences.map(
                              (expence, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <tr key={expence._id}>
                                       <td>
                                          <Moment
                                             date={expence.date}
                                             format="DD/MM/YY"
                                          />
                                       </td>
                                       <td>{expence.expencetype.name}</td>
                                       <td>${expence.value}</td>
                                       <td>{expence.description}</td>
                                       <td>
                                          <button
                                             onClick={() =>
                                                setToggle(expence._id)
                                             }
                                             className="btn btn-danger"
                                          >
                                             <i className="far fa-trash-alt"></i>
                                          </button>
                                       </td>
                                    </tr>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  page={page}
                  items={expences}
                  changePage={updatePageNumber}
                  pdfGeneratorSave={pdfGeneratorSave}
               />
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

ExpenceList.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   expences: PropTypes.object.isRequired,
   loadExpenceTypes: PropTypes.func.isRequired,
   loadExpences: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   deleteExpence: PropTypes.func.isRequired,
   expencesPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadExpenceTypes,
   loadExpences,
   updatePageNumber,
   deleteExpence,
   expencesPDF,
})(ExpenceList);
