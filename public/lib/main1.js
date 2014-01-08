

var container;

var camera, scene, renderer, animation;

var obj, geometry;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clock = new THREE.Clock();

var spriteys = [];

//init();
//animate();
window.name = "Bencalie";
if(window.name != "Bencalie")
	  {
		  location.reload();
		  window.name = "Bencalie";
	  }
	  else{
		  window.name = "";
	  }
	  url = window.location.href;
	  paras = url.split('/');
	  mid = paras[paras.length-1];
	  
	  init("/models/"+mid+"/"+mid+".js");
	  animate();

function init(modelurl) {
	if (!Detector.webgl)
		Detector.addGetWebGLMessage();

	container = document.createElement('div');
	//container.style.background="#FFCC80 url(bg/1.jpg) no-repeat center center";
	container.setAttribute("id", "yy");
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 30, 50);
	camera.lookAt(new THREE.Vector3(0, 20, 0));

	scene = new THREE.Scene();



	loadmodel(modelurl);
	var ambientLight = new THREE.AmbientLight(0x243C32);
	scene.add(ambientLight);
	var pLight1 = new THREE.PointLight(0x848b93);
	pLight1.position.set(-1100, 410, 370);
	scene.add(pLight1);

	var bgLight = new THREE.PointLight(0x7293a3);
	bgLight.position.set(-30, 300, -1000);
	scene.add(bgLight);

	var spotLight = new THREE.SpotLight(0xfff2e5);
	spotLight.position.set(560, 660, 690);

	//spotLight.castShadow = true;
	//spotLight.shadowCameraNear = 500;
	//	spotLight.shadowCameraFov = 70;
	//spotLight.shadowBias = 0.001;
	//	spotLight.shadowMapWidth = 1024;
	//	spotLight.shadowMapHeight = 1024;
	scene.add(spotLight);
	//renderer = new THREE.CanvasRenderer();
	renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true});
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	document.getElementById("le").addEventListener('mouseover', onCloseContrl, false);
	document.getElementById("le").addEventListener('mouseout', onOpenContrl, false);
	
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);
	controls.minDistance = 10;
	controls.maxDistance = 100;
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI / 2;

}
//	function $( id ) { return document.getElementsByClassName( id ) }

function loadmodel(modelurl){
	//var loader = new THREE.BinaryLoader(true);
	var loader = new THREE.JSONLoader(true);
	//modelurl = "/models/male02/Male02_bin.js";
	loader.load(modelurl, function (geometry, materials) {

		var material3 = new THREE.MeshFaceMaterial(materials);
		if(geometry.empty)
		if (geometry.empty.length!=0) {

			src = "";
			for (var i = 0; i < geometry.empty.length; i++) {

				//	src+='<li><div style="float:left;width:30px;height:100%;background:#0C0">'+geometry.empty[i].index+'</div><div >'+geometry.empty[i].name+'</div></li>';


				var spritey = makeTextSprite(" " + geometry.empty[i].index +":"+ geometry.empty[i].name, {
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
				
				src += '<li onclick="camGotoTar(\'' + spritey.position.x + '\',\'' + spritey.position.y + '\',\'' + spritey.position.z + '\')"><div><div  style="float:left;width:30px;height:100%;background:#4DA45E;text-align: center;text-shadow:none;">' + geometry.empty[i].index + '</div><div class="empty"  >' + geometry.empty[i].name + '</div></div></li>';
			}

			document.getElementById("sho1").innerHTML = '<ul>' + src + '</ul>';

		}
		if(geometry.animations)
		if (geometry.animations.length!=0) {
			for (var i = 0; i < materials.length; i++) {

				var m = materials[i];
				m.skinning = true;

				//m.wrapAround = true;

			}
			var src = "";
			for (var i = 0; i < geometry.animations.length; i++) {
				THREE.AnimationHandler.add(geometry.animations[i]);
				src += '<li class="ba"><div><div style="float:left;width:30px;height:100%;background:#4DA45E;text-align: center;text-shadow:none;">' + i + '</div><div class="empty"  onclick="playAnimation(\'' + geometry.animations[i].name + '\')">' + geometry.animations[i].name + '</div></div></li>';

			}

			document.getElementById("ani1").innerHTML = '<ul>' + src + '</ul>';

			/*var mm = $("#ani1 li");
			mm.click(function(){
			var index = mm.index(this);
			playAnimation(geometry.animations[index]);
			});*/

			obj = new THREE.SkinnedMesh(geometry, material3);
			obj.scale.set(1, 1, 1);
			scene.add(obj);

			obj.castShadow = false;
			obj.receiveShadow = false;

			//	document.getElementById("play").onclick=function(){playAnimation(geometry.animations )};
		} else {

			obj = new THREE.Mesh(geometry, material3);
			obj.scale.set(1, 1, 1);
			scene.add(obj);
			obj.castShadow = false;
			obj.receiveShadow = false;
		}
	});

	}


function onCloseContrl() {

	controls.enabled = false;
}
function onOpenContrl() {
	controls.enabled = true;
}


function makeTextSprite(message, parameters) {
	if (parameters === undefined)
		parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 0;

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

	//var spriteAlignment = parameters.hasOwnProperty("alignment") ?
	//	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

	var spriteAlignment = THREE.SpriteAlignment.topLeft;

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
			useScreenCoordinates : false,
			alignment : spriteAlignment
		});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(10, 5, 1.0);
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

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = (window.innerWidth) / window.innerHeight;
	camera.updateProjectionMatrix();

	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('le').style.height=window.innerHeight-45+"px";
	document.getElementById('bg1').style.height=document.getElementById('ani1').style.height=document.getElementById('sho1').style.height=window.innerHeight-145+"px";
    document.getElementById('bgcon').style.height=window.innerHeight-180+"px";

}

