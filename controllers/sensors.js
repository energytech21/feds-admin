exports.post_sensors = (req, res, next) => {
    req.getConnection((err, conn) => {
        var sensor_data = {
            data: req.body.sensor_data,
            sensor_type: req.body.sensor_type,
            location: req.body.location
        };
        let loc_id = 0;

        conn.query("select * from vlocations where location = ?", [sensor_data.location], (err, result) => {
            loc_id = result[0].location_id;
        });

        conn.beginTransaction((err) => {
            if (sensor_data.sensor_type == "smoke") {
                conn.query("select * from config_alarm where sensor_type = ?", [sensor_data.sensor_type], (err, result) => {
                    if (sensor_data.data >= result[0].level1_threshold && sensor_data.data < result[0].level2_threshold) {
                        sensor_data.level = "Level 1";
                        req.io.emit('alarm/smoke', sensor_data);
                    }
                    else if (sensor_data.data >= result[0].level2_threshold && sensor_data.data < result[0].level3_threshold) {
                        sensor_data.level = "Level 2";
                        req.io.emit('alarm/smoke', sensor_data);
                    }
                    else if (sensor_data.data >= result[0].level3_threshold) {
                        sensor_data.level = "Level 3";
                        req.io.emit('alarm/smoke', sensor_data);
                    }
                });

                conn.query("insert into sensors_smoke (data,location_id,time) values (?,?,?)", [sensor_data.data, loc_id, req.moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");

                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        req.io.emit('smoke/sensor/' + sensor_data.location, sensor_data);
                        res.send('success');

                        res.end();
                    });
                });
            }
            if (sensor_data.sensor_type == "temp") {

                conn.query("select * from config_alarm where sensor_type = ?", [sensor_data.sensor_type], (err, result) => {
                    if (sensor_data.data >= result[0].level1_threshold && sensor_data.data < result[0].level2_threshold) {
                        sensor_data.level = "Level 1";
                        req.io.emit('alarm/temp', sensor_data);
                    }
                    else if (sensor_data.data >= result[0].level2_threshold && sensor_data.data < result[0].level3_threshold) {
                        sensor_data.level = "Level 2";
                        req.io.emit('alarm/temp', sensor_data);
                    }
                    else if (sensor_data.data >= result[0].level3_threshold) {
                        sensor_data.level = "Level 3";
                        req.io.emit('alarm/temp', sensor_data);
                    }
                });

                conn.query("insert into sensors_temperature (data,location_id,time) values (?,?,?)", [sensor_data.data, loc_id, req.moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");

                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }

                        req.io.emit('fire/sensor/' + sensor_data.location, sensor_data);
                        res.send('success');
                        res.end();
                    });
                });
            }
        });
    });
}


