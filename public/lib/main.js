

var container;

var camera, scene, renderer, animation,bootobjs;
var selectobj,selectbg,srcs,index=-1;
var geometry;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouse = new THREE.Vector2(),INTERSECTED,SELECTED,offset = new THREE.Vector3();
var plane;
var clock = new THREE.Clock();
var controls,projector, raycaster;
var spriteys = [];


if (window.name != "Bencalie") {
	//location.reload();
	window.name = "Bencalie";
} else {
	window.name = "";
}

	var url = window.location.href;
	var paras = url.split('/');
	var mid = paras[paras.length - 1];
init("/models/" + mid + "/" + mid + ".js");

animate();

function init(modelurl) {
	if (!Detector.webgl)
		Detector.addGetWebGLMessage();


	container = document.createElement('div');
	//container.style.background="#FFCC80 url(bg/1.jpg) no-repeat center center";
	container.setAttribute("id", "yy");
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 15, 40);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();
	bootobjs=new THREE.Object3D();
	scene.add(bootobjs);

	loadmodel(modelurl);
	var ambientLight = new THREE.AmbientLight(0x454e55);
	scene.add(ambientLight);
	var pLight1 = new THREE.PointLight(0x848b93);
	pLight1.position.set(-1100, 410, 370);
	scene.add(pLight1);

	var bgLight = new THREE.PointLight(0x7293a3);
	bgLight.position.set(-30, 300, -1000);
	scene.add(bgLight);

	var spotLight = new THREE.SpotLight(0xfff2e5);
	spotLight.position.set(560, 660, 690);
	scene.add(spotLight);

	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
	//plane.visible = false;
	scene.add( plane );

	renderer = new THREE.WebGLRenderer({
			antialias : true
		});

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.alpha = true;
	container.appendChild(renderer.domElement);

	//compose
	/*	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	var effectBloom = new THREE.BloomPass( 1 );
	composer.addPass( effectBloom );*/
	//
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);
	controls.minDistance = 10;
	controls.maxDistance = 100;
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI / 2;

	/*control = new THREE.TransformControls(camera, container);
	control.addEventListener('change', render);
	scene.add(control);
	control.setSpace("world");
	//control.setMode( "translate" );
	control.setMode("rotate");*/

	window.addEventListener('resize', onWindowResize, false);
	document.getElementById("le").addEventListener('mouseover', onCloseContrl, false);
	document.getElementById("le").addEventListener('mouseout', onOpenContrl, false);
	
	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

}



function loadmodel(modelurl) {
	
	var paras = modelurl.split('/');
	var mid = paras[paras.length - 1];
	 paras = mid.split('.');
	 mid = paras[0];
	
	//var loader = new THREE.BinaryLoader(true);
	var loader = new THREE.JSONLoader(true);
	loader.load(modelurl, function (geometry, materials) {

		var material3 = new THREE.MeshFaceMaterial(materials);
		material3.needsUpdate = true;
		srcs=document.getElementById("sho1").innerHTML;
//		if(srcs=="")
//			document.getElementById("sho1").innerHTML='此商品没有说明信息';
		
		if (geometry.empty)
			if (geometry.empty.length != 0) {

				src = "";
				for (var i = 0; i < geometry.empty.length; i++) {
					var spritey = makeTextSprite(" " + geometry.empty[i].index + ":" + geometry.empty[i].name, {
							fontsize : 18,
							backgroundColor : {
								r : 255,
								g : 100,
								b : 100,
								a : 1
							}
						});
					spritey.position.x = geometry.empty[i].position[0];
					spritey.position.y = geometry.empty[i].position[1];
					spritey.position.z = geometry.empty[i].position[2];
					spritey.position.multiplyScalar(1);
					spriteys.push(spritey);

					src += '<li onclick="camGotoTar(\'' + spritey.position.x + '\',\'' + spritey.position.y + '\',\'' + spritey.position.z + '\')"><div><div style="float:left;width:30px;height:100%;background:#0C0;text-align: center;">' + geometry.empty[i].index + '</div><div style="float:right;width:230px;height:100%;background:#0C0">' + geometry.empty[i].name + '</div></div></li>';
				}
				srcs+= '<ul class="shos" id="sho'+mid+'">' + src + '</ul>';
				document.getElementById("sho1").innerHTML  =  srcs ;

			}
			srcs=document.getElementById("ani1").innerHTML;
//		if(srcs=="")
//			document.getElementById("ani1").innerHTML='此商品没有动画信息';
		//document.getElementsByClassName("anis").style.display="none";

		if (geometry.animations)
			if (geometry.animations.length != 0) {
				for (var i = 0; i < materials.length; i++) {

					var m = materials[i];
					m.skinning = true;

				}
				var src = "";
				for (var i = 0; i < geometry.animations.length; i++) {
					THREE.AnimationHandler.add(geometry.animations[i]);
					src += '<li onclick="playAnimation(\'' + geometry.animations[i].name + '\')"><div><div style="float:left;width:30px;height:100%;background:#0C0;text-align: center;">' + i + '</div><div style="float:right;width:230px;height:100%;background:#0C0">' + geometry.animations[i].name + '</div></div></li>';

				}
				srcs+='<ul class="anis" id="ani'+mid+'">' + src + '</ul>';
				document.getElementById("ani1").innerHTML = srcs;

				var obj = new THREE.SkinnedMesh(geometry, material3);
				obj.scale.set(1, 1, 1);
				bootobjs.add(obj);

				obj.castShadow = false;
				obj.receiveShadow = false;

			} else {

				obj = new THREE.Mesh(geometry, material3);
				obj.scale.set(1, 1, 1);
				bootobjs.add(obj);
				obj.castShadow = false;
				obj.receiveShadow = false;
			}
			obj.name=mid;

		if(selectbg!=null){

				for(var o=0;o<material3.materials.length;o++)
				{

						if (material3.materials[o].envMap != null) {
							material3.materials[o].envMap = selectbg;
						}
					}
			}

	});

}

