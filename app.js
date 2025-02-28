
require('dotenv').config();
// console.log(process.env);

const express = require('express')

const app = express();

const routes = require('./routes/appRoutes');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', routes);

// app.use((req,res) => {
//     res.status(404).render('404', { title: '404' });
// });

app.listen(PORT);


// GIT STAGE, ADD, AND COMMIT
// GIT PUSH TO REMOTE REPO


// create search filters for each table based on table columns (iems in same groups)

// - clean up css classes
// - PUSH TO GIT
// - DEPLOY



/*

CREATE TABLE barbells (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    bar_use VARCHAR (255),
    bar_weight VARCHAR (255),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id)
);

CREATE TABLE plates (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    plate_type VARCHAR (255),
    unit_of_measure VARCHAR (255) CHECK (unit_of_measure IN ('lb', 'kg')),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id)
);

CREATE TABLE racks (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id)
);

CREATE TABLE apparel (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    size VARCHAR (255) CHECK (size IN ('small', 'medium', 'large')),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id)
);




    TABLE  BARBELLS

    NAME                    | CATEGORY      | BAR USE      | BAR WEIGHT | RATING | BRAND_ID
    --------------------------------------------------------------------------------------------
    The Ohio Bar - Ceratoke | Mens Barbells | Multipurpose | 20kg       | 4.8    | 1

    TABLE  PLATES

    NAME                    | CATEGORY      | PLATE TYPE   | UNIT OF MEASURE | RATING | BRAND_ID
    --------------------------------------------------------------------------------------------
    ROGUE HG Bumper plates  | Bumper Plates | Multipurpose | LB              | 5    | 1

    TABLE  RIGS & RACKS

    NAME                    | CATEGORY      | RATING | BRAND_ID
    --------------------------------------------------------------------------------------------
    Monster Lite Half Rack  | Power Racks   |   5    | 1

    
    TABLE  APPAREL

    NAME                    | CATEGORY      | SHIRT SIZE    | RATING | BRAND_ID
    --------------------------------------------------------------------------------------------
    ROGUE Tie Dye Tshirt    | Men's Apparel | LARGE         | 4      | 1

    TABLE BRANDNAMES

    ID | BRAND
    -----------
    1 | ROUGE
    2 | GHOST
    OSO
    KABUKI STRENGTH
    YORK


    INSERT INTO table_name (column_1, column_2, column_3) 
VALUES (value_1, 'value_2', value_3);

    FOREIGN KEY (BRAND_ID) REFERENCES BRANDNAMES (id)
    NOT NULL - Ensures that a column cannot have a NULL value
UNIQUE - Ensures that all values in a column are different
PRIMARY KEY - A combination of a NOT NULL and UNIQUE. Uniquely identifies each row in a table
FOREIGN KEY - Prevents actions that would destroy links between tables


);





*/
