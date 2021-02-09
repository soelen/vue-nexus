<template>
    <div id="container"></div>
</template>

<script>


import * as Three from 'three';
import {
  scene,
  camera,
} from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as Nexus3D from '../nexus3d/src/Nexus3D'
import { Monitor } from '../nexus3d/src/Monitor'

export default {
  name: 'ThreeComponent',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
    }
  },
  methods: {
    init: function() {
        this.container = document.getElementById('container');

        this.redraw = false;
        this.clock = new Three.Clock();
        this.mouse = new Three.Vector2();
        this.axes = [];

        this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 10);
        this.camera.position.z = 3;

        this.scene = new Three.Scene();
        this.scene.background = new Three.Color( 0xaaaaff );
        this.scene.fog = new Three.Fog( 0x050505, 2000, 3500 );
        this.scene.add( new Three.AmbientLight( 0x444444 ) );

        var light1 = new Three.DirectionalLight( 0xffffff, 1.0 );
        light1.position.set( 1, 1, -1 );
        this.scene.add( light1 );

        var light2 = new Three.DirectionalLight( 0xffffff, 1.0 );
        light2.position.set( -1, -1, 1 );
        this.scene.add( light2 ); 

        this.scene.add(this.mesh);

        this.renderer = new Three.WebGLRenderer({antialias: false });
        this.renderer.setClearColor( this.scene.fog.color );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        let controls_options = {
          rotateSpeed: 0.5,
          zoomSpeed: 4,
          panSpeed: 0.8,
          noZoom: false,
          noPan: false,
          enableDamping: true,
          staticMoving: true,
          dynamicDampingFactor: 0.3,
        }

        this.controls = new OrbitControls( this.camera, this.container );

        this.controls.addEventListener( 'change', function() { this.redraw = true; } );

        var url = "gargo.nxz"; 

        //onUpdate parameter here is used to trigger a redraw
        this.nexus1 = new Nexus3D.Nexus3D(url, this.renderer, { onLoad: this.onNexusLoad, onUpdate: () => { this.redraw = true; }} );


        //create a second instance and position it.
        this.nexus2 = new Nexus3D.Nexus3D(url, this.renderer, { onLoad: this.onNexusLoad, onUpdate: () => { this.redraw = true; }} );
        let monitor = new Monitor( Nexus3D.Cache );
        this.scene.add(this.nexus1);
        this.scene.add(this.nexus2);

        this.renderer.setAnimationLoop( this.onLoop );

    document.addEventListener( 'mousemove', this.onMouseMove, false );
    new ResizeObserver( this.onWindowResize ).observe( this.container);

    },
    onLoop() {
      const delta = this.clock.getDelta()

      this.controls.update(delta);

      if(this.redraw) {
        //during rendering it might be apparent we need another render pass, set it to false BEFORE render
        this.redraw = true; 


        var raycaster = new Three.Raycaster();
        raycaster.setFromCamera( this.mouse, this.camera );


        var intersections = raycaster.intersectObjects( [this.nexus1], true );
        if(intersections.length) {

          this.updateAxes( intersections );
          this.nexus1.material.color =  new Three.Color(1, 0, 0);
          this.nexus1.material.needsUpdate = true;
        } else {
        this.nexus1.material.color =  new Three.Color(1, 1, 1);
        }


        Nexus3D.Cache.beginFrame(30);
        this.renderer.render( this.scene, this.camera );
        Nexus3D.Cache.endFrame();
      }
    },
    updateAxes( intersections ) {
      this.axes.forEach( ( axe, index ) => {

        this.scene.remove( axe );

      } );

      this.axes = [];

      intersections.forEach( intersection => {
        const axe = new Three.AxesHelper( .3 );
        axe.position.set( intersection.point.x, intersection.point.y, intersection.point.z );
        this.axes.push( axe );
        this.scene.add( axe );

      } );
    },
    onWindowResize() {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

      this.redraw = true;
    },
    onMouseMove( event ) {
      event.preventDefault();
      this.mouse.x = ( event.clientX / this.container.offsetWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / this.container.offsetHeight ) * 2 + 1;
    },

    onNexusLoad(nexus) {
      const p   =   nexus.boundingSphere.center.negate();
      const s   = 1/nexus.boundingSphere.radius;
      //nexus.rotateX(-3.1415/2);

      if( nexus == this.nexus1 ) {
        nexus.position.set(p.x*s + 1, p.y*s, p.z*s);
      } else
        nexus.position.set(p.x*s - 1, p.y*s, p.z*s);

      nexus.scale.set(s, s, s); 
      this.redraw = true;
    },
  },
  mounted() {
    this.init();
    this.onWindowResize();
  }
}
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>