function onCloseContrl() {

	controls.enabled = false;
}
function onOpenContrl() {
	controls.enabled = true;
}
function camGotoTar(x, y, z) {
	//console.log(x);
	//controls.target = new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
	//camera.lookAt(new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)));
}

function makeTextSprite(message, parameters) {
	if (parameters === undefined)
		parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : {
		r : 0,
		g : 0,
		b : 0,
		a : 1.0
	};

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : {
		r : 255,
		g : 255,
		b : 255,
		a : 1.0
	};


	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	var textWidth = metrics.width;

	// background color
	context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
		 + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
		 + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText(message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
		texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({
			map : texture,
			useScreenCoordinates : true,
		});
	var sprite = new THREE.Sprite(spriteMaterial);

	sprite.scale.set(10, 5, 1);
	sprite.position.normalize();
	//sprite.position.multiplyScalar( radius );
	return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function onWindowResize() {


	camera.aspect = (window.innerWidth) / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('le').style.height = window.innerHeight - 45 + "px";
	document.getElementById('tui1').style.height = document.getElementById('bg1').style.height = document.getElementById('ani1').style.height = document.getElementById('sho1').style.height = window.innerHeight - 185 + "px";
	document.getElementById('bgcon').style.height = window.innerHeight - 220 + "px";
}
function playAnimation(animator) {

	if (animation)
		if (animation.isPlaying)
			animation.stop();

	animation = new THREE.Animation(selectobj, animator, THREE.AnimationHandler.LINEAR);
	animation.JITCompile = false;
	//animation.interpolationType = THREE.AnimationHandler.LINEAR;

	animation.play(false, 0);

}

/*function onDocumentMouseUp(event){
	event.preventDefault();

	}
function onDocumentMouseMove(event){
	event.preventDefault();
	
	}
function onDocumentMouseDown(event){
	event.preventDefault();
	//if(!control.swit)
		pick(event);
	
	}*/
	
function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				//

				var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
				projector.unprojectVector( vector, camera );

				var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );


				if ( SELECTED ) {

					var intersects = raycaster.intersectObject( plane );
					SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
					return;

				}


				var intersects = raycaster.intersectObjects( bootobjs.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						//INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

						plane.position.copy( INTERSECTED.position );
						plane.lookAt( camera.position );

					}

					container.style.cursor = 'pointer';

				} else {

					//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';

				}

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
				projector.unprojectVector( vector, camera );

				var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

				var intersects = raycaster.intersectObjects( bootobjs.children );

				if ( intersects.length > 0 ) {

					controls.enabled = false;

					SELECTED = intersects[ 0 ].object;

					var intersects = raycaster.intersectObject( plane );
					offset.copy( intersects[ 0 ].point ).sub( plane.position );

					container.style.cursor = 'move';
					
					$(".anis").hide();
					$(".shos").hide();
					$("#sho"+INTERSECTED.name).show();
					$("#ani"+INTERSECTED.name).show();
					

					if(index==2)
						for (var i = 0; i < spriteys.length; i++) {
							INTERSECTED.add(spriteys[i]);
				
						}
					selectobj=INTERSECTED;

				}

			}

			function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				if ( INTERSECTED ) {

					plane.position.copy( INTERSECTED.position );

					SELECTED = null;

				}

				container.style.cursor = 'auto';

			}

function pick(event){
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera );

			raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

			var intersects = raycaster.intersectObjects( bootobjs.children );

			if ( intersects.length > 0 ) {

				if ( INTERSECTED != intersects[ 0 ].object ) {

					INTERSECTED = intersects[ 0 ].object;

					//control.attach( INTERSECTED );
					//if(INTERSECTED==ballSprite){
						//console.log(control.swit);
						//control.setMode( "rotate" );
					//}
					$(".anis").hide();
					$(".shos").hide();
					$("#sho"+INTERSECTED.name).show();
					$("#ani"+INTERSECTED.name).show();
					

					if(index==2)
						for (var i = 0; i < spriteys.length; i++) {
							INTERSECTED.add(spriteys[i]);
				
						}
						
				}

			} else {

				if ( INTERSECTED ){

					//control.detach( INTERSECTED );
					INTERSECTED = null;
				}

			}
			selectobj=INTERSECTED;

	}


