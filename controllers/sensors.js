exports.post_sensors = (req, res, next) => {
    req.getConnection((err, conn) => {
        var sensor_data = {
            data: req.body.sensor_data,
            sensor_type: req.body.sensor_type,
            location: req.body.location
        };
        var loc_id = 0;
        if (sensor_data.location == "Faculty") {
            loc_id = 1;
        }
        if (sensor_data.location == "AVR") {
            loc_id = 2;
        }

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
                conn.query("insert into sensors_smoke (data,location_id) values (?,?)", [sensor_data.data, loc_id], (err, result) => {
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

                conn.query("insert into sensors_temperature (data,location_id) values (?,?)", [sensor_data.data, loc_id], (err, result) => {
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

        conn.beginTransaction((err) => {
            conn.query("insert into sensors_earthquake (x_data,y_data,z_data) values (?,?,?)", [sensor_data.x_data, sensor_data.y_data, sensor_data.z_data], (err, result) => {
                if (err) return next("CONNECTION ERROR CHECK QUERY");

                conn.commit(function (err) {
                    if (err) {
                        return conn.rollback(function () {
                            throw err;
                        });
                    }
                    req.io.emit('earth/sensor', sensor_data);
                    res.send('success');
                    res.end();
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

        console.log(sensor_data);
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

    if (req.session.uname) {

        res.render('../views/sensors/test_data');
    }
    else {
        res.redirect('/');
    }
};
