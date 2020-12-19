import React from "react";

import gallery1 from "../../../../img/gallery-1.jpg";
import gallery2 from "../../..//../img/gallery-2.jpg";
import gallery3 from "../../../../img/gallery-3.JPG";
import gallery4 from "../../../../img/gallery-4.jpg";
import gallery5 from "../../../../img/gallery-5.png";
import gallery6 from "../../../../img/gallery-6.JPG";
import gallery7 from "../../../../img/gallery-7.jpg";
import gallery8 from "../../../../img/gallery-8.JPG";
import gallery9 from "../../../../img/gallery-9.jpg";
import gallery10 from "../../../../img/gallery-10.JPG";
import gallery11 from "../../../../img/gallery-11.JPG";
import gallery12 from "../../../../img/gallery-12.jpg";
import gallery13 from "../../../../img/gallery-13.JPG";
import gallery14 from "../../../../img/gallery-14.jpg";
import "./style.scss";

const Gallery = () => {
   return (
      <section className="gallery hide-sm">
         <figure className="gallery-item gallery-item--1">
            <img src={gallery1} alt="Gallery 1" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--2">
            <img src={gallery2} alt="Gallery 2" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--3">
            <img src={gallery3} alt="Gallery 3" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--4">
            <img src={gallery4} alt="Gallery 4" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--5">
            <img src={gallery5} alt="Gallery 5" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--6">
            <img src={gallery6} alt="Gallery 6" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--7">
            <img src={gallery7} alt="Gallery 7" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--8">
            <img src={gallery8} alt="Gallery 8" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--9">
            <img src={gallery9} alt="Gallery 9" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--10">
            <img src={gallery10} alt="Gallery 10" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--11">
            <img src={gallery11} alt="Gallery 11" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--12">
            <img src={gallery12} alt="Gallery 12" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--13">
            <img src={gallery13} alt="Gallery 13" className="gallery-img" />
         </figure>
         <figure className="gallery-item gallery-item--14">
            <img src={gallery14} alt="Gallery 14" className="gallery-img" />
         </figure>
      </section>
   );
};

export default Gallery;
