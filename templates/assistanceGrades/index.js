module.exports = (
   css,
   img,
   title,
   thead,
   tbody,
   classInfo,
   attendance,
   allGrades
) => {
   return `
      <!doctype html>
      <html>
         <head> 
            <meta charset="utf-8">
            <link href=${css} rel="stylesheet" />
            <link
                 href="https://fonts.googleapis.com/css2?family=Courgette&family=Dancing+Script:wght@700&display=swap"
              rel="stylesheet"
            />
            <title>Curso de ${
               classInfo.teacher.lastname + " " + classInfo.teacher.name
            }</title>          
         </head>
         <body>
            <div class="header">
              <img class='header-img' src=${img} alt="logo">
            </div> 
            <div class='container'>
              <h1 class='title'>${title}</h1>   
              <div class="subtitle">
                <h3 class="teacher">
                    Profesor: ${
                       classInfo.teacher.lastname + " " + classInfo.teacher.name
                    }                
                </h3>                 
                <h4 class='category'>${classInfo.category.name}</h4>
              </div>
              <table ${
                 attendance
                    ? "class='attendance'"
                    : allGrades
                    ? "class='all-grades'"
                    : ""
              } >
                 <thead>
                  ${thead}
                 </thead>
                 <tbody>
                    ${tbody}
                 </tbody>
              </table>
            </div>
         </body>
      </html>
      `;
};
