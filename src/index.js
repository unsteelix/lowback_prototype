

import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config("./database/db.json", true, true, '/'));

//db.delete("/");

//db.reload();


// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
db.push("/test1","super test");


// It also create automatically the hierarchy when pushing new data for a DataPath that doesn't exists
db.push("/test2/my/test",5);

// You can also push directly objects
db.push("/test3", {test:"test", json: {test:["test"]}});

// If you don't want to override the data but to merge them
// The merge is recursive and work with Object and Array.
db.push("/test3", {
    new:"cool",
    json: {
        important : 5
    }
}, false);

var data = db.getData("/");


console.log('3333', data)