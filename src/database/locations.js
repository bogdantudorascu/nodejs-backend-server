import connections from '../connections';

export default {
    insertLocation(data, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
                connection.query("INSERT INTO locations SET ?", data, function(err,results,fields){
                    connection.release();
                    if(err){
                        errors["global"] = "Query: "+err;
                        callback(errors, null)
                    } else
                        callback(null, results.insertId)
                });
        });
    },
    updateLocation(data, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else {
                const q = connection.query("UPDATE locations SET name = ? WHERE id = ?", [data.name, data.id], function (err, results, fields) {
                    connection.release();
                    if (err) {
                        errors["global"] = "Query: " + err;
                        callback(errors, null)
                    } else
                        callback(null, results.affectedRows)
                });
                console.log(q.sql);
            }
        });
    },
    getLocations(callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else {
                connection.query("SELECT * FROM locations", function (err, results, fields) {
                    connection.release();
                    if (err) {
                        errors["global"] = "Query: " + err;
                        callback(errors, null)
                    } else
                        callback(null, results)
                });
            }
        });
    },
    getlocationById(id, callback) {
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
                connection.query("SELECT * FROM locations WHERE id = ?", id, function(err,results,fields){
                    connection.release();
                    if(err){
                        errors["global"] = "Query: "+err;
                        callback(errors, null)
                    } else
                        callback(null, results)
                });
        });
    }
}