function animate() {

	requestAnimationFrame(animate);

	render();
	controls.update();
	//control.update();

}

function render() {

	var delta = 0.75 * clock.getDelta();

	if (animation) {
		if (animation.isPlaying)
			THREE.AnimationHandler.update(delta);
	}

	//	obj.rotation.y += ( targetRotation - obj.rotation.y ) * 0.05;
	renderer.render(scene, camera);

}

$(function () {
	document.getElementById('le').style.height = window.innerHeight - 45 + "px";
	document.getElementById('tui1').style.height = document.getElementById('bg1').style.height = document.getElementById('ani1').style.height = document.getElementById('sho1').style.height = window.innerHeight - 185 + "px";
	document.getElementById('bgcon').style.height = window.innerHeight - 220 + "px";
	window.name = "Bencalie";
	$(".listArea li img").click(function () {
		var imgsrc = $(this).attr("src");


				var ims = new Array();
				var texture1 = document.createElement('canvas');
				texture1.width = 128;
				texture1.height = 128;
				var images1 = new Image();
				var ref = new THREE.Texture(ims, new THREE.CubeReflectionMapping());
				ref.format = THREE.RGBFormat;
				ref.flipY = false;
				ref.overdraw = true;

				for (var l = 0; l < 6; l++) {

					var images = new Image();

					images.onload = function () {

						texture1.getContext('2d').drawImage(images, 0, 0, 128, 128);

						var url = texture1.toDataURL("image/png");
						images1.src = url;
						ref.needsUpdate = true;
					};

					images.crossOrigin = '';

					images.src = imgsrc;

					ims.push(images1);

				}

		for (var i = 0; i < bootobjs.children.length;  i++) {

			//if (bootobjs.children[i] instanceof THREE.Mesh || bootobjs.children[i] instanceof THREE.SkinnedMesh) {
				var objs = bootobjs.children[i];
				
				if(objs.material instanceof THREE.MeshFaceMaterial)
					var mats = objs.material.materials;
				else
					var mats = objs.material;
				if (mats)
					for (var mat = 0; mat < mats.length; mat++) {
						if (mats[mat].envMap != null) {
							mats[mat].envMap = ref;
						
						}

					}

			//}
		}
		//console.log(ref);
		selectbg=ref;
		$("#yy").css({
			"background" : "url(" + imgsrc + ") no-repeat center bottom",
			"background-size" : "auto 900px"
		});
	});

	$("#showmenu").click(function () {

		$("#le").fadeToggle(function () {
			if (document.getElementById('le').style.display != "none")
				$("#showmenu").text('隐藏菜单');
			else
				$("#showmenu").text('显示菜单');
		});
	});

	$("#backlist").click(function () {
		//alert("ooo");
		window.location.href="/models";
	});

	var a = $(".bt");
	a.click(function () {
		index = a.index(this);
		//var b = $(".sl>div");
		//	console.log(index);
		//a.eq(index).show().siblings().hide();
		if (index == 0) {
			$(".bg").show();
			$(".ani").hide();
			$(".sho").hide();
			$(".tui").hide();
		}
		if (index == 1) {
			$(".ani").show();
			$(".bg").hide();
			$(".sho").hide();
			$(".tui").hide();
		}
		if (index == 2) {
			$(".sho").show();
			$(".ani").hide();
			$(".bg").hide();
			$(".tui").hide();
		}
		if (index == 3) {
			$(".sho").hide();
			$(".ani").hide();
			$(".bg").hide();
			$(".tui").show();
		}
		if(selectobj!=null)
		if (index == 2) {
			for (var i = 0; i < spriteys.length; i++) {
				selectobj.add(spriteys[i]);
				
			}
		} else {
			for (var i = 0; i < spriteys.length; i++) {
				selectobj.remove(spriteys[i]);
			}
		}
	});

	var addbg = $("#add");
	addbg.click(function () {
		divShow();
	});
	var subbg = $("#sub");
	subbg.click(function () {
		$(".del").fadeToggle();
	});

	function divShow() {
		var bh = $("body").height();
		var bw = $("body").width();
		$("#fullbg").css({
			height : bh,
			width : bw,
			display : "block"
		});
		$("#dialog").show();
	}

	var closedialog = $("#closedialog");
	closedialog.click(function () {
		$("#fullbg,#dialog").hide();
	});

})

$(function () {
	var takePicture = document.querySelector("#take-picture");

	if (takePicture) {
		// Set events
		takePicture.onchange = function (event) {
			//divHide();

			$("#fullbg,#dialog").hide();

			$("#uploadimg").submit();

		}

	}

});
