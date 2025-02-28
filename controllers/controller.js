
const db = require("../db/queries");


async function showDetails (req,res) {

    const id = req.params.id;
    const table = req.params.table;

    const editMode =  req.query.editMode;
    const title = editMode === 'true' ? 'Edit' : 'Details';

    console.log('Edit Mode:', editMode);  // Debugging log


    if ( ['barbells','plates','racks','apparel'].includes(table)){

        const itemDetails = await db.getItemDetails(table, id);
        res.render('showDetails', {title, itemDetails, table, editMode});

    } else {
        
        res.status(404).render('404', { title: '404 ERROR', errorMessage: 'Sorry, that table name and/or ID does not exist.' });

    }

}


async function showInventory (req, res){

    const table = req.params.table;
    const sortBy = req.query.sortBy; 

    const inventory = await db.getInventory(table);
    
    if (table === 'barbells'){
        const [sortedInventory, filters] = await barbellSorted( inventory, req );
        const {filterByBarUse, filterByRatingValue, filterByBrands,filterByCategory } = filters;
        res.render('showInventory', {title: 'Inventory App', table, sortedInventory, sortBy, filterByBarUse, filterByRatingValue, filterByBrands,filterByCategory });
    } else if (table === 'plates'){
        const [sortedInventory, filters] = await plateSorted( inventory, req );
        const { filterByRatingValue, filterByBrands, filterByCategory, filterByPlateType, filterByUOM }  = filters;
        res.render('showInventory', {title: 'Inventory App', table, sortedInventory, sortBy, filterByRatingValue, filterByBrands, filterByCategory, filterByPlateType, filterByUOM });
    } else if (table === 'racks'){
        const [sortedInventory, filters] = await rackSorted( inventory, req );
        const { filterByRatingValue, filterByBrands, filterByCategory }  = filters; 
        res.render('showInventory', {title: 'Inventory App', table, sortedInventory, sortBy, filterByRatingValue, filterByBrands, filterByCategory});
    } else if (table === 'apparel'){
        const [sortedInventory, filters] = await apparelSorted( inventory, req );
        const { filterByRatingValue, filterByBrands, filterByCategory, filterByShirtSize }  = filters;
        res.render('showInventory', {title: 'Inventory App', table, sortedInventory, sortBy, filterByRatingValue, filterByBrands, filterByCategory, filterByShirtSize});
    } else {
        res.status(404).render('404', { title: '404 ERROR', errorMessage: 'Sorry, that table name does not exist.' });
    }


    // console.log(inventory);
    // res.send(inventory);

}


async function barbellSorted (inventory, req){

    const barbellInventory = inventory;
       let sortedInventory = [];

    const sortBy = req.query.sortBy; 
    const filterByRatingValue = req.query.rating;
    const filterByCategory = req.query.category || 'all';
    const filterByBarUse = [ req.query.multipurpose, req.query.technique ].filter(barUse => barUse);
    const filterByBrands = [req.query.rogue, req.query.ghost, req.query.oso, req.query.kabuki, req.query.york].filter(brand => brand).map(num => parseInt(num));
    
    filterByCategory === 'all' ? sortedInventory = barbellInventory :
    sortedInventory = barbellInventory.filter((i) => (i.category === filterByCategory));

    filterByBarUse.length > 0 ? sortedInventory = sortedInventory.filter(i => filterByBarUse.includes((i.bar_use).toLowerCase())) : sortedInventory = sortedInventory;
    
    filterByRatingValue ? sortedInventory = sortedInventory.filter((i) =>(i.rating >= filterByRatingValue)) : sortedInventory = sortedInventory;

    filterByBrands.length > 0  ? sortedInventory = sortedInventory.filter(i => filterByBrands.includes(i.brand_id)) : sortedInventory = sortedInventory;

    if (sortBy === 'alpha'){sortedInventory = sortedInventory.sort((a, b) => a.name.localeCompare(b.name))}
    else if (sortBy === 'reverse-alpha'){sortedInventory = sortedInventory.sort((a, b) => b.name.localeCompare(a.name))}
    else if (sortBy === 'rating-high-to-low'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) ) }
    else if (sortBy === 'rating-low-to-high'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating) ) }

    return [sortedInventory, {filterByBarUse, filterByRatingValue, filterByBrands,filterByCategory}];

}

