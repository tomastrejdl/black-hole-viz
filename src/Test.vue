<template>
  <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
    <Camera ref="camera" :position="{ y: -400, z: 100 }" />
    <Scene background="#ffffff">
      <AmbientLight color="#ffffff"></AmbientLight>
      <!-- <PointLight color="#ffffff" :position="{ y: 50, z: 0 }"></PointLight> -->
      <!-- <PointLight color="#ffffff" :position="{ y: -50, z: 0 }"></PointLight> -->
      <!-- <PointLight color="#ffffff" :position="{ y: 0, z: 0 }"></PointLight> -->

      <InstancedMesh ref="imesh" :count="NUM_INSTANCES">
        <SphereGeometry :size="SIZE" />
        <StandardMaterial />
      </InstancedMesh>
    </Scene>
  </Renderer>
</template>

<script>
import { Object3D, Color } from 'three';
import chroma from 'chroma-js';

export default {
  data: () => ({
    c: 0,
    sign: 1,
  }),
  setup() {
    const SIZE = 1.6,
      NX = 100,
      NY = 100,
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
      .scale(['yellow', 'navy'])
      .padding([0.05, 0])
      .mode('lab')
      .correctLightness()
      .colors(7000);

    this.dummy = new Object3D();
    // this.updateInstanceMatrix();
    this.renderer.onBeforeRender(this.updateInstanceMatrix);
  },
  methods: {
    updateInstanceMatrix() {
      if (this.c >= 10) this.sign = -1;
      if (this.c <= 2) this.sign = 1;
      this.c += this.sign;

      const x0 = -this.W / 2 + this.PADDING;
      const y0 = -this.H / 2 + this.PADDING;
      const z0 = -this.D / 2 + this.PADDING;
      let x,
        y,
        z,
        index = 0;
      for (let i = 0; i < this.NX; i++) {
        for (let j = 0; j < this.NY; j++) {
          for (let k = 0; k < this.NZ; k++) {
            x = x0 + i * this.SIZEP;
            y = y0 + j * this.SIZEP;
            // z = z0 + k * this.SIZEP;
            const maxZ = 100_000;
            if (i < this.NX / 2) {
              if (j < this.NY / 2) z = (i * i * j * j) / maxZ;
              else z = (i * i * (this.NY - j) * (this.NY - j)) / maxZ;
            } else {
              if (j < this.NY / 2)
                z = ((this.NX - i) * (this.NX - i) * j * j) / maxZ;
              else
                z =
                  ((this.NX - i) *
                    (this.NX - i) *
                    (this.NY - j) *
                    (this.NY - j)) /
                  maxZ;
            }

            // z = z - (this.c / 10) * z;

            this.dummy.position.set(x, y, z);
            this.dummy.updateMatrix();
            this.imesh.setMatrixAt(index, this.dummy.matrix);
            this.imesh.setColorAt(
              index,
              new Color(chroma(this.colors[Math.round(z * 100)]).css()),
            );
            index++;
          }
        }
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
