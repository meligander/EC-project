const router = require("express").Router();

const apiUserRouter = require("./api/user");
const apiAuthRouter = require("./api/auth");
const apiBackupRouter = require("./api/backup");
const apiAttendanceRouter = require("./api/attendance");
const apiCategoryRouter = require("./api/category");
const apiClassRouter = require("./api/class");
const apiEnrollmentRouter = require("./api/enrollment");
const apiExpenceRouter = require("./api/expence");
const apiExpenceTypeRouter = require("./api/expenceType");
const apiGradeRouter = require("./api/grade");
const apiGradeTypeRouter = require("./api/gradeType");
const apiInsallmentRouter = require("./api/installment");
const apiInvoiceRouter = require("./api/invoice");
const apiNeighbourhoodRouter = require("./api/neighbourhood");
const apiObservationRouter = require("./api/observation");
const apiRegisterRouter = require("./api/register");
const apiTownRouter = require("./api/town");
const apiGlobalRouter = require("./api/global");
const apiDailyRouter = require("./api/daily");

const apiPdfRouter = require("./api/pdf");

router.use("/user", apiUserRouter);
router.use("/auth", apiAuthRouter);
router.use("/backup", apiBackupRouter);
router.use("/attendance", apiAttendanceRouter);
router.use("/category", apiCategoryRouter);
router.use("/class", apiClassRouter);
router.use("/enrollment", apiEnrollmentRouter);
router.use("/expence", apiExpenceRouter);
router.use("/expence-type", apiExpenceTypeRouter);
router.use("/grade", apiGradeRouter);
router.use("/grade-type", apiGradeTypeRouter);
router.use("/installment", apiInsallmentRouter);
router.use("/invoice", apiInvoiceRouter);
router.use("/neighbourhood", apiNeighbourhoodRouter);
router.use("/observation", apiObservationRouter);
router.use("/register", apiRegisterRouter);
router.use("/town", apiTownRouter);
router.use("/global", apiGlobalRouter);
router.use("/daily", apiDailyRouter);

router.use("/pdf", apiPdfRouter);

module.exports = router;