async function plateSorted (inventory, req){

    const plateInventory = inventory;
    let sortedInventory = [];

    const sortBy = req.query.sortBy; 
    const filterByRatingValue = req.query.rating;
    const filterByCategory = req.query.category || 'all';
    const filterByBrands = [req.query.rogue, req.query.ghost, req.query.oso, req.query.kabuki, req.query.york].filter(brand => brand).map(num => parseInt(num));
        //plate filters
    const filterByPlateType = [ req.query.powerliftingPlateType, req.query.multipurposePlateType ].filter(plateType => plateType);
    const filterByUOM = req.query.uom || 'all units';
    
    filterByCategory === 'all' ? sortedInventory = plateInventory :
    sortedInventory = plateInventory.filter((i) => (i.category === filterByCategory));
    
    filterByRatingValue ? sortedInventory = sortedInventory.filter((i) =>(i.rating >= filterByRatingValue)) : sortedInventory = sortedInventory;

    filterByBrands.length > 0  ? sortedInventory = sortedInventory.filter(i => filterByBrands.includes(i.brand_id)) : sortedInventory = sortedInventory;

    filterByPlateType.length > 0 ? sortedInventory = sortedInventory.filter(i => filterByPlateType.includes((i.plate_type).toLowerCase())) : sortedInventory = sortedInventory ;

    filterByUOM === 'all units' ? sortedInventory = sortedInventory  :
    sortedInventory  = sortedInventory.filter((i) => (i.unit_of_measure === filterByUOM));

    if (sortBy === 'alpha'){sortedInventory = sortedInventory.sort((a, b) => a.name.localeCompare(b.name))}
    else if (sortBy === 'reverse-alpha'){sortedInventory = sortedInventory.sort((a, b) => b.name.localeCompare(a.name))}
    else if (sortBy === 'rating-high-to-low'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) ) }
    else if (sortBy === 'rating-low-to-high'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating) ) }

    // res.render('plates', {title: 'Inventory App', sortedInventory, sortBy, filters: { filterByRatingValue, filterByBrands, filterByCategory, filterByPlateType, filterByUOM } });

    return [sortedInventory, { filterByRatingValue, filterByBrands, filterByCategory, filterByPlateType, filterByUOM }];

}

async function rackSorted (inventory, req){

    const rackInventory = inventory;
    let sortedInventory = [];

    const sortBy = req.query.sortBy; 
    const filterByRatingValue = req.query.rating;
    const filterByCategory = req.query.category || 'all';
    const filterByBrands = [req.query.rogue, req.query.ghost, req.query.oso, req.query.kabuki, req.query.york].filter(brand => brand).map(num => parseInt(num));

    filterByCategory === 'all' ? sortedInventory = rackInventory :
    sortedInventory = rackInventory.filter((i) => (i.category === filterByCategory));
    
    filterByRatingValue ? sortedInventory = sortedInventory.filter((i) =>(i.rating >= filterByRatingValue)) : sortedInventory = sortedInventory;

    filterByBrands.length > 0  ? sortedInventory = sortedInventory.filter(i => filterByBrands.includes(i.brand_id)) : sortedInventory = sortedInventory;

    if (sortBy === 'alpha'){sortedInventory = sortedInventory.sort((a, b) => a.name.localeCompare(b.name))}
    else if (sortBy === 'reverse-alpha'){sortedInventory = sortedInventory.sort((a, b) => b.name.localeCompare(a.name))}
    else if (sortBy === 'rating-high-to-low'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) ) }
    else if (sortBy === 'rating-low-to-high'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating) ) }

    return [sortedInventory, { filterByRatingValue, filterByBrands, filterByCategory } ];

}

async function apparelSorted (inventory, req){

    const apparelInventory = inventory;

    let sortedInventory = [];

    const sortBy = req.query.sortBy;
    const filterByRatingValue = req.query.rating;
    const filterByCategory = req.query.category || 'all';
    const filterByBrands = [req.query.rogue, req.query.ghost, req.query.oso, req.query.kabuki, req.query.york].filter(brand => brand).map(num => parseInt(num));
    const filterByShirtSize = [ req.query.largeShirt, req.query.mediumShirt ].filter(size => size);

    filterByCategory === 'all' ? sortedInventory = apparelInventory :
    sortedInventory = apparelInventory.filter((i) => (i.category === filterByCategory));
    
    filterByRatingValue ? sortedInventory = sortedInventory.filter((i) =>(i.rating >= filterByRatingValue)) : sortedInventory = sortedInventory;

    filterByBrands.length > 0  ? sortedInventory = sortedInventory.filter(i => filterByBrands.includes(i.brand_id)) : sortedInventory = sortedInventory;

    filterByShirtSize.length > 0 ? sortedInventory = sortedInventory.filter(i => filterByShirtSize.includes(i.size)) : sortedInventory = sortedInventory;

    if (sortBy === 'alpha'){sortedInventory = sortedInventory.sort((a, b) => a.name.localeCompare(b.name))}
    else if (sortBy === 'reverse-alpha'){sortedInventory = sortedInventory.sort((a, b) => b.name.localeCompare(a.name))}
    else if (sortBy === 'rating-high-to-low'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) ) }
    else if (sortBy === 'rating-low-to-high'){sortedInventory = sortedInventory.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating) ) }

    return [sortedInventory, { filterByRatingValue, filterByBrands, filterByCategory, filterByShirtSize } ];

}


