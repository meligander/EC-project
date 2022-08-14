const pdf = require("html-pdf");
const path = require("path");

const generatePDF = (
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
      phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
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

   try {
      pdf.create(template({ ...data, style: { img, css } }), options).toFile(
         fileName,
         (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         }
      );
   } catch (err) {
      console.error(err.message);
   }
};

module.exports = generatePDF;
