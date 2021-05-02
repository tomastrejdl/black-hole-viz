<template>
  <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
    <Camera ref="camera" :position="{ y: -400, z: 100 }" />
    <Scene background="#ffffff">
      <AmbientLight color="#ffffff"></AmbientLight>
      <DirectionalLight
        color="#ffffff"
        :intensity="0.5"
        :position="{ x: -40, y: 100, z: 140 }"
      ></DirectionalLight>

      <InstancedMesh ref="imesh" :count="NUM_INSTANCES">
        <ConeGeometry :radius="SIZE / 2" :height="2" :radialSegments="4" />
        <StandardMaterial />
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D, Color, Vector3 } from 'three';
import chroma from 'chroma-js';

import { CSVToArray } from '../lib/csv';
import { readDataFromFile } from '../lib/read-from-file';
import { testData } from '../lib/test-data';

export default {
  data: () => ({
    c: 0,
    sign: 1,
  }),
  setup() {
    const SIZE = 1.6,
      NX = 50,
      NY = 50,
      NZ = 1,
      PADDING = 2;
    const SIZEP = SIZE + PADDING;
    const W = NX * SIZEP - PADDING;
    const H = NY * SIZEP - PADDING;
    const D = NZ * SIZEP - PADDING;

    return {
      SIZE,
      NX,
      NY,
      NZ,
      PADDING,
      SIZEP,
      W,
      H,
      D,
      NUM_INSTANCES: NX * NY * NZ,
    };
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.size = this.renderer.three.size;
    this.pointer = this.renderer.three.pointer;
    this.imesh = this.$refs.imesh.mesh;

    this.colors = chroma
      .scale(['blue', 'red'])
      .padding([0.05, 0])
      .mode('lab')
      .correctLightness()
      .colors(64);

    this.dummy = new Object3D();

    this.updateInstanceMatrix();
  },
  methods: {
    updateInstanceMatrix() {
      let index = 0,
        min = 1000,
        max = -1000;
      const parsedData = CSVToArray(testData);
      for (let i = 0; i < parsedData.length; i += 1) {
        const x = 30 * parsedData[i][0];
        const y = 30 * parsedData[i][1];
        const z = 30 * parsedData[i][2];
        const u = parsedData[i][3];
        const v = parsedData[i][4];
        const w = parsedData[i][5];

        const vector = new Vector3(u, v, w);
        const len = Math.pow(vector.length(), 3);

        this.dummy.scale.set(len, len, len);
        this.dummy.position.set(x, y, z);
        this.dummy.rotation.set(
          vector.angleTo(new Vector3(1, 0, 0)) * (180 / Math.PI),
          vector.angleTo(new Vector3(0, 1, 0)) * (180 / Math.PI),
          vector.angleTo(new Vector3(0, 0, 1)) * (180 / Math.PI),
        );

        this.dummy.updateMatrix();
        this.imesh.setMatrixAt(index, this.dummy.matrix);
        const colorIndex = Math.round(Math.abs(10 * len)) || 0;
        if (colorIndex > max) max = colorIndex;
        if (colorIndex < min) min = colorIndex;
        this.imesh.setColorAt(
          index,
          new Color(chroma(this.colors[colorIndex]).css()),
        );
        index++;
      }
      console.log('min: ', min, '\nmax: ', max);
      this.imesh.instanceMatrix.needsUpdate = true;
      this.imesh.instanceColor.needsUpdate = true;
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
}
</style>