async function getNewItem(req,res) {

    const itemSelection = req.query['item-selection'];

    res.render('form', { title: 'Add new Item', itemSelection });

}

async function addNewItem (req,res) {

        const itemSelection = req.body['item-selection'].trim();
        let newItem = {};

        if(itemSelection === 'barbells'){
            newItem = {
                table:  itemSelection,
                name: req.body.name,
                category: req.body.category,
                barUse: req.body['bar-use'],
                barWeight: req.body['bar-weight'],
                rating: req.body.rating,
                brand: req.body.brand,
                imgsrc: 'https://images.stockcake.com/public/b/2/6/b2651ccf-efb8-4c28-89c2-de0356f01520_large/strength-meets-style-stockcake.jpg'

             };
        } else if (itemSelection === 'plates'){
            newItem = {
                table:  itemSelection,
                name: req.body.name,
                category: req.body.category,
                plateType: req.body['plate-type'],
                uom: req.body.uom,
                rating: req.body.rating,
                brand: req.body.brand,
                imgsrc: 'https://images.stockcake.com/public/b/2/6/b2651ccf-efb8-4c28-89c2-de0356f01520_large/strength-meets-style-stockcake.jpg'

             };
        } else if (itemSelection === 'racks'){
            newItem = {
                table:  itemSelection,
                name: req.body.name,
                category: req.body.category,
                rating: req.body.rating,
                brand: req.body.brand,
                imgsrc: 'https://images.stockcake.com/public/b/2/6/b2651ccf-efb8-4c28-89c2-de0356f01520_large/strength-meets-style-stockcake.jpg'

             };
        } else if (itemSelection === 'apparel'){
            newItem = {
                table:  itemSelection,
                name: req.body.name,
                category: req.body.category,
                shirtSize: req.body['shirt-size'],
                rating: req.body.rating,
                brand: req.body.brand,
                imgsrc: 'https://images.stockcake.com/public/b/2/6/b2651ccf-efb8-4c28-89c2-de0356f01520_large/strength-meets-style-stockcake.jpg'
             };
        }


                console.log('item selection/table: ' + itemSelection);

        console.log('new item: ', newItem);

        await db.insertNewItem(newItem);
        res.redirect("/");

        // console.log("username to be saved: ", req.body.username)
}

async function deleteItem (req,res) {

    const fromTable = req.query.table;
    const deleteId = req.query.id;

    console.log(deleteId, fromTable);
    await db.deleteItemWithId(fromTable, deleteId);
    res.redirect("/");
}

async function updateItemDetails (req,res) {
    const id = req.params.id;
    const table = req.params.table;

    let updatedData = {};

    if(table === 'barbells'){
        updatedData = {
            table:  table,
            name: req.body.name,
            category: req.body.category,
            barUse: req.body['bar-use'],
            barWeight: req.body['bar-weight'],
            rating: req.body.rating,
            brand: req.body.brand,
            id: id,
            imgsrc: req.body.imgsrc
         };
    } else if (table === 'plates'){
        updatedData = {
            table:  table,
            name: req.body.name,
            category: req.body.category,
            plateType: req.body['plate-type'],
            uom: req.body.uom,
            rating: req.body.rating,
            brand: req.body.brand,
            id: id,
            imgsrc: req.body.imgsrc
         };
    } else if (table === 'racks'){
        updatedData = {
            table:  table,
            name: req.body.name,
            category: req.body.category,
            rating: req.body.rating,
            brand: req.body.brand,
            id: id,
            imgsrc: req.body.imgsrc
         };
    } else if (table === 'apparel'){
        updatedData = {
            table:  table,
            name: req.body.name,
            category: req.body.category,
            shirtSize: req.body['shirt-size'],
            rating: req.body.rating,
            brand: req.body.brand,
            id: id,
            imgsrc: req.body.imgsrc
         };
    }


    //  res.send(updatedData);
     await db.updateItem(updatedData);

    res.redirect(`/${table}/`+ id);
}


