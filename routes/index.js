const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get('/', controller.index);
router.get('/sign-up', controller.sign_up_get);
router.post('/sign-up', controller.sign_up_post);

router.get('/membership', controller.membership_get);
router.post('/membership', controller.membership_post);

router.get('/log-in', controller.log_in_get);
router.post('/log-in', controller.log_in_post);

router.get('/home', controller.home_get);
router.get('/log-out', controller.log_out);

router.get('/create-message', controller.create_message_get);
router.post('/create-message', controller.create_message_post);

router.post('/delete-message', controller.delete_message_post);

module.exports = router;