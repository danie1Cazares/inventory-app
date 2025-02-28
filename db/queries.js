const pool  = require("./pool");

async function getInventory(table) {

    if (table === 'barbells'){
        try {
            const { rows } = await pool.query("SELECT * FROM barbells");
            return rows;
    
        } catch {
            return ['No inventory'];
        }
        
    } else if (table === 'plates'){
        try {
            const { rows } = await pool.query("SELECT * FROM plates");
            return rows;
    
        } catch {
            return ['No inventory'];
        }
    } else if (table === 'racks'){
        try {
            const { rows } = await pool.query("SELECT * FROM racks");
            return rows;
    
        } catch {
            return ['No inventory'];
        }
        
        
    } else if (table === 'apparel'){
        try {
            const { rows } = await pool.query("SELECT * FROM apparel");
            return rows;
    
        } catch {
            return ['No inventory'];
        }
        
    }

}



async function getItemDetails(table, id){


    try {

        if (table === 'barbells'){
            const { rows } = await pool.query("SELECT * FROM barbells WHERE id = ($1)", [id]);
            return rows[0];
        } else if (table === 'plates'){
            const { rows } = await pool.query("SELECT * FROM plates WHERE id = ($1)", [id]);
            return rows[0];
        } else if (table === 'apparel'){
            const { rows } = await pool.query("SELECT * FROM apparel WHERE id = ($1)", [id]);
            return rows[0];
        }else if (table === 'racks'){
            const { rows } = await pool.query("SELECT * FROM racks WHERE id = ($1)", [id]);
            return rows[0];
        }
    


    } catch {
        return ['No item with that ID'];
    }
    

}

async function searchDb(search){

    const searchResults = {};


    try {
        const barbellSearch = (await pool.query("SELECT * FROM barbells WHERE name ILIKE '%'||$1||'%' ", [search])).rows.map(search => ({
            ...search,
            table: 'barbells'
        }));
        if (barbellSearch) searchResults.barbellSearch = barbellSearch;

    } catch {
        console.log('No results');
        searchResults.barbellSearch = [];
    }  
    try {

        const apparelSearch = (await pool.query("SELECT * FROM apparel WHERE name ILIKE '%'||$1||'%' ", [search])).rows.map(search => ({
            ...search,
            table: 'apparel'
          }));
          if (apparelSearch) searchResults.apparelSearch = apparelSearch;

    } catch {
        console.log('No results');
        searchResults.apparelSearch = [];
    }  


   

    try {
        const rackSearch = (await pool.query("SELECT * FROM racks WHERE name ILIKE '%'||$1||'%' ", [search])).rows.map(search => ({
            ...search,
            table: 'racks'
          }));
          if (rackSearch) searchResults.rackSearch = rackSearch;

    } catch {
        console.log('No results');
        searchResults.rackSearch = [];
    }  

    try {
        const plateSearch = (await pool.query("SELECT * FROM plates WHERE name ILIKE '%'||$1||'%' ", [search])).rows.map(search => ({
            ...search,
            table: 'plates'
          }));
          if (plateSearch) searchResults.plateSearch = plateSearch;

    } catch {
        console.log('No results');
        searchResults.plateSearch = [];
    }  



   return searchResults;

}

async function insertNewItem(item){

    // use item.item-selection to determine which table to insert into

    if (item.table === 'barbells'){

        await pool.query("INSERT INTO barbells (name, category, bar_use, bar_weight, rating, brand_id, imgsrc) VALUES ($1, $2, $3, $4, $5, $6, $7)", [item.name, item.category, item.barUse, item.barWeight, item.rating, item.brand, item.imgsrc]);

    } else if (item.table === 'plates'){

        await pool.query("INSERT INTO plates (name, category, plate_type, unit_of_measure, rating, brand_id, imgsrc) VALUES ($1, $2, $3, $4, $5, $6, $7)", [item.name, item.category, item.plateType, item.uom, item.rating, item.brand, item.imgsrc]);


    } else if (item.table === 'racks'){

        await pool.query("INSERT INTO racks (name, category, rating, brand_id, imgsrc) VALUES ($1, $2, $3, $4, $5)", [item.name, item.category, item.rating, item.brand, item.imgsrc]);

    } else if (item.table === 'apparel'){
        
        await pool.query("INSERT INTO apparel (name, category, size, rating, brand_id, imgsrc) VALUES ($1, $2, $3, $4, $5, $6)", [item.name, item.category, item.shirtSize, item.rating, item.brand, item.imgsrc]);

    }


};

async function updateItem(item) {

    if (item.table === 'barbells'){

        await pool.query("UPDATE barbells SET name = $1, category = $2, bar_use = $3, bar_Weight = $4, rating = $5, brand_id = $6, imgsrc = $7 WHERE id = $8", [item.name, item.category, item.barUse, item.barWeight, item.rating, item.brand, item.imgsrc, item.id]);
   

    } else if (item.table === 'plates'){

        await pool.query("UPDATE plates SET name = $1, category = $2, plate_type = $3, unit_of_measure = $4, rating = $5, brand_id  = $6, imgsrc = $7  WHERE id = $8", [item.name, item.category, item.plateType, item.uom, item.rating, item.brand, item.imgsrc, item.id]);


    } else if (item.table === 'racks'){

        await pool.query("UPDATE racks SET  name = $1, category = $2, rating = $3, brand_id = $4, imgsrc = $5 WHERE id = $6", [item.name, item.category, item.rating, item.brand, item.imgsrc,  item.id]);

    } else if (item.table === 'apparel'){
        
        await pool.query("UPDATE apparel SET name=$1, category=$2, size=$3, rating=$4, brand_id=$5, imgsrc = $6 WHERE id = $7", [item.name, item.category, item.shirtSize, item.rating, item.brand, item.imgsrc, item.id]);

    }




}

async function deleteItemWithId (table, id) {

    if (table === 'barbells'){
        await pool.query("DELETE FROM barbells WHERE id= ($1)", [id]);

    } else if (table === 'plates'){
        await pool.query("DELETE FROM plates WHERE id= ($1)", [id]);

    } else if (table === 'racks'){
        await pool.query("DELETE FROM racks WHERE id= ($1)", [id]);

    } else if (table === 'apparel'){
        await pool.query("DELETE FROM apparel WHERE id= ($1)", [id]);

    }



}


module.exports = {

    getInventory,
    getItemDetails,
    insertNewItem,
    updateItem,
    deleteItemWithId,
    searchDb

};
