exports.sensor_history_page = (req,res,next)=>{

    if (req.session.uname){
     
      res.render('../views/admin-sensors-history/sensors-history',{title:"Device Data History"});
    }
    else{
       res.redirect('/');
    }
};


