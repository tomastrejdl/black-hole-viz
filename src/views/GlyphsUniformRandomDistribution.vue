<template>
  <div>
    <div class="absolute top-4 left-4 bg-gray-100 rounded-lg px-8 py-8">
      <h1 class="flex flex-col text-left">
        <span class="text-xl font-bold">Vizualization of magnetic field near a black hole</span>
        <span class="text-sm">by Tomáš Trejdl</span>
      </h1>
    </div>
    <Renderer ref="renderer" antialias resize="window" orbit-ctrl :alpha="true">
      <Camera ref="camera" :position="{ x: 0, y: -200, z: 200 }" />
      <Scene background="#ffffff">
        <AmbientLight color="#ffffff"></AmbientLight>
        <DirectionalLight
          color="#ffffff"
          :intensity="0.5"
          :position="{ x: -40, y: 100, z: 140 }"
        ></DirectionalLight>

        <InstancedMesh ref="imesh" :count="NUM_INSTANCES">
          <ConeGeometry :radius="coneRadius" :height="coneHeight" :radialSegments="6" />
          <StandardMaterial />
        </InstancedMesh>


        <Sphere v-if="showNullPoint" :radius="2" :position="{
          x: coordinateMultiplier * nullPoint.x,
          y: coordinateMultiplier * nullPoint.y,
          z: coordinateMultiplier * nullPoint.z
        }">
          <StandardMaterial color="#DC2626"/>
        </Sphere>
      </Scene>
    </Renderer>
    <div class="absolute bottom-4 left-4 mr-auto w-min px-8 py-8 bg-gray-100 rounded-lg flex flex-col gap-y-2">
      <div class="flex items-center gap-4">
        <label for="cone-radius" class="w-32 text-left">Cone Radius</label>
        <input name="cone-radius" v-model.number="coneRadius" type="range" min="0.1" max="2" step="0.1"  class="w-32" />
        <div class="w-4">{{coneRadius}}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="cone-height" class="w-32 text-left">Cone Height</label>
        <input name="cone-height" v-model.number="coneHeight" type="range" min="1" max="10" step="0.5"  class="w-32" />
        <div class="w-4">{{coneHeight}}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="density" class="w-32 text-left">Density</label>
        <input name="density" v-model.number="density" type="range" min="1" max="10" step="1" class="w-32" />
        <div class="w-4">{{density}}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="filter-axis" class="w-32 text-left">Filter Axis</label>
        <select name="filter-axis" v-model.number="filterAxis" class="w-32">
          <option value="0">X</option>
          <option value="1">Y</option>
          <option value="2">Z</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <label for="filter-value" class="w-32 text-left">Filter Value</label>
        <input name="filter-value" v-model.number="filterValue" type="range" min="-3" max="3" step="0.1" class="w-32" />
        <div class="w-4">{{filterValue}}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="filter-width" class="w-32 text-left">Filter Width</label>
        <input name="filter-width" v-model.number="filterWidth" type="range" min="0" max="6" step="0.1"  class="w-32" />
        <div class="w-4">{{filterWidth}}</div>
      </div>

      <div class="flex items-center gap-4">
        <SwitchGroup>
          <SwitchLabel class="mr-4">Show null point</SwitchLabel>
          <Switch
            v-model="showNullPoint"
            :class="showNullPoint ? 'bg-gray-300' : 'bg-white'"
            class="relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span class="sr-only">Show null point</span>
            <span
              :class="showNullPoint ? 'translate-x-6' : 'translate-x-1'"
              class="pointer-events-none inline-block w-4 h-4 transform bg-blue-500 rounded-full ring-0 transition ease-in-out duration-200"
            />
          </Switch>
        </SwitchGroup>
      </div>

      <button @click="resetFilters()" class="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400">Reset filters</button>
    </div>
  </div>
</template>

<script>
import { Object3D, Color, Vector3 } from 'three';
import chroma from 'chroma-js';

import { CSVToArray } from '../lib/csv';
import { readDataFromFile } from '../lib/read-from-file';
import { testData } from '../lib/test-data-uniform-random';

import { ref } from 'vue'
import { Switch } from '@headlessui/vue'

export default {
  components: { Switch },
  data: () => ({
    c: 0,
    sign: 1,
    coneRadius: 0.8,
    coneHeight: 2.5,
    density: 5,
    filterAxis: 2,
    filterValue: 0,
    filterWidth: 6,

    coordinateMultiplier: 20,
    showNullPoint: true,
    nullPoint: {
      x: 0.723,
      y: -1.117,
      z: -0.97
    }
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
      .scale(['#EFDE1D', '#209A89', '#430254'])
      .padding([0.01, 0.01])
      .mode('lab')
      .correctLightness()
      .colors(80);

    this.dummy = new Object3D();

    this.parsedData = CSVToArray(testData);

    this.renderer.onBeforeRender(this.updateInstanceMatrix);
  },
  methods: {
    resetFilters() {
      this.coneRadius = 0.8;
      this.coneHeight = 2.5;
      this.density = 5;
      this.filterAxis = 2;
      this.filterValue = 0;
      this.filterWidth = 6;
    },
    updateInstanceMatrix() {
      let index = 0,
        min = 1000,
        max = -1000;
      
      for (let i = 0; i < this.parsedData.length; i += 1) {
          const x = 20 * this.parsedData[i][0];
          const y = 20 * this.parsedData[i][1];
          const z = 20 * this.parsedData[i][2];
          const u = this.parsedData[i][3];
          const v = this.parsedData[i][4];
          const w = this.parsedData[i][5];

          const vector = new Vector3(u, v, w);
          const len = Math.pow(vector.length(), 3);

          this.dummy.scale.set(0, 0, 0);
          if(index % (11-this.density) == 0) {
            if(this.parsedData[i][this.filterAxis] > this.filterValue - this.filterWidth &&
               this.parsedData[i][this.filterAxis] < this.filterValue + this.filterWidth) {
              this.dummy.scale.set(len, len, len);
            }
          }
          this.dummy.position.set(x, y, z);
          this.dummy.rotation.set(
            vector.angleTo(new Vector3(0, 1, 0)) * (180 / Math.PI),
            vector.angleTo(new Vector3(1, 0, 0)) * (180 / Math.PI),
            vector.angleTo(new Vector3(0, 0, 1)) * (180 / Math.PI),
          );
          
          const colorIndex = Math.round(Math.abs(10 * len)) || 0;
          this.imesh.setColorAt(
            index,
            new Color(chroma(this.colors[colorIndex]).css()),
          );
          this.dummy.updateMatrix();
          this.imesh.setMatrixAt(index, this.dummy.matrix);
          
          index++;
      }

      
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
