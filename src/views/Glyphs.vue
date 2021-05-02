<template>
  <div class="w-full h-full">
    <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
      <Camera ref="camera" :position="{ x: -40, y: 100, z: 140 }" />
      <Scene background="#ffffff">
        <AmbientLight color="#ffffff"></AmbientLight>
        <DirectionalLight
          color="#ffffff"
          :intensity="10"
          :position="{ x: -40, y: 100, z: 140 }"
        ></DirectionalLight>
        <DirectionalLight
          color="#ffffff"
          :intensity="10"
          :position="{ x: 40, y: 100, z: 140 }"
        ></DirectionalLight>

        <InstancedMesh ref="imesh" :count="2000">
          <ConeGeometry :radius="0.5" :height="2" :radialSegments="4" />
          <StandardMaterial vertex-colors />
        </InstancedMesh>
      </Scene>
    </Renderer>
  </div>
</template>

<script>
import { Object3D, Vector3, Color } from 'three';
import dat from 'dat.gui';
import chroma from 'chroma-js';

import { CSVToArray } from '../lib/csv';
import { readDataFromFile } from '../lib/read-from-file';

export default {
  data: () => ({
    parsedData: [],
    colors: [],
  }),
  mounted() {
    this.renderer = this.$refs.renderer;
    this.size = this.renderer.three.size;
    this.pointer = this.renderer.three.pointer;
    this.imesh = this.$refs.imesh.mesh;
    this.camera = this.$refs.camera.camera;

    this.colors = chroma
      .scale(['blue', 'red'])
      // .padding([0.05, 0])
      // .mode('lab')
      // .correctLightness()
      .colors(100);

    console.log(this.colors);

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
      });

    // this.renderer.onBeforeRender(this.updateInstanceMatrix);
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

        if (i == 0) {
          console.log(Math.round(vector.length()));

          console.log('angle to x: ', vector.angleTo(new Vector3(1, 0, 0)));
          console.log('angle to y: ', vector.angleTo(new Vector3(0, 1, 0)));
          console.log('angle to z: ', vector.angleTo(new Vector3(0, 0, 1)));
        }

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

        const colorIndex = Math.round(10 * vector.length()) || 0;
        this.imesh.setColorAt(
          i,
          new Color(chroma(this.colors[colorIndex]).css()),
        );
      }
      console.log('min: ', min, '\nmax: ', max);
      this.imesh.instanceMatrix.needsUpdate = true;
      this.imesh.instanceColor.needsUpdate = true;
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
canvas {
  display: block;
}
</style>
