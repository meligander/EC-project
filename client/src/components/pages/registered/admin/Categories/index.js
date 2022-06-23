import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";
import { addMonths, format } from "date-fns";

import {
   loadCategories,
   updateCategories,
   categoriesPDF,
} from "../../../../../actions/category";
import { togglePopup } from "../../../../../actions/global";

import PopUp from "../../../../modal/PopUp";

import "./style.scss";

const Categories = ({
   categories: { categories, loading },
   togglePopup,
   loadCategories,
   updateCategories,
   categoriesPDF,
}) => {
   const min = format(new Date(), "yyyy-MM");
   const max = format(addMonths(new Date(), 4), "yyyy-MM");

   const [formData, setFormData] = useState([]);
   const [adminValues, setAdminValues] = useState({
      date: "",
   });

   const { date } = adminValues;

   useEffect(() => {
      if (loading) loadCategories(true);
      else setFormData(categories);
   }, [loadCategories, loading, categories]);

   const onChange = (e, index) => {
      e.persist();
      let newValue = [...formData];
      newValue[index] = {
         ...newValue[index],
         value: e.target.value,
      };
      setFormData(newValue);
   };

   const onChangeMonth = (e) => {
      e.persist();
      setAdminValues({
         ...adminValues,
         date: e.target.value,
      });
   };

   return (
      <>
         <h2>Categorías y Precios</h2>
         <PopUp
            info="¿Está seguro que los datos son correctos?"
            confirm={() => updateCategories({ categories: formData, date })}
         />
         <div className="form ">
            <div className="form-group">
               <input
                  className="form-input"
                  id="date"
                  type="month"
                  value={date}
                  name="date"
                  onChange={onChangeMonth}
                  min={min}
                  max={max}
               />
               <label htmlFor="date" className="form-label show">
                  Seleccione el mes desde el cual correrá el aumento de precio.
               </label>
            </div>
         </div>

         {!loading && (
            <table className="smaller category">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>Valor</th>
                  </tr>
               </thead>
               <tbody>
                  {formData.length > 0 &&
                     formData.map((category, index) => (
                        <tr key={index}>
                           <td>{category.name}</td>
                           <td>
                              <input
                                 type="text"
                                 name={`value${index}`}
                                 value={category.value}
                                 placeholder="Valor"
                                 onChange={(e) => onChange(e, index)}
                              />
                           </td>
                        </tr>
                     ))}
               </tbody>
            </table>
         )}

         <div className="btn-right p-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  togglePopup("default");
               }}
               className="btn btn-primary"
            >
               <FiSave />
               <span className="hide-sm">&nbsp; Actualizar</span>
            </button>
            <div className="tooltip">
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => {
                     e.preventDefault();
                     categoriesPDF(categories);
                  }}
               >
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF con categorías y precios</span>
            </div>
         </div>
      </>
   );
};

const mapStatetoProps = (state) => ({
   categories: state.categories,
});

export default connect(mapStatetoProps, {
   loadCategories,
   updateCategories,
   togglePopup,
   categoriesPDF,
})(Categories);