exports.post_earthquake = (req, res, next) => {

    req.getConnection((err, conn) => {
        var sensor_data = {
            x_data: req.body.x_data,
            y_data: req.body.y_data,
            z_data: req.body.z_data,
        };
        //#region old earthquake alarm code
        /*
               var eq_def={
       
               };
       
               conn.query("SELECT * from config_alarm where sensor_type = 'earth_def' ", function (err, rows) {
                   if (err) {
                       console.log(err);
                       return next("Mysql error, check your query");
                   }
       
                   eq_def.x = rows[0].level1_threshold;
                   eq_def.y = rows[0].level2_threshold;
                   eq_def.z = rows[0].level3_threshold;
       
               });
       
               conn.query("select * from config_alarm where sensor_type = 'earth' ", (err, result) => {
                   if (result[0] != undefined) {
       
                     var level = {
                           x: {
                               one: Math.abs(eq_def.x) + result[0].level1_threshold,
                               two: Math.abs(eq_def.x) + result[0].level2_threshold,
                               three: Math.abs(eq_def.x) + result[0].level3_threshold
                           },
                           y: {
                               one: Math.abs(eq_def.y) + result[0].level1_threshold,
                               two: Math.abs(eq_def.y) + result[0].level2_threshold,
                               three: Math.abs(eq_def.y) + result[0].level3_threshold
                           },
                           z: {
                               one: Math.abs(eq_def.z) + result[0].level1_threshold,
                               two: Math.abs(eq_def.z) + result[0].level2_threshold,
                               three: Math.abs(eq_def.z) + result[0].level3_threshold
                           }
                       }
       
                       var exp = {
                           x: {
                               one: ((Math.abs(sensor_data.x_data) >= level.x.one) && !(Math.abs(sensor_data.x_data) >= level.x.two)),
                               two: ((Math.abs(sensor_data.x_data) >= level.x.two) && !(Math.abs(sensor_data.x_data) >= level.x.three)),
                               three: (Math.abs(sensor_data.x_data) >= level.x.three)
                           },
                           y: {
                               one: ((Math.abs(sensor_data.y_data) >= level.y.one) && !(Math.abs(sensor_data.y_data) >= level.y.two)),
                               two: ((Math.abs(sensor_data.y_data) >= level.y.two) && !(Math.abs(sensor_data.y_data) >= level.y.three)),
                               three: (Math.abs(sensor_data.y_data) >= level.y.three)
                           },
                           z: {
                               one: ((Math.abs(sensor_data.z_data) >= level.z.one) && !(Math.abs(sensor_data.z_data) >= level.z.two)),
                               two: ((Math.abs(sensor_data.z_data) >= level.z.two) && !(Math.abs(sensor_data.z_data) >= level.z.three)),
                               three: (Math.abs(sensor_data.z_data) >= level.z.three)
                           }
                       }
       
                       if (exp.x.one || exp.y.one || exp.z.one) {
                           sensor_data.level = 'Level 1';
                           req.io.emit('alarm/earth', sensor_data);
                       }
                       else if (exp.x.two || exp.y.two || exp.z.two) {
                           sensor_data.level = 'Level 2';
                           req.io.emit('alarm/earth', sensor_data);
       
                       } else if (exp.x.three || exp.y.three || exp.z.three) {
                           sensor_data.level = 'Level 3';
                           req.io.emit('alarm/earth', sensor_data);
       
                       }
                  
                   }
       
               });
        */
        //#endregion
        conn.beginTransaction((err) => {
            conn.query("insert into sensors_earthquake (x_data,y_data,z_data,time) values (?,?,?,?)", [sensor_data.x_data, sensor_data.y_data, sensor_data.z_data, req.moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                if (err) return next("CONNECTION ERROR CHECK QUERY");

                conn.commit(function (err) {
                    if (err) {
                        return conn.rollback(function () {
                            throw err;
                        });
                    }

                    conn.query("select * from sensors_earthquake order by `time` DESC limit 2", (err, result) => {
                        if (err) return next("CONNECTION ERROR CHECK QUERY");

                        var magnitude_data = [];

                        for (var i = 0; i < result.length - 1; i++) {

                            var x1 = result[i].x_data,
                                x2 = result[i + 1].x_data,
                                y1 = result[i].y_data,
                                y2 = result[i + 1].y_data;

                            var ypow = Math.pow(y2 - y1, 2),
                                xpow = Math.pow(x1 - x2, 2);

                            var xytotal = xpow + ypow;

                            var mv = Math.sqrt(xytotal);

                            var data = {
                                raw_data: {
                                    x1: x1,
                                    y1: y1,
                                    x2: x2,
                                    y2: y2,
                                    t1: req.moment(result[i].time).format("DD-MM-YYYY hh:mm:ss A"),
                                    t2: req.moment(result[i + 1].time).format("DD-MM-YYYY hh:mm:ss A")
                                },
                                calculated_data: {
                                    xpow: xpow,
                                    ypow: ypow,
                                    xytotal: xytotal,
                                    mv: mv
                                }

                            }
                            magnitude_data.push(data);
                        }

                        var result_mv = magnitude_data[0].calculated_data.mv;

                        if (result_mv >= 4.0 && result_mv <= 4.9) {
                            sensor_data.level = 'Level 1';
                            req.io.emit('alarm/earth', sensor_data);
                        }
                        else if (result_mv >= 5.0 && result_mv <= 5.9) {
                            sensor_data.level = 'Level 2';
                            req.io.emit('alarm/earth', sensor_data);

                        } else if (result_mv >= 6.0) {
                            sensor_data.level = 'Level 3';
                            req.io.emit('alarm/earth', sensor_data);
                        }
                        req.io.emit('earth/sensor', sensor_data);
                        res.send('success');
                        res.end();
                    });


                });
            });
        });
    });
}


