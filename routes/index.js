var crypto = require('crypto');
var fs = require('fs');
var mime = require('mime');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home', {
			title: 'Home Page',
    		//success: req.flash('success').toString(),
    		//error: req.flash('error').toString()
		});
	});
	
	app.get('/photo', function (req, res) {
	  fs.readdir('./public/upload/bg', function(err, files){
	    
	    var names = [];
	    files.forEach(function(file){
	        var type = mime.lookup(file);
	        if(type.indexOf('image')>-1){
	          
	          names.push('/upload/'+file);
	        } 	
	    });
	    console.log(names);
	    res.render('upload', {
	    	title: '文件上传',
	    	imagefiles: names,
	    });
	  });
	});
	
	
	app.post('/uploadDir', function (req, res) {
	  //console.log(req);
	  
	  //req.flash('success','鏂囦欢涓婁紶鎴愬姛!');
	  //res.redirect('/upload');
	  var regex = /^data:.+\/(.+);base64,(.*)$/;
	  var img64 = req.body.img;
	  var matches = img64.match(regex);
	  var ext = matches[1];
      var data = matches[2];
      var buffer = new Buffer(data, 'base64');
      var date = new Date();
      fs.writeFileSync('./public/upload/bg/'+date.getTime()+'.' + ext, buffer);
      //res.redirect('back');
	});
	
	app.get('/upload', function (req, res) {
		
	  fs.readdir('./public/upload/bg', function(err, files){
	    
	    var names = [];
	    files.forEach(function(file){
	        var type = mime.lookup(file);
	        if(type.indexOf('image')>-1){
	          names.push(file);
	        } 	
	    });
	    console.log(names);
	    res.render('upload', {
	    	title: '文件上传',
	    	imagefiles: names,
	    });
	  });
	});
	app.post('/upload', function (req, res) {
	  for (var i in req.files) {
	    if (req.files[i].size == 0){
	      // 浣跨敤鍚屾鏂瑰紡鍒犻櫎涓�釜鏂囦欢
	      fs.unlinkSync(req.files[i].path);
	      console.log('Successfully removed an empty file!');
	    } else {
	      var target_path = './public/upload/bg/' + req.files[i].name;
	      // 浣跨敤鍚屾鏂瑰紡閲嶅懡鍚嶄竴涓枃浠�
	      fs.renameSync(req.files[i].path, target_path);
	      console.log('Successfully renamed a file!');
	      
	    }
	  }
	 
	  //req.flash('success','鏂囦欢涓婁紶鎴愬姛!');
	  res.redirect('back');
	});
	
	app.post('/delete', function (req, res) {
		console.log("deleted file:"+req.body.file);
		var path = './public'+req.body.file;
		fs.unlink(path, function(err){
			res.redirect('back');
		});
	  
	});
	
	app.get('/home', function(req, res) {
		res.render('home', {
			title: 'Home Page',
    		//success: req.flash('success').toString(),
    		//error: req.flash('error').toString()
		});
	});
	
	//app.get('/model', checkLogin);
	app.get('/model', function (req, res) {
	  res.render('model', {
	    title: 'X3D模型',
	    //success: req.flash('success').toString(),
	    //error: req.flash('error').toString()
	  });
	});
	
	app.get('/model/:id', function (req, res) {

		var attrs = [];
		fs.readdir('./public/models', function(err, files){
	    	
		
	    files.forEach(function(file){
	    	var readmepath = './public/models/'+file+'/readme';
			
	    	var t=fs.readFile(readmepath, 'utf8', function (err, data) {
			  if (err) throw err;
			  var rm = JSON.parse(data);  
			  //console.log(rm.pic);
			  var ar = {name:rm.name, url:'/models/'+file, desc:rm.desc, objname:rm.json,img:'/models/'+file+'/'+rm.pic};
			  attrs.push(ar);
			  if(attrs.length==files.length){
			  	fs.readdir('./public/upload/bg', function(err, files){
				    var names = [];
				    var imagefiles = [];
				    files.forEach(function(file){
				        var type = mime.lookup(file);
				        if(type.indexOf('image')>-1){
				          imagefiles.push('/upload/bg/'+file);
				        } 	
				    });
				    console.log(attrs);
					console.log(imagefiles);

				    res.render('jmodel', {
				    title: '商品展示',

				    mid: req.params.id,
				    imagefiles: imagefiles,
					models: attrs
				    //success: req.flash('success').toString(),
				    //error: req.flash('error').toString()
				  });
				  });
			  }
			 });
			
	        	
	    });
	    
	  });
	  
	  
	});
	
	
	app.get('/models', function (req, res) {
	  
	  fs.readdir('./public/models', function(err, files){
	    
	    var names = [];
	    var attrs = [];
	    files.forEach(function(file){
	    	var readmepath = './public/models/'+file+'/readme';
	    	fs.readFile(readmepath, 'utf8', function (err, data) {
			  if (err) throw err;
			  var rm = JSON.parse(data);  
			  console.log(rm.pic);
			  var ar = {name:rm.name, url:'/model/'+file, desc:rm.desc, img:'/models/'+file+'/'+rm.pic};
			  attrs.push(ar);
			  if(attrs.length==files.length){
			  	console.log(attrs);
			  	res.render('modellist', {
			    	title: '文件上传',
			    	models: attrs,
			    });
			  }
			});
	        	
	    });
	    
	  });
	  
	});
};