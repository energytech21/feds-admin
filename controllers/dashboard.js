exports.dashboard_page = (req,res,next)=>{

     if (req.session.uname){
      
       res.render('../views/admin-dashboard/dashboard',{title:"Admin Dashboard"});
     }
     else{
        res.redirect('/');
     }
};


