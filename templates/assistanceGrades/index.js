module.exports = (data) => {
   return `
      <!doctype html>
      <html>
         <head>
            <meta charset="utf-8">
            <link href=${data.style.css} rel="stylesheet" />
            <link
                 href="https://fonts.googleapis.com/css2?family=Courgette&family=Dancing+Script:wght@700&display=swap"
              rel="stylesheet"
            />
            <title>Curso ${data.info.category}</title>
         </head>
         <body>
            <div class="header">
              <img class='header-img' src=${data.style.img} alt="logo">
            </div>
            <div class='container'>
              <h1 class='title'>${data.title}</h1>
              ${
                 data.info.teacher
                    ? `
               <div class="subtitle">
                  <h3 class="teacher">
                     Profesor: ${data.info.teacher}
                  </h3>
                  <h4 class='category'>${data.info.category}</h4>
               </div>`
                    : ""
              }
              <table class='${data.type}'>
                 <thead>
                  ${data.table.thead}
                 </thead>
                 <tbody>
                    ${data.table.tbody}
                 </tbody>
              </table>
            </div>
         </body>
      </html>
      `;
};
