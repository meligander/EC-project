const router = require("express").Router();

const apiUserRouter = require("./pdf/user");
const apiAttendanceRouter = require("./pdf/attendance");
const apiCategoryRouter = require("./pdf/category");
const apiClassRouter = require("./pdf/class");
const apiEnrollmentRouter = require("./pdf/enrollment");
const apiExpenceRouter = require("./pdf/expence");
const apiGradeRouter = require("./pdf/grade");
const apiInsallmentRouter = require("./pdf/installment");
const apiInvoiceRouter = require("./pdf/invoice");
const apiObservationRouter = require("./pdf/observation");
const apiRegisterRouter = require("./pdf/register");
const apiDailyRouter = require("./pdf/daily");

router.use("/user", apiUserRouter);
router.use("/attendance", apiAttendanceRouter);
router.use("/category", apiCategoryRouter);
router.use("/class", apiClassRouter);
router.use("/daily", apiDailyRouter);
router.use("/enrollment", apiEnrollmentRouter);
router.use("/expence", apiExpenceRouter);
router.use("/grade", apiGradeRouter);
router.use("/installment", apiInsallmentRouter);
router.use("/invoice", apiInvoiceRouter);
router.use("/observation", apiObservationRouter);
router.use("/register", apiRegisterRouter);

module.exports = router;
