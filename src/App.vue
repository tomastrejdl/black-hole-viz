<template>
  <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
    <Camera ref="camera" :position="{ x: -40, y: 100, z: 140 }" />
    <Scene background="#ffffff">
      <AmbientLight color="#ffffff"></AmbientLight>
      <PointLight color="#ffffff" :position="{ y: 50, z: 0 }"></PointLight>

      <InstancedMesh ref="imesh" :count="1048576">
        <ConeGeometry :radius="0.5" :height="2" :radialSegments="4" />
        <StandardMaterial color="#333" />
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D } from 'three';
import dat from 'dat.gui';

import { CSVToArray } from './utils/csv';
import { testData } from './utils/test-data';
import { readDataFromFile } from './utils/read-from-file';

export default {
  data: () => ({
    parsedData: [],
  }),
  mounted() {
    this.renderer = this.$refs.renderer;
    this.size = this.renderer.three.size;
    this.pointer = this.renderer.three.pointer;
    this.imesh = this.$refs.imesh.mesh;
    this.camera = this.$refs.camera.camera;

    // Options to be added to the GUI
    var options = {
      reset: () => {
        this.camera.position.x = -40;
        this.camera.position.y = 100;
        this.camera.position.z = 140;
      },
    };

    // DAT.GUI Related Stuff
    var gui = new dat.GUI();

    var cam = gui.addFolder('Camera');
    cam
      .add(this.camera.position, 'x', -300, 300)
      .onChange((val) => (this.camera.position.x = val));
    cam
      .add(this.camera.position, 'y', -300, 300)
      .onChange((val) => (this.camera.position.y = val));
    cam
      .add(this.camera.position, 'z', -300, 300)
      .onChange((val) => (this.camera.position.z = val));
    cam.open();

    gui.add(options, 'reset');

    this.dummy = new Object3D();

    readDataFromFile()
      .then((response) => response.text())
      .then((response) => {
        this.parsedData = CSVToArray(response, ',');
        this.updateInstanceMatrix();
      });

    // this.renderer.onBeforeRender(this.updateInstanceMatrix);
  },
  methods: {
    updateInstanceMatrix() {
      for (let i = 0; i < this.parsedData.length; i += 200) {
        this.dummy.position.set(
          10 * this.parsedData[i][0],
          10 * this.parsedData[i][1],
          10 * this.parsedData[i][2],
        );
        this.dummy.rotation.set(
          this.parsedData[i][3],
          this.parsedData[i][4],
          this.parsedData[i][5],
        );
        this.dummy.updateMatrix();
        this.imesh.setMatrixAt(i, this.dummy.matrix);
      }
      this.imesh.instanceMatrix.needsUpdate = true;
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
