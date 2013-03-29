
var SKYSIZE = 256;
var SKYCOLOR = new THREE.Color( 0x319ac1 );
var GROUNDCOLOR = new THREE.Color( 0xe6ffff );

Math.clamp = function ( x, low, high ) {
    return Math.min( Math.max( x, low ), high );
}

Math.mix = function ( a, b, alpha ) {
    return new THREE.Color().setRGB(
        a.r * (1 - alpha) + b.r * alpha,
        a.g * (1 - alpha) + b.g * alpha,
        a.b * (1 - alpha) + b.b * alpha
    );
}

var sky = {
    buildMesh: function (){

        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = sky.makeTexture();

        var material = new THREE.ShaderMaterial( {

            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            side: THREE.BackSide

        } );

        return new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), material );

    },

    makeTexture: function () {

        var top = sky.makeGradient( function ( x, y, z ) { return sky.plot( z / Math.sqrt( x*x + y*y + z*z )); } );
        var ground = sky.makeGradient( function ( x, y, z ) { return GROUNDCOLOR; } );
        var horizon = sky.makeGradient( function ( x, y, z ) { return sky.plot( -y / Math.sqrt( x*x + y*y + z*z ) ); } );

        var texture = new THREE.Texture([
            horizon, horizon,
            top, ground,
            horizon, horizon
        ] );
            
        texture.needsUpdate = true;
        return texture;

    },

    plot: function ( sine ) {

        if ( sine < -0.5 ) {
            return GROUNDCOLOR;
        }

        return Math.mix(
            GROUNDCOLOR, 
            SKYCOLOR, 
            Math.clamp( Math.log( 2.0 + sine * 2), 0.0, 1.0 )
        );
    },

    makeGradient: function ( colorFunction ) {

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = SKYSIZE;
        canvas.height = SKYSIZE;

        var image = context.createImageData( canvas.width, canvas.height ); 

        for (x = 0; x < canvas.width; x++)
        for (y = 0; y < canvas.height; y++) {

            base = SKYSIZE*SKYSIZE*4 - (x + y*SKYSIZE + 1)*4;
            ncx = x / SKYSIZE - 0.5;
            ncy = y / SKYSIZE - 0.5;
            ncz = 0.5;

            color = colorFunction( ncx, ncy, ncz );

            image.data[base]   = color.r * 255;
            image.data[base+1] = color.g * 255;
            image.data[base+2] = color.b * 255;
            image.data[base+3] = 255;

        }

        context.putImageData( image, 0, 0 );
        return canvas;
    }
}