exports.list = (req, res, next) => {
  if (!req.session.uname) {
    res.redirect("/");
  } else {
    req.getConnection(function(err, conn) {
      if (err) return next(err);


      var srchstrlen = req.body["search[value]"].length;
      var strquery = "";
      var columnArray = ['user_fullname','user_address','dateCreated','status','users_id'];
      if(srchstrlen>0){
        strquery = `SELECT * FROM vusers where user_fullname like '%${req.body["search[value]"]}%' or address like '%${req.body["search[value]"]}%' or status like '%${req.body["search[value]"]}%' ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
      }
      else{
        strquery = `SELECT * FROM vusers ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
      }
     
      
      var query = conn.query(strquery,[req.session.uid] ,function(err, rows) {
        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }

        var parsedData = [];
      
        rows.forEach(e => {
          var rowdata = {
            users_id: e.users_id,
            user_fullname : e.user_fullname,
            address : e.address,
            dateCreated : req.moment(e.dateCreated).format("DD-MM-YYYY hh:mm:ss A"),
            status : e.status
          }
          ;
          parsedData.push(rowdata);
        });

        parsedData = parsedData.slice(req.body.start,req.body.start+req.body.length);

        var data = {
          draw: req.body.draw,
          data: parsedData,
          recordsTotal: rows.length,
          recordsFiltered: rows.length
        };
        
        res.send(data);
        res.end();
      });
    });
  }
};
exports.route_landing = (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store");
 
  if (req.session.uname) {
    res.redirect("/dashboard");
  } else {
    //res.write("<h1>App deployed</h1>");
    res.render("../views/admin-login/login", { title: "Admin Login"});
  }
};
exports.add = (req, res, next) => {
  req.getConnection(function(err, conn) {
    if (err) return next(err);

    var validations = {
      user_fullname:
        req.body.lname + ", " + req.body.lname + " " + req.body.mname,
      user_uname: req.body.uname
    };

    var infodata = {
      user_fname: req.body.fname,
      user_lname: req.body.lname,
      user_mname: req.body.mname,
      user_address: req.body.address
    };
    conn.beginTransaction(err => {
      if (err) return next("Connection Error");
      conn.query(
        "select count(*) as `userCount` from vusers where user_fullname = ? or user_username =?",
        [validations.user_fullname, validations.user_uname],
        (err, result) => {
          if (err) return next("CONNECTION ERROR CHECK QUERY");

          if (result[0].userCount > 0) {
            res.send("error");
          } else {
            var query = conn.query(
              "insert into user_userinfo set ?",
              infodata,
              (err, result) => {
                if (err) return next("CONNECTION ERROR CHECK QUERY");

                var uinfo_id = result.insertId;

                var userdata = {
                  user_username: req.body.uname,
                  user_password: req.body.pword,
                  userlevel_id: 2, //admin
                  userinfo_id: uinfo_id,
                  status_id: 3 //on approval
                };
                var query = conn.query(
                  "insert into user_users set ?",
                  userdata,
                  (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");

                    conn.commit(function(err) {
                      if (err) {
                        return conn.rollback(function() {
                          throw err;
                        });
                      }
                      res.send("success");
                      res.end();
                    });
                  }
                );
              }
            );
          }
        }
      );
    });
  });
};
exports.update = (req, res, next) => {
  req.getConnection(function(err, conn) {
    if (err) return next(err);

    var validations = {
      user_fullname: req.body.fname + " " + req.body.lname + " " + req.body.mname,
      user_uname: req.body.uname,
      users_id : req.body.user_id,
      users_uinfoid : req.body.uinfo_id
    };

    var infodata = {
      user_fname: req.body.fname,
      user_lname: req.body.lname,
      user_mname: req.body.mname,
      user_address: req.body.address
    };
    conn.beginTransaction(err => {
      if (err) return next("Connection Error");
      conn.query(
        "select count(*) as `userCount` from vusers where (user_fullname = ? or user_username =?) and users_id <> ?",
        [validations.user_fullname, validations.user_uname,validations.users_id],
        (err, result) => {
          if (err) return next("CONNECTIfON ERROR CHECK QUERY");

          if (result[0].userCount > 0) {
            res.send("error");
          } else {
            var query = conn.query(
              "update user_userinfo set user_fname = ? , user_lname = ?, user_mname = ?, user_address = ? where userinfo_id = ?",
              [infodata.user_fname,infodata.user_lname,infodata.user_mname,infodata.user_address,validations.users_uinfoid],
              (err, result) => {
                if (err) return next("CONNECTION ERROR CHECK QUERY");


                var userdata = {
                  user_username: req.body.uname,
                  user_password: req.body.pword,
                  userlevel_id: 2, //admin
                };
                var query = conn.query(
                  "update user_users set user_username = ?, user_password = ?, userlevel_id =? where users_id = ?",
                  [userdata.user_username,userdata.user_password,userdata.userlevel_id,validations.users_id],
                  (err, result) => {
                    if (err) return next("CONNECTION ERROR CHECK QUERY");

                    conn.commit(function(err) {
                      if (err) {
                        return conn.rollback(function() {
                          throw err;
                        });
                      }
                      res.send("success");
                      res.end();
                    });
                  }
                );
              }
            );
          }
        }
      );
    });
  });
};
exports.login = (req, res, next) => {
  req.getConnection((err, conn) => {
    if (err) return next(err);

    var user_data = {
      login_uname: req.body.uname,
      login_pword: req.body.pword
    };

    conn.query(
      "select * from vusers where user_password = ? and user_username =?",
      [user_data.login_pword, user_data.login_uname],
      (err, result) => {
        if (err) return next("CONNECTION ERROR CHECK QUERY");

        if (result.length == 0) {
          res.send("not found");
          res.end();
        } else {
          if (result[0].status == "Active") {
            res.setHeader("Cache-Control", "no-cache, no-store");
            req.session.uname = result[0].user_username;
            req.session.uid = result[0].users_id;
            res.json({ redirect: "/dashboard" });
            res.end();
            console.log(result[0].status);
          }
          if (result[0].status == "Inactive") {
            res.send("inactive");
            res.end();
          }
          if (result[0].status == "On Approval") {
            res.send("on approval");
            res.end();
          }
        }
      }
    );
  });
};
exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      res.negotiate(err);
    }

    res.redirect("/");
  });
};
exports.search = (req,res,next)=>{
  if (!req.session.uname) {
    res.redirect("/");
  } else {
    req.getConnection(function(err, conn) {
      if (err) return next(err);
      strquery = `SELECT * FROM vusers where users_id = ${req.body.uid}`;
 
      
      var query = conn.query(strquery,function(err, rows) {
        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }

        
        res.send(rows);
        res.end();
      });
    });
  }
}
//#region  campus reports
exports.report = (req,res,next)=>{

  req.getConnection((err, conn) => {
    if (err) return next(err);

    var report_data = {
      location_id : req.body.loc_id,
      createdBy: req.body.sender,
      details: req.body.details,
    }

    conn.beginTransaction(err =>{
      if (err) return next(err);

      conn.query(
        "insert into data_reports set ?",
        report_data,
        (err, result) => {
          if (err) return next("CONNECTION ERROR CHECK QUERY");

          conn.commit(function(err) {
            if (err) {
              return conn.rollback(function() {
                throw err;
              });
            }
            req.io.emit('reports', "You have recieved new report!");
            res.send("success");
            res.end();
          });
        }
      );
    });
    
  });
}

