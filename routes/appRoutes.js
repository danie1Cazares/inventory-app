const express = require('express');

const router = express.Router();

const {
    
    getNewItem,
    addNewItem,
    deleteItem,
    searchItem,
    updateItemDetails,
    showInventory,
    showDetails

} = require('../controllers/controller.js')

router.get('/', (req,res) => {
    res.render('index', {title: 'index'});
    // res.redirect('/barbells');
}); 
//temp route

router.get('/new', getNewItem);
router.post('/new', addNewItem);

router.post('/delete', deleteItem);

router.get('/search', searchItem);

router.get('/:table', showInventory) 
router.get('/:table/:id', showDetails)
router.post('/:table/:id', showDetails)
router.post('/:table/:id/update', updateItemDetails);


module.exports = router;

