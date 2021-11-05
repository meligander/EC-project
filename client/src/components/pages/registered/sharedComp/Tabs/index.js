import React, { useEffect, useState, useMemo } from "react";

import "./style.scss";

const Tabs = ({ tablist, panellist }) => {
   const [adminValues, setAdminValues] = useState({
      isActive: 0,
      width: 0,
      position: 0,
      refs: useMemo(
         () =>
            Array(tablist.length)
               .fill(0)
               .map((i) => React.createRef()),
         [tablist.length]
      ),
   });

   const { isActive, width, position, refs } = adminValues;

   useEffect(() => {
      setTimeout(() => {
         setAdminValues((prev) => ({
            ...prev,
            width: refs[0].current.offsetWidth,
            position: refs[0].current.offsetLeft,
         }));
      }, 50);
   }, [refs]);

   const changeActive = (nb) => {
      setAdminValues((prev) => ({
         ...prev,
         isActive: nb,
         width: refs[nb].current.offsetWidth,
         position: refs[nb].current.offsetLeft,
      }));
   };

   return (
      <section className="section-tab mt-3">
         <div className="tab-header">
            {tablist.map((tab, index) => (
               <button
                  type="button"
                  className="tab-header-btn"
                  key={index}
                  onClick={() => changeActive(index)}
                  ref={refs[index]}
               >
                  {tablist.length > 3 ? (
                     <>
                        {tab.substring(0, 3)}
                        <span className="hide-sm">{tab.substring(3)}</span>
                     </>
                  ) : (
                     tab
                  )}
               </button>
            ))}
         </div>
         <div className="tab-header-line">
            <div style={{ width, left: position }} className="line"></div>
         </div>
         <div className="mt-1">
            {panellist.map((Panel, index) => (
               <div
                  key={index}
                  className={`tab-content-panel ${
                     isActive === index ? "active" : ""
                  }`}
               >
                  <Panel typeF={tablist[index]} period={index + 1} />
               </div>
            ))}
         </div>
      </section>
   );
};

export default Tabs;
