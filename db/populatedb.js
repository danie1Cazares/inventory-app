#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS brandnames (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brand VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS  barbells (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    bar_use VARCHAR (255),
    bar_weight VARCHAR (255),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id),
    imgsrc VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS  plates (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    plate_type VARCHAR (255),
    unit_of_measure VARCHAR (255) CHECK (unit_of_measure IN ('lb', 'kg')),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id),
    imgsrc VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS racks (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id),
    imgsrc VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS apparel (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (255) NOT NULL,
    category VARCHAR (255),
    size VARCHAR (255) CHECK (size IN ('small', 'medium', 'large')),
    rating DECIMAL(2, 1),
	brand_id INT REFERENCES brandnames(id),
    imgsrc VARCHAR (255)
);


    INSERT INTO brandnames  (brand) 
VALUES ('Rogue'),('Ghost'),('OSO'),('Kabuki Strength'),('York');

    INSERT INTO barbells (name, category, bar_use, bar_weight, rating, brand_id, imgsrc) 
VALUES ('The Ohio Bar - Ceratoke', 'Mens Barbells', 'Multipurpose', '20kg', 4.8, 1, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_768,b_rgb:f8f8f8/catalog/Weightlifting%20Bars%20and%20Plates/Barbells/Mens%2020KG%20Barbells/OHIOCERAKOTE/2023%20Update/Updated%2028.5%20header%20images/OHIOCERAKOTE-Red-black-H_qdfvwt.png');

    INSERT INTO barbells (name, category, bar_use, bar_weight, rating, brand_id, imgsrc) 
VALUES ('OSO Mini Bar', 'Junior Bars', 'Technique', '2', 4.8, 3, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1042,b_rgb:f8f8f8/catalog/Weightlifting%20Bars%20and%20Plates/Barbells/Technique%20Barbells/OB0015/OB0015-h_uiddec.png');

    INSERT INTO plates (name, category, plate_type, unit_of_measure, rating, brand_id, imgsrc) 
VALUES ('ROGUE HG Bumper Plates', 'Bumper Plates', 'Multipurpose', 'lb',  5.0, 1, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1042,b_rgb:f8f8f8/catalog/Weightlifting%20Bars%20and%20Plates/Plates/Bumper%20Plates/IP0515/IP0515-h_x6e66v.png');

    INSERT INTO plates (name, category, plate_type, unit_of_measure, rating, brand_id, imgsrc) 
VALUES ('ROGUE Deep Dish Plates', 'Steel Plates', 'Powerlifting', 'lb',  4.8, 1,  'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_828,b_rgb:f8f8f8/catalog/Weightlifting%20Bars%20and%20Plates/Plates/Steel%20Plates/USC0003/USC0003-H_xjgacv.png');

    INSERT INTO racks  (name, category, rating, brand_id, imgsrc) 
VALUES ('Monster Lite Half Rack', 'Power Rack',  5.0, 1, 'https://assets.roguefitness.com/f_auto,q_auto,c_fill,g_center,w_626,h_396,b_rgb:f8f8f8/catalog/Rigs%20and%20Racks/Power%20Racks%20/Monster%20Lite%20Racks/MLHR-GROUP/ML-Half-Rack-AC1_h2u7dw.jpg');

    INSERT INTO racks  (name, category, rating, brand_id, imgsrc) 
VALUES ('Rogue R-3 Power Rack ', 'Power Rack',  5.0, 1, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1042,b_rgb:f8f8f8/catalog/Rigs%20and%20Racks/Power%20Racks%20/R-Series%20Racks/XX325/XX325-H_dcnrr4_yahyzp.png');

    INSERT INTO apparel  (name, category, size, rating, brand_id, imgsrc) 
VALUES ('Rogue Tie Dye Tshirt', 'Mens Apparel', 'large', 4.0, 1, ' https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1536,b_rgb:f8f8f8/catalog/Apparel/Men%27s%20Apparel/T-Shirts/HW0796/HW0796-H_lrf0wz.png');
 
    INSERT INTO apparel  (name, category, size, rating, brand_id, imgsrc) 
VALUES ('Rogue Pullover Hoodie', 'Mens Apparel', 'large', 4.0, 1, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1536,b_rgb:f8f8f8/catalog/Apparel/Men%27s%20Apparel/Hoodies/AT0153/AT0153-H_lchreb.png');

    

`;

async function main(){
    console.log("seeding...");
    const client = new Client ({
        connectionString: "postgresql://postgres:3251lima@localhost:5432/fitness_inventory",
    });
    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("done");
}

main();