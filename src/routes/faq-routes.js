const express = require("express");
const router = express.Router();
const faqsController = require("../controllers/faq-controller");

router.get("/faq", faqsController.getAllFaqs);
router.get("/faq/:id", faqsController.getFaqById);

router.post("/faq", faqsController.createFaq);
router.put("/faq/:id", faqsController.updateFaq);

router.delete("/faq/:id", faqsController.deleteFaq);

module.exports = router;
