import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { BiFilterAlt } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";

import { formatNumber } from "../../../../../../actions/global";
import { loadRegister } from "../../../../../../actions/register";
import { togglePopup } from "../../../../../../actions/global";
import {
   loadDailies,
   registerDaily,
   deleteDaily,
   dailyPDF,
} from "../../../../../../actions/daily";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import Popup from "../../../../../modal/PopUp";

const DailyList = ({
   dailies: { dailies, loading },
   registers: { loadingRegister, register: lastRegister },
   loadDailies,
   loadRegister,
   registerDaily,
   deleteDaily,
   dailyPDF,
   togglePopup,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
   });

   const [adminValues, setAdminValues] = useState({
      page: 0,
      popupType: "",
      toDelete: "",
   });

   const [formData, setFormData] = useState({
      register: "",
      box: "",
      envelope: "",
      home: "",
      bank: "",
      change: "",
      difference: 0,
   });

   const { page, popupType, toDelete } = adminValues;

   const { startDate, endDate } = filterData;

   const { box, envelope, home, bank, change, difference } = formData;

   useEffect(() => {
      if (loading) loadDailies({}, true);
   }, [loading, loadDailies]);

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
      else if (lastRegister)
         setFormData((prev) => ({ ...prev, register: lastRegister._id }));
   }, [loadingRegister, loadRegister, lastRegister]);

   const onChangeFilter = (e) => {
      e.persist();
      setFilterData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const onChange = (e) => {
      e.persist();

      const value = getNumber(e.target.value);
      if (value !== null && value >= 0) {
         const difference = -(
            lastRegister.registermoney -
            getNumber(box) -
            getNumber(envelope) -
            getNumber(home) -
            getNumber(bank) -
            getNumber(change) +
            getNumber(formData[e.target.name]) -
            value
         );

         setFormData((prev) => ({
            ...prev,
            difference,
            [e.target.name]: e.target.value,
         }));
      }
   };

   const getNumber = (number) => {
      number = Number(number.replace(/,/g, "."));
      if (isNaN(number)) return null;
      else return number;
   };

   return (
      <>
         <h2>Cierre de Caja</h2>
         <Popup
            confirm={() => {
               if (popupType === "save") registerDaily(formData);
               else deleteDaily(toDelete);
            }}
            info={`¿Está seguro que desea ${
               popupType === "save"
                  ? "guardar los cambios"
                  : "eliminar el cierre de caja"
            }?`}
         />
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadDailies(filterData, true);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChangeFilter}
            />
            <div className="btn-right my-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>
         <div className="wrapper">
            <table className="my-2">
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>En Caja</th>
                     <th>Negra</th>
                     <th>Rosa</th>
                     <th>Casa</th>
                     <th>Cuenta</th>
                     <th>Cambio</th>
                     <th>Diferencia</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {lastRegister &&
                     !lastRegister.temporary &&
                     (!dailies[0] ||
                        (dailies[0] &&
                           dailies[0].register._id !== lastRegister._id)) && (
                        <tr>
                           <td>{format(new Date(), "dd/MM/yy")}</td>
                           <td>${formatNumber(lastRegister.registermoney)}</td>
                           <td>
                              <input
                                 type="text"
                                 name="box"
                                 value={box}
                                 onChange={onChange}
                                 placeholder="Negra"
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 name="envelope"
                                 value={envelope}
                                 onChange={onChange}
                                 placeholder="Rosa"
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 name="home"
                                 value={home}
                                 onChange={onChange}
                                 placeholder="Casa"
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 name="bank"
                                 value={bank}
                                 onChange={onChange}
                                 placeholder="Cuenta"
                              />
                           </td>
                           <td>
                              <input
                                 type="text"
                                 name="change"
                                 value={change}
                                 onChange={onChange}
                                 placeholder="Cambio"
                              />
                           </td>
                           <td>${formatNumber(difference)}</td>
                           <td>
                              <button
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       popupType: "save",
                                    }));
                                    togglePopup("default");
                                 }}
                                 className="btn btn-success"
                              >
                                 <FiSave />
                              </button>
                           </td>
                        </tr>
                     )}
                  {!loading &&
                     dailies.map(
                        (daily, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 &&
                           daily && (
                              <tr key={i}>
                                 <td>
                                    {format(new Date(daily.date), "dd/MM/yy")}
                                 </td>
                                 <td>
                                    $
                                    {formatNumber(daily.register.registermoney)}
                                 </td>
                                 <td>
                                    {daily.box && "$" + formatNumber(daily.box)}
                                 </td>
                                 <td>
                                    {daily.envelope &&
                                       "$" + formatNumber(daily.envelope)}
                                 </td>
                                 <td>
                                    {daily.home &&
                                       "$" + formatNumber(daily.home)}
                                 </td>
                                 <td>
                                    {daily.bank &&
                                       "$" + formatNumber(daily.bank)}
                                 </td>
                                 <td>
                                    {daily.change &&
                                       "$" + formatNumber(daily.change)}
                                 </td>
                                 <td>${formatNumber(daily.difference)}</td>
                                 <td>
                                    <button
                                       onClick={(e) => {
                                          e.preventDefault();
                                          setAdminValues((prev) => ({
                                             ...prev,
                                             popupType: "delete",
                                             toDelete: daily._id,
                                          }));
                                          togglePopup("default");
                                       }}
                                       className="btn btn-danger"
                                    >
                                       <FaTrashAlt />
                                    </button>
                                 </td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               items={dailies}
               type="cajas diarias"
               page={page}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => dailyPDF(dailies)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   auth: state.auth,
   registers: state.registers,
   dailies: state.dailies,
});

export default connect(mapStatetoProps, {
   loadDailies,
   loadRegister,
   registerDaily,
   deleteDaily,
   dailyPDF,
   togglePopup,
})(DailyList);
