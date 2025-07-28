const express  = require('express'); 
const router = express.Router();
const { getCarById,getCarImage,searchCars, carAvailability } = require('../controllers/carController');

router.get("/",searchCars);
router.get("/image/:id",getCarImage);
router.get("/:id", getCarById);
router.post("/availability",carAvailability);

module.exports = router; 