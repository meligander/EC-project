const pdf = require("html-pdf");
const path = require("path");

const generatePDFold = (
   fileName,
   template,
   cssFile,
   data,
   orientation,
   footer,
   res
) => {
   const img = path.join("file://", __dirname, "../templates/assets/logo.png");
   const css = path.join(
      "file://",
      __dirname,
      `../templates/${cssFile}/style.css`
   );

   const options = {
      format: "A4",
      ...(cssFile !== "certificate" &&
         cssFile !== "cambridgeCertificate" && {
            orientation,
            header: {
               height: "15mm",
               contents: `<div></div>`,
            },
            ...(footer !== null && {
               footer: {
                  height: "17mm",
                  contents: `<footer class="footer">Villa de Merlo English Center - ${footer}<span class="pages">{{page}}/{{pages}}</span></footer>`,
               },
            }),
         }),
   };

   pdf.create(template({ ...data, style: { img, css } }), options).toFile(
      fileName,
      (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      }
   );
};

module.exports = generatePDFold;