function camGotoTar(x, y, z) {
	//console.log(x);
	controls.target = new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
}


function playAnimation(animator) {
	

	if (animation)
		if (animation.isPlaying)
			animation.stop();

	animation = new THREE.Animation(obj, animator, THREE.AnimationHandler.LINEAR);
	animation.JITCompile = false;
	//animation.interpolationType = THREE.AnimationHandler.LINEAR;

	animation.play(false, 0);
	


}
//

function animate() {

	requestAnimationFrame(animate);

	render();
	controls.update();

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
			document.getElementById('le').style.height=window.innerHeight-45+"px";
			document.getElementById('bg1').style.height=document.getElementById('ani1').style.height=document.getElementById('sho1').style.height=window.innerHeight-145+"px";
            document.getElementById('bgcon').style.height=window.innerHeight-180+"px";

			$(".listArea li img").click(function () {
				var imgsrc = $(this).attr("src");
				$("#yy").css({
					"background" : "url(" + imgsrc + ") no-repeat center bottom",
					"background-size" : "auto 900px"
				});
			});
			
			
			$("#showmenu").click(function () {

                $("#le").fadeToggle(function(){
                    if (document.getElementById('le').style.display!="none")
                        $("#showmenu").text('隐藏菜单');
                    else
                        $("#showmenu").text('显示菜单');
                });
			});
			


			var a = $(".bt");
			a.click(function () {
				var index = a.index(this);
				//var b = $(".sl>div");
			//	console.log(index);
				//a.eq(index).show().siblings().hide();
				if (index == 0) {
					$(".bg").show();
					$(".ani").hide();
					$(".sho").hide();
				}
				if (index == 1) {
					$(".ani").show();
					$(".bg").hide();
					$(".sho").hide();
				}
				if (index == 2) {
					$(".sho").show();
					$(".ani").hide();
					$(".bg").hide();
				}
				if (index == 2) {
					for (var i = 0; i < spriteys.length; i++) {
						scene.add(spriteys[i]);
					}
				} else {
					for (var i = 0; i < spriteys.length; i++) {
						scene.__removeObject(spriteys[i]);
					}
				}
			});
			
			var addbg =$("#add");
			addbg.click(function(){
				divShow();
				});
			var subbg =$("#sub");
			subbg.click(function(){
				$(".del").fadeToggle();
				});
			
		function divShow(){
		  var bh = $("body").height();
		  var bw = $("body").width();
		  $("#fullbg").css({height:bh,width:bw,display:"block"});
		  $("#dialog").show();
		}
		
		var closedialog=$("#closedialog");
		closedialog.click(function (){
			 $("#fullbg,#dialog").hide();	
		});

    var takePicture = document.querySelector("#take-picture");
       

    if (takePicture ) {
        // Set events
        takePicture.onchange = function (event) {
			//divHide();

			 $("#fullbg,#dialog").hide();
           
			 $("#uploadimg").submit();
					
                }
               
       
            }
console.log($(".empty"));
	$(".empty").click(function(){
	
	  $("*").removeClass("dark");
	  $(this).addClass("dark");
	  
	});
  
});
		
		


