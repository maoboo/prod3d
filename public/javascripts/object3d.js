function getX3DOM(id, socket, callback) {
	//alert(id);
	socket.emit('get', {mid:id})
	socket.on('o3d', function(data){
		//alert(data.geo);
		callback(id, data);
	});
};

function getJSON(id, socket, callback) {
	//alert(id);
	socket.emit('get', {mid:id})
	socket.on('json', function(data){
		//alert(data.geo);
		callback(id, data);
	});
};


function getThree(id, socket, callback) {
	//alert("three:"+id);
	socket.emit('get', {mid:id})
	sockets.on('json', function(msg){
		
		var d = JSON.parse(msg.geo);
		//alert(d.geo);
		//alert(d.geo.metadata.formatVersion);	
		
		loadnew3fromJSON(id, d.geo);
	});
};

function load3fromJSON(json){
		var obj;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
		var r = "textures/cube/Bridge2/";
				var urls = [ r + "posx.jpg", r + "negx.jpg",
							 r + "posy.jpg", r + "negy.jpg",
							 r + "posz.jpg", r + "negz.jpg" ];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );
				textureCube.format = THREE.RGBFormat;
			var ambient = 0x050505, diffuse = 0x331100, specular = 0xffffff, shininess = 10, scale = 23;
				
			var material2 = new THREE.MeshPhongMaterial( {
			color: diffuse,
			specular: specular,
			ambient: ambient,
			shininess: shininess,
			normalMap: THREE.ImageUtils.loadTexture( "sofa/normal.jpg" ),
			normalScale: new THREE.Vector2( -1, 1 ),
			envMap: textureCube,
			combine: THREE.MixOperation,
			reflectivity: 0.1
			} );

        var loader = new THREE.JSONLoader();
		
     //   loader.load(  "exports/test1/box1.js", function( geometry ){
		var pg = loader.parse(json,"/three/apple");
		var geometry = pg.geometry;
		geometry.computeTangents();	
		
		var materials = pg.materials;
		//geometry.computeTangents();	
			 
		var material1=new THREE.MeshPhongMaterial();
		material1.clone( materials[ 0 ]);
	
			
				
		//materials[0].color.setHex( 0xffaaaa );
		material1.color.setRGB( 0, 0.5, 0.2 );
		//material1.ambient.setHex( 0xffffcc );

		//geometry.materials[0].color=new THREE.Color( 0x333333 );
		material1.envMap=textureCube;
		material1.combine = THREE.MixOperation;
        material1.reflectivity = 0.87;
		material1.normalScale=new THREE.Vector2( 1, 1 );
			
		var material = new THREE.MeshFaceMaterial(materials);
        obj = new THREE.Mesh( geometry, material );
        obj.scale.set(1,1,1);
        scene.add( obj );
        //////////////////////////////////////////
        var ambientLight = new THREE.AmbientLight(0x596e82);
        scene.add(ambientLight)

        var light = new THREE.PointLight( 0xe0d5b4 );
        light.position.set( -15, 10, 15 );
        scene.add( light );
		
		spotLight = new THREE.SpotLight( 0x666666 );
		spotLight.position.set( 1000, 500, 1000 );
		spotLight.castShadow = true;
		spotLight.shadowCameraNear = 500;
		spotLight.shadowCameraFov = 70;
		spotLight.shadowBias = 0.001;
		spotLight.shadowMapWidth = 1024;
		spotLight.shadowMapHeight = 1024;
		scene.add( spotLight );


        camera.position.z = 20;
        camera.position.y = 10;
		
        var render = function () {
            requestAnimationFrame(render);

            obj.rotation.y += 0.01;
         //   obj.rotation.x += 0.02;

            renderer.render(scene, camera);
        };

        render();

};

			function init(id, json) {
				if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

				container = document.createElement( 'div' );
				//container.style.background="#FFCC80 url(bg/1.jpg) no-repeat center center";
				
				document.body.appendChild( container );
				container.setAttribute("id","yy");


				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 500 );
				camera.position.set( 0, 30, 50 );
				camera.lookAt(new THREE.Vector3( 0, 20, 0 ));

				scene = new THREE.Scene();
				
				controls = new THREE.OrbitControls( camera );
				controls.addEventListener( 'change', render );
				controls.minDistance=10;
				controls.maxDistance=100;
				controls.maxPolarAngle=40;
				controls.minPolarAngle=0;
				//var loader = new THREE.JSONLoader( true );
				var loader = new THREE.JSONLoader();
				var pg = loader.parse(json,"/three/"+id);
				var geometry = pg.geometry;
				geometry.computeTangents();	
		
				var materials = pg.materials;
				var material3 = new THREE.MeshFaceMaterial(materials);
					
				obj = new THREE.Mesh( geometry, material3 );
				obj.scale.set(1,1,1);
				scene.add( obj );
				
		
				var ambientLight = new THREE.AmbientLight(0x454e55);
       			scene.add(ambientLight);
				var pLight1 = new THREE.PointLight( 0x848b93);
				pLight1.position.set( -1100, 410, 370 );
				scene.add(pLight1);
				
				var bgLight = new THREE.PointLight( 0x7293a3);
				bgLight.position.set( -30, 300, -1000 );
				scene.add(bgLight);

				var spotLight = new THREE.SpotLight( 0xfff2e5);
				spotLight.position.set( 560, 660, 690 );
				
				spotLight.castShadow = true;
				spotLight.shadowCameraNear = 500;
				spotLight.shadowCameraFov = 70;
				spotLight.shadowBias = 0.001;
				spotLight.shadowMapWidth = 1024;
				spotLight.shadowMapHeight = 1024;
				scene.add( spotLight );

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				
			}
			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				controls.update();

			}

			function render() {
				


			//	obj.rotation.y += ( targetRotation - obj.rotation.y ) * 0.05;
				renderer.render( scene, camera );
				

			}

