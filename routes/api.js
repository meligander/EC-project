const router = require("express").Router();

const apiUserRouter = require("./api/user");
const apiAuthRouter = require("./api/auth");
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
const apiPostRouter = require("./api/post");
const apiRegisterRouter = require("./api/register");
const apiTownRouter = require("./api/town");
const apiPenaltyRouter = require("./api/penalty");

router.use("/user", apiUserRouter);
router.use("/auth", apiAuthRouter);
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
router.use("/post", apiPostRouter);
router.use("/register", apiRegisterRouter);
router.use("/town", apiTownRouter);
router.use("/penalty", apiPenaltyRouter);

module.exports = router;