exports.render_reports = (req,res,next)=>{
  res.setHeader("Cache-Control", "no-cache, no-store");
 
  if (req.session.uname) {
    res.render("../views/admin-campus-reports/reports")
  } else {
    res.redirect("/");
  }
}
exports.getReports = (req, res, next) => {
  if (!req.session.uname) {
    res.redirect("/");
  } else {
  req.getConnection(function(err, conn) {
      if (err) return next("Cannot Connect");


      var srchstrlen = req.body["search[value]"].length;

      var columnArray = ['createdBy','details','location','createdOn'];
      var strquery = "";

      if(srchstrlen>0){
        strquery = `SELECT createdBy,details,location,createdOn FROM vreports where createdBy like '%${req.body["search[value]"]}%' or location like '%${req.body["search[value]"]}%' or details like '%${req.body["search[value]"]}%' ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
      }
      else{
        strquery = `SELECT createdBy,details,location,createdOn FROM vreports ORDER BY ${columnArray[req.body["order[0][column]"]]} ${req.body["order[0][dir]"]}`;
      }
     
      var query = conn.query(strquery,function(err, rows) {
        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }
        
        var parsedData = [];
      
        rows.forEach(e => {
          var rowdata = {
            createdBy : e.createdBy,
            details : e.details,
            location : e.location,
            createdOn :  req.moment(e.createdOn).format("DD-MM-YYYY hh:mm:ss A")}
          ;
          parsedData.push(rowdata);
        });
        parsedData = parsedData.slice(req.body.start,req.body.start+req.body.length);
        var result = {
          "draw": req.body.draw,
          "recordsFiltered": rows.length,
          "recordsTotal": rows.length,
          "data": parsedData
        }
        res.send(result);
      });
    }); 

  }
};
//#endregion