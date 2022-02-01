import React from "react";

const CertificateDate = ({ onChange, date }) => {
   return (
      <div className="popup-date">
         <h3>¿Para cuando desea fechar los certificados?</h3>
         <div className="form">
            <input
               className="form-input"
               id="date"
               type="date"
               name="date"
               value={date}
               onChange={onChange}
            />
         </div>
      </div>
   );
};

export default CertificateDate;
