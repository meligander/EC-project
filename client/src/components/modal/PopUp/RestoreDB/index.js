import React, { useState } from "react";
import { FaCloudUploadAlt, FaCloudDownloadAlt, FaTimes } from "react-icons/fa";

import "./style.scss";

const RestoreDB = ({ onChange, setAlert, createBackup }) => {
   const [adminValues, setAdminValues] = useState({
      fileIn: false,
      selectedFile: "",
   });

   const { fileIn, selectedFile } = adminValues;

   const fileSelected = (e) => {
      e.persist();
      if (e.target.value) {
         const file = e.target.files[0];
         handleFiles(file);
         e.target.value = "";
      }
   };

   const handleFiles = (file) => {
      if (validateFile(file)) {
         setAdminValues((prev) => ({
            ...prev,
            fileIn: true,
            selectedFile: file,
         }));
         let data = new FormData();
         data.append("file", file);
         onChange(data);
      } else {
         setAdminValues((prev) => ({
            ...prev,
            fileIn: false,
            selectedFile: "",
         }));
         onChange("");
         setAlert("Tipo de archivo no admitido", "danger", "4");
      }
   };

   const validateFile = (file) => {
      const validTypes = ["application/x-gzip"];
      return validTypes.indexOf(file.type) !== -1;
   };

   return (
      <div className="restore">
         <h3 className="heading-tertiary text-left m-0">
            Restaurar Base de Datos
         </h3>
         <h5 className="paragraph text-dark">
            Seleccione el backup que desea restaurar o descargue el actual
         </h5>
         <div className="form">
            <p className="text-lighter-primary restore-file">
               {selectedFile !== "" && (
                  <>
                     {selectedFile.name}
                     <button
                        type="button"
                        onClick={() =>
                           setAdminValues((prev) => ({
                              ...prev,
                              selectedFile: "",
                              fileIn: false,
                           }))
                        }
                        className="btn-cancel"
                     >
                        <FaTimes />
                     </button>
                  </>
               )}
            </p>
            <div className="upl-img">
               <div className={`fileUpload ${fileIn ? "success" : ""}`}>
                  <input
                     id="fileInput"
                     type="file"
                     name="image"
                     onChange={fileSelected}
                     className="upload"
                  />
                  <span>
                     <FaCloudUploadAlt />
                     &nbsp;Subir
                  </span>
               </div>
               <button
                  type="button"
                  onClick={() => createBackup(true)}
                  className="btn btn-secondary restore-btn"
               >
                  <FaCloudDownloadAlt />
                  &nbsp;Descargar
               </button>
            </div>
         </div>
      </div>
   );
};

export default RestoreDB;