function loadnew3fromJSON(id, json){
		var container;

		var camera, scene, renderer;

		var obj;

		var targetRotation = 0;
		var targetRotationOnMouseDown = 0;

		var mouseX = 0;
		var mouseXOnMouseDown = 0;

		var windowHalfX = window.innerWidth / 2;
		var windowHalfY = window.innerHeight / 2;

		init(id, json);
		animate();

};



function load3fromUrl(url){
		var obj;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
		var r = "textures/cube/Bridge2/";
				var urls = [ r + "posx.jpg", r + "negx.jpg",
							 r + "posy.jpg", r + "negy.jpg",
							 r + "posz.jpg", r + "negz.jpg" ];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );
				textureCube.format = THREE.RGBFormat;
			var ambient = 0x050505, diffuse = 0x331100, specular = 0xffffff, shininess = 10, scale = 23;
				
			var material2 = new THREE.MeshPhongMaterial( {
			color: diffuse,
			specular: specular,
			ambient: ambient,
			shininess: shininess,
			normalMap: THREE.ImageUtils.loadTexture( "sofa/normal.jpg" ),
			normalScale: new THREE.Vector2( -1, 1 ),
			envMap: textureCube,
			combine: THREE.MixOperation,
			reflectivity: 0.1
			} );

        var loader = new THREE.JSONLoader();
		
     //   loader.load(  "exports/test1/box1.js", function( geometry ){
		 loader.load(  "sofa/sofa2.js", function( geometry,materials ){
			 geometry.computeTangents();	
			 
			 var material1=new THREE.MeshPhongMaterial();
			 material1.clone( materials[ 0 ]);
	
			
				
			//materials[0].color.setHex( 0xffaaaa );
			material1.color.setRGB( 0, 0.5, 0.2 );
			//material1.ambient.setHex( 0xffffcc );

			//geometry.materials[0].color=new THREE.Color( 0x333333 );
			material1.envMap=textureCube;
			material1.combine = THREE.MixOperation;
        	material1.reflectivity = 0.87;
			material1.normalScale=new THREE.Vector2( 1, 1 );
			
			var material = new THREE.MeshFaceMaterial(materials);
            obj = new THREE.Mesh( geometry, material );
            obj.scale.set(1,1,1);
            scene.add( obj );
			
			} );


        var ambientLight = new THREE.AmbientLight(0x596e82);
        scene.add(ambientLight)

        var light = new THREE.PointLight( 0xe0d5b4 );
        light.position.set( -15, 10, 15 );
        scene.add( light );
		
		spotLight = new THREE.SpotLight( 0x666666 );
		spotLight.position.set( 1000, 500, 1000 );
		spotLight.castShadow = true;
		spotLight.shadowCameraNear = 500;
		spotLight.shadowCameraFov = 70;
		spotLight.shadowBias = 0.001;
		spotLight.shadowMapWidth = 1024;
		spotLight.shadowMapHeight = 1024;
		scene.add( spotLight );


        camera.position.z = 20;
        camera.position.y = 10;
		
        var render = function () {
            requestAnimationFrame(render);

            obj.rotation.y += 0.01;
         //   obj.rotation.x += 0.02;

            renderer.render(scene, camera);
        };

        render();

};