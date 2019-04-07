
 ObjectModel = Backbone.Model.extend({

    initialize : function () {

        console.log("model created");

    }});

 ObjectsCollection = Backbone.Collection.extend({

model: ObjectModel,


});

ObjectView = Backbone.View.extend({


     render: function(){

         this.$el.html("uuid : " + this.model.get("uuid") + " ========    "
             + "Name : " + this.model.get("Name")  + "   =========        "
             + "Position : " + this.model.get("Position") + "   =============    "
             + "Rotation : " + this.model.get("Rotation")) ;
         return this;


     }
 });

ObjectsView = Backbone.View.extend({

     render: function () {

         var scope = this;

         this.model.each(function(object){

             var objectView = new ObjectView({model : object});
             scope.$el.append(objectView.render().$el);

         })

     }


 });

//setup scene
var scene = new THREE.Scene();
//setup camera
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1 , 1000);
camera.position.z = 5;
//setup renderer
var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth,window.innerHeight);

//create a canvas
document.body.appendChild(renderer.domElement);
//update the following every time we resize
window.addEventListener('resize',() => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();
})
/*



//transform control
control = new THREE.TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', render );
control.attach( mesh );
scene.add( control );



*/


//define geometry
var geometry =  new THREE.BoxGeometry(1,1,1); //radius,width,height
//define material
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
//define the mesh
var mesh = new THREE.Mesh(geometry,material);
var objectsCollection = new ObjectsCollection();
scene.add(mesh);

//add orbit controls

control = new THREE.OrbitControls( camera, renderer.domElement );
control.update();
control.addEventListener( 'change', render );



//add light

var light = new THREE.PointLight(0xFFFFFF,1,700) //color,intensity,distance
//add light position
light.position.set(10,0,25)

function AddCube() {

    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;
    scene.add(cube);
    camera.lookAt(cube.position);
    //assign attributes to the new model
    var objectModel = new ObjectModel({

        Name : 'cube',
        uuid : cube.uuid,
        Position : '(' + cube.position.x + ',' + cube.position.y + ',' + cube.position.z + ')',
        Rotation : '(' + cube.rotation.x + ',' + cube.rotation.y + ',' + cube.rotation.z + ')',

    });

    //add model to collection instance
    objectsCollection.add(objectModel);

    //assign a view to the model and render
    var objectView = new ObjectView({el: "#container", model : objectModel });
    objectView.render();
    var objectsView = new ObjectsView({el: "#container" , model : objectsCollection});
    objectsView.render();
}
function AddSphere(){

    var mesh = new THREE.Mesh( new THREE.SphereGeometry(0.8,20,20), material);
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;
    scene.add(mesh);
    camera.lookAt(mesh.position);

}

scene.add(light);


var render = function(){
    requestAnimationFrame(render);
    mesh.rotation.x += 0.05;
    renderer.render(scene,camera);
}
render();



