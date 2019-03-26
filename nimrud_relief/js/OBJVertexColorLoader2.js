/**
* An OBJ loader that loads in vertex colors and vertex normals
* All credit goes to mrdoob and sean bradley for creating the OBJVertexColorLoader
* I just add some additional functionality so that the loader was able to load
* vertex normals as well
*/

/**
 * @author mrdoob / http://mrdoob.com/
 * @author sean bradley / https://www.youtube.com/user/seanwasere
 */

THREE.OBJVertexColorLoader2 = function (manager) {
    this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
    this.materials = null;
};

THREE.OBJVertexColorLoader2.prototype = {
    constructor: THREE.OBJVertexColorLoader,

    load: function (url, onLoad, onProgress, onError) {

        var scope = this;

        var loader = new THREE.XHRLoader(scope.manager);

        loader.setPath(this.path);

        loader.load(url, function (text) {

            onLoad(scope.parse(text));

        }, onProgress, onError);
    },

    setPath: function (value) {
        this.path = value;
    },

    parse: function (text) {
        var container = new THREE.Group();
        var geometry = new THREE.Geometry();
        var vertices = [];
        var vertexColors = [];
        var faces = [];

        var normals = [];
        var faceNormals = [];

        // v float float float float float float (vertex with rgb) 
        var vertex_colour_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        // f vertex vertex vertex ...
        // var face_pattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/;
        // f vertex//vn  vertex//vn vertex//vn
        var face_pattern1 = /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+))?/;

        // vn float float float
        var vertex_normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

        var lines = text.split('\n');

        for (var i = 0; i < lines.length; i++) {
            
            var line = lines[i];
            line = line.trim();
            var result;

            if (line.length === 0 || line.charAt(0) === '#') {
                continue;
            } else if ((result = vertex_colour_pattern.exec(line)) !== null) {
                vertices.push(
                    new THREE.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]))
                );
                vertexColors.push(new THREE.Color(parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6])));
            } else if ((result = face_pattern1.exec(line)) !== null) {
                faces.push(new THREE.Face3(result[1] - 1, result[3] - 1, result[5] - 1));
                faceNormals.push(new THREE.Vector3(result[2] - 1, result[4] - 1, result[6] - 1));
            } else if ((result = vertex_normal_pattern.exec(line)) !== null) {
                normals.push(new THREE.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
            }
        }

        for (var i = 0; i < vertices.length; i++) {
            geometry.vertices.push(vertices[i]);
        }
        for (var i = 0; i < faces.length; i++) {
            // Set each vertex color of the face to be the corresponding vertex color (faces[i].a/b/c is a vertex index)
            faces[i].vertexColors[0] = vertexColors[faces[i].a];
            faces[i].vertexColors[1] = vertexColors[faces[i].b];
            faces[i].vertexColors[2] = vertexColors[faces[i].c];

            faces[i].vertexNormals[0] = normals[faceNormals[i].x];
            faces[i].vertexNormals[1] = normals[faceNormals[i].y];
            faces[i].vertexNormals[2] = normals[faceNormals[i].z];

            geometry.faces.push(faces[i]);
        }

        // console.log(normals)


        // Toon shading:
        // var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

        // Standard lambertian shading:
        // var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors });

        // PBR shading
        var material = new THREE.MeshStandardMaterial( {

            // color: 0x888888,
            roughness: 0.8,
            metalness: 0.1,

            // normalMap: normalMap,
            // normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

            // aoMap: aoMap,
            // aoMapIntensity: 1,

            // displacementMap: displacementMap, // a jpg
            // displacementScale: settings.displacementScale,
            // displacementBias: - 0.428408, // from original model

            // envMap: reflectionCube,
            // envMapIntensity: settings.envMapIntensity,

            side: THREE.DoubleSide, // render both sides of faces

            vertexColors: THREE.VertexColors

        } );


        var mesh = new THREE.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        container.add(mesh);

        return container;
    }
};