exports.get_sensors_data = (req, res, next) => {
    req.getConnection((err, conn) => {
        var sensor_data = {
            location: req.body.loc_id,
            startDate: req.moment(req.body.start_date).format("YYYY-MM-DD"),
            endDate: req.moment(req.body.end_date).format("YYYY-MM-DD"),
            sensor_type: req.body.sensor_type
        };

        conn.beginTransaction((err) => {
            if (sensor_data.sensor_type == "smoke") {
                var table_data = { x: [], y: [], sensor_type: "smoke" };
                conn.query("select * from sensors_smoke where CAST(`time` AS date) BETWEEN CAST(? AS date) and CAST(? AS date) and location_id = ? order by `time`", [sensor_data.startDate, sensor_data.endDate, sensor_data.location], (err, result) => {
                    if (err) throw err;
                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        result.forEach((item) => {
                            table_data.y.push(item.data);
                            table_data.x.push(req.moment(item.time).format("DD-MM-YYYY hh:mm:ss A"));
                        });
                        res.send(table_data);
                        res.end();
                    });
                });
            }
            if (sensor_data.sensor_type == "earth") {
                var table_data = { x_trace: [], y_trace: [], z_trace: [], time: [], sensor_type: "earth" };
                conn.query("select * from sensors_earthquake where CAST(`time` AS date) BETWEEN CAST(? AS date) and CAST(? AS date) order by `time`", [sensor_data.startDate, sensor_data.endDate], (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");

                    result.forEach((item) => {
                        table_data.x_trace.push(item.x_data);
                        table_data.y_trace.push(item.y_data);
                        table_data.z_trace.push(item.z_data);
                        table_data.time.push(req.moment(item.time).format("DD-MM-YYYY hh:mm:ss A"));
                    });

                    var magnitude_data = [];

                    for (var i = 0; i < result.length(); i++) {
                        console.log(result[i]);
                    }

                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        res.send(table_data);
                        res.end();
                    });

                });
            }
            if (sensor_data.sensor_type == "temp") {
                var table_data = { x: [], y: [], sensor_type: "temp" };
                conn.query("select * from sensors_temperature where CAST(`time` AS date) BETWEEN CAST(? AS date) and CAST(? AS date) and location_id = ? order by `time`", [sensor_data.startDate, sensor_data.endDate, sensor_data.location], (err, result) => {
                    if (err) throw err;
                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        result.forEach((item) => {
                            table_data.y.push(item.data);
                            table_data.x.push(req.moment(item.time).format("DD-MM-YYYY hh:mm:ss A"));
                        });
                        res.send(table_data);
                        res.end();
                    });
                });
            }

        });
    });
}

exports.test_page = (req, res, next) => {


};


exports.get_probability = (req, res, next) => {

    req.getConnection((err, conn) => {

        var today = req.moment().tz("Asia/Manila");
        var last_sevendays = req.moment().subtract(7,'d');

        conn.query("select * from sensors_earthquake where CAST(`time` AS date) between CAST( ? AS DATE) and CAST( ? AS DATE) order by `time`",[last_sevendays.format("YYYY-MM-DD"),today.format("YYYY-MM-DD")],(err, result) => {
            if (err) return next("CONNECTION ERROR CHECK QUERY");

            console.log(result.length);
            var magnitude_data = {
                data: [],
                probability: 0
            };

            for (var i = 0; i < result.length - 1; i++) {

                var x1 = result[i].x_data,
                    x2 = result[i + 1].x_data,
                    y1 = result[i].y_data,
                    y2 = result[i + 1].y_data;

                var ypow = Math.pow(y2 - y1, 2),
                    xpow = Math.pow(x1 - x2, 2);

                var xytotal = xpow + ypow;

                var mv = Math.sqrt(xytotal);

                var data = {
                    raw_data: {
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        t1: req.moment(result[i].time).format("DD-MM-YYYY hh:mm:ss A"),
                        t2: req.moment(result[i + 1].time).format("DD-MM-YYYY hh:mm:ss A")
                    },
                    calculated_data: {
                        xpow: xpow,
                        ypow: ypow,
                        xytotal: xytotal,
                        mv: mv
                    }

                }
                magnitude_data.data.push(data);
            }


            var total = 0;


            for (var i = 0; i < magnitude_data.data.length - 1; i++) {
                if (magnitude_data.data[i].calculated_data.mv > 2.5) {
                    total = total + 100;
                }
                else {
                    total = total + ((magnitude_data.data[i].calculated_data.mv / 2.5) * 100);
                }

            }
            var prob = total / magnitude_data.data.length;

            magnitude_data.probability = prob;

            conn.commit(function (err) {
                if (err) {
                    return conn.rollback(function () {
                        throw err;
                    });
                }
                req.io.emit('earth/probability', magnitude_data.probability.toFixed(2));
                res.send("success");
                res.end();
            });

        });
    });
};