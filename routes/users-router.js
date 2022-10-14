
const { getUsers ,
        getUser} = require("../controllers/usersController");

const router = require('express').Router();

router.get('/', getUsers);
router.get('/:username', getUser);

module.exports = router;











