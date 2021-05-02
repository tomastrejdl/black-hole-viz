<template>
  <div class="w-full h-full">
    <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
      <Camera ref="camera" :position="{ x: -40, y: 100, z: 140 }" />
      <Scene background="#333">
        <AmbientLight color="#ffffff"></AmbientLight>
        <!-- <DirectionalLight
          color="#ffffff"
          :intensity="10"
          :position="{ x: -40, y: 100, z: 140 }"
        ></DirectionalLight>
        <DirectionalLight
          color="#ffffff"
          :intensity="10"
          :position="{ x: 40, y: 100, z: 140 }"
        ></DirectionalLight> -->

        <InstancedMesh ref="imesh" :count="1342">
          <ConeGeometry :radius="0.5" :height="2" :radialSegments="4" />
          <ShaderMaterial
            :fragmentShader="fragmentShader"
            :vertexShader="vertexShader"
            :uniforms="uniforms"
          />
        </InstancedMesh>
      </Scene>
    </Renderer>
  </div>
</template>

<script>
import {
  Object3D,
  Vector3,
  Color,
  InstancedBufferAttribute,
  Uniform,
} from 'three';
import dat from 'dat.gui';
import chroma from 'chroma-js';

import { CSVToArray } from '../lib/csv';
import { readDataFromFile } from '../lib/read-from-file';

export default {
  data: () => ({
    parsedData: [],
    fragmentShader: `
varying vec3 vColor;

  void main(){
    vec3 color = vColor;
    gl_FragColor = vec4(color, 1.);
  }
`,
    vertexShader: `
attribute vec3 aColor;
varying vec3 vColor;

  void main(){
    vColor = aColor;
  }
`,
    uniforms: { uScale: new Uniform(1) },
  }),
  mounted() {
    this.renderer = this.$refs.renderer;
    this.size = this.renderer.three.size;
    this.pointer = this.renderer.three.pointer;
    this.imesh = this.$refs.imesh.mesh;
    this.geometry = this.$refs.imesh.geometry;
    this.camera = this.$refs.camera.camera;

    console.log(this.geometry);
    this.colors = chroma
      .scale(['yellow', 'navy'])
      .padding([0.05, 0])
      .mode('lab')
      .correctLightness()
      .colors(1342);

    const aColor = [];
    this.colors.forEach((color) => {
      const c = new Color(chroma(color).css());
      aColor.push(c.r, c.g, c.b);
    });

    const typedArr = new Float32Array(aColor);

    console.log(typedArr);

    this.geometry.setAttribute(
      'aColor',
      new InstancedBufferAttribute(typedArr, 3, false),
    );

    // Options to be added to the GUI
    var options = {
      reset: () => {
        this.camera.position.x = -40;
        this.camera.position.y = 100;
        this.camera.position.z = 140;
      },
    };

    // DAT.GUI Related Stuff
    // var gui = new dat.GUI();

    // var cam = gui.addFolder('Camera');
    // cam
    //   .add(this.camera.position, 'x', -300, 300)
    //   .onChange((val) => (this.camera.position.x = val));
    // cam
    //   .add(this.camera.position, 'y', -300, 300)
    //   .onChange((val) => (this.camera.position.y = val));
    // cam
    //   .add(this.camera.position, 'z', -300, 300)
    //   .onChange((val) => (this.camera.position.z = val));
    // cam.open();

    // gui.add(options, 'reset');

    this.dummy = new Object3D();

    readDataFromFile('mag_every_100000th_line.csv')
      .then((response) => response.text())
      .then((response) => {
        this.parsedData = CSVToArray(response, ',');
        this.updateInstanceMatrix();
        // this.renderer.onBeforeRender(this.updateInstanceMatrix);
      });
  },
  methods: {
    updateInstanceMatrix() {
      let min = 512,
        max = -512;
      for (let i = 0; i < this.parsedData.length; i += 1) {
        const vector = new Vector3(
          this.parsedData[i][3],
          this.parsedData[i][4],
          this.parsedData[i][5],
        );

        const scale = Math.pow(vector.length(), 2);
        if (scale < min) min = scale;
        if (scale > max) max = scale;
        this.dummy.scale.set(scale, scale, scale);

        this.dummy.position.set(
          10 * this.parsedData[i][0],
          10 * this.parsedData[i][1],
          10 * this.parsedData[i][2],
        );
        this.dummy.rotation.set(
          vector.angleTo(new Vector3(1, 0, 0)) * (180 / Math.PI),
          vector.angleTo(new Vector3(0, 1, 0)) * (180 / Math.PI),
          vector.angleTo(new Vector3(0, 0, 1)) * (180 / Math.PI),
        );

        this.dummy.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummy.matrix);
        // console.log(
        //   'at: ',
        //   i,
        //   new Color(
        //     chroma(
        //       this.colors[Math.round(Math.pow(this.parsedData[i][2] || 0, 2))],
        //     ).css(),
        //   ),
        //   chroma(
        //     this.colors[Math.round(Math.pow(this.parsedData[i][2] || 0, 2))],
        //   ).css(),
        //   this.colors[Math.round(Math.pow(this.parsedData[i][2], 2))],
        //   this.parsedData[i][2],
        // );
        // this.imesh.setColorAt(i, new Color('rgb(1, 128, 255)'));
        // const color = new Color();
        // this.imesh.getColorAt(i, color);
        // console.log(color.r, color.g, color.b);
      }
      // console.log('min: ', min, '\nmax: ', max);
      this.imesh.instanceMatrix.needsUpdate = true;
      // this.imesh.instanceColor.needsUpdate = true;
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
}
</style>