async function searchItem (req,res) {

    console.log(req.query);
    const searchTerm = await req.query.search.trim();
    //remove whitespace and escape?

    if (!searchTerm){
        return res.render('searchResults', {title: 'Search Results', sortedSearch: {}, searchTerm, sortBy: '', filters: {filterByBarUse: '', filterByRatingValue:'', filterByBrands: '',filterByCategory: '', filterByPlateType:'', filterByUOM:'', filterByShirtSize:''} });

    }

    const searchResults = await db.searchDb(searchTerm);
    let sortedSearch = [];

    //sort by 
    const sortBy = req.query.sortBy;


    //general filters
    const filterByRatingValue = req.query.rating;
    const filterByCategory = req.query.category || 'all';
    const filterByBrands = [req.query.rogue, req.query.ghost, req.query.oso, req.query.kabuki, req.query.york].filter(brand => brand).map(num => parseInt(num));
    
    //barbell filters
    const filterByBarUse = [ req.query.multipurpose, req.query.technique ].filter(barUse => barUse);
    //plate filters
    const filterByPlateType = [ req.query.powerliftingPlateType, req.query.multipurposePlateType ].filter(plateType => plateType);
    const filterByUOM = req.query.uom || 'all units';
    //apparel filters
    const filterByShirtSize = [ req.query.largeShirt, req.query.mediumShirt ].filter(size => size);


    //apply barbell specific filters
    if (searchResults.barbellSearch.length > 0){
        
            filterByBarUse.length > 0 ? searchResults.barbellSearch = searchResults.barbellSearch.filter(i => filterByBarUse.includes((i.bar_use).toLowerCase())) : searchResults.barbellSearch = searchResults.barbellSearch ;

    }

    //apply plate specific filters

    if (searchResults.plateSearch.length > 0){
        
        filterByPlateType.length > 0 ? searchResults.plateSearch = searchResults.plateSearch.filter(i => filterByPlateType.includes((i.plate_type).toLowerCase())) : searchResults.plateSearch = searchResults.plateSearch ;

        
        filterByUOM === 'all units' ? searchResults.plateSearch  = searchResults.plateSearch  :
        searchResults.plateSearch  = searchResults.plateSearch.filter((i) => (i.unit_of_measure === filterByUOM));

    }
    //apply apparel specific filters

    if (searchResults.apparelSearch.length > 0){
        
        filterByShirtSize.length > 0 ? searchResults.apparelSearch = searchResults.apparelSearch.filter(i => filterByShirtSize.includes(i.size)) : searchResults.apparelSearch = searchResults.apparelSearch ;

    }


    //combine results and apply general filters
    let allSearchResults = [...searchResults.barbellSearch, ...searchResults.rackSearch, ...searchResults.plateSearch, ...searchResults.apparelSearch];

    filterByCategory === 'all' ? sortedSearch = allSearchResults :
    sortedSearch = allSearchResults.filter((i) => (i.category === filterByCategory));
    
    filterByRatingValue ? sortedSearch = sortedSearch.filter((i) =>(i.rating >= filterByRatingValue)) : sortedSearch = sortedSearch;

    filterByBrands.length > 0  ? sortedSearch = sortedSearch.filter(i => filterByBrands.includes(i.brand_id)) : sortedSearch = sortedSearch;


    //apply sort filters

    if (sortBy === 'alpha'){sortedSearch = sortedSearch.sort((a, b) => a.name.localeCompare(b.name))}
    else if (sortBy === 'reverse-alpha'){sortedSearch = sortedSearch.sort((a, b) => b.name.localeCompare(a.name))}
    else if (sortBy === 'rating-high-to-low'){sortedSearch = sortedSearch.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) ) }
    else if (sortBy === 'rating-low-to-high'){sortedSearch = sortedSearch.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating) ) }
    


    res.render('searchResults', {title: 'Search Results', sortedSearch, searchTerm, sortBy, filters: {filterByBarUse, filterByRatingValue, filterByBrands,filterByCategory, filterByPlateType, filterByUOM, filterByShirtSize} });


}


module.exports = {

    showInventory,
    showDetails,
    updateItemDetails,
    getNewItem,
    addNewItem,
    deleteItem,
    searchItem
}