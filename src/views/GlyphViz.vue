<template>
  <div>
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
          <ConeGeometry
            :radius="coneRadius"
            :height="coneHeight"
            :radialSegments="6"
          />
          <StandardMaterial :transparent="true" :opacity="coneOpacity" />
        </InstancedMesh>

        <Sphere
          v-if="nullPoint && showNullPoint"
          :radius="2"
          :position="{
            x: coordinateMultiplier * nullPoint.x,
            y: coordinateMultiplier * nullPoint.y,
            z: coordinateMultiplier * nullPoint.z,
          }"
        >
          <StandardMaterial color="#DC2626" />
        </Sphere>
      </Scene>
    </Renderer>

    <div
      v-if="showFilters"
      class="absolute bottom-0 sm:bottom-4 left-0 sm:left-4 mr-auto w-full sm:w-min px-4 sm:px-10 py-4 sm:py-8 bg-opacity-50 backdrop-filter backdrop-blur-sm sm:bg-opacity-100 bg-gray-100 sm:rounded-lg flex flex-col gap-y-4 sm:gap-y-2 z-20 transition-transform ease-in-out duration-200"
    >
      <button @click="showFilters = false" class="sm:hidden mx-auto px-6 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div class="flex items-center gap-4">
        <label for="cone-radius" class="w-32 text-left">Cone Radius</label>
        <input
          name="cone-radius"
          v-model.number="coneRadius"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          class="w-32"
        />
        <div class="w-4">{{ coneRadius }}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="cone-height" class="w-32 text-left">Cone Height</label>
        <input
          name="cone-height"
          v-model.number="coneHeight"
          type="range"
          min="1"
          max="10"
          step="0.5"
          class="w-32"
        />
        <div class="w-4">{{ coneHeight }}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="cone-opacity" class="w-32 text-left">Cone Opacity</label>
        <input
          name="cone-opacity"
          v-model.number="coneOpacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="w-32"
        />
        <div class="w-4">{{ coneOpacity }}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="density" class="w-32 text-left">Density</label>
        <input
          name="density"
          v-model.number="density"
          type="range"
          min="1"
          max="10"
          step="1"
          class="w-32"
        />
        <div class="w-4">{{ density }}</div>
      </div>

      <Listbox v-model.number="filterAxis" as="div" class="flex items-center gap-4">
        <ListboxLabel class="w-32 text-left">Filter axis:</ListboxLabel>
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-32 py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
          >
            <span class="block truncate">{{
              axes.find((a) => a.value == filterAxis).name
            }}</span>
            <span
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="axis in axes"
                :key="axis.value"
                :value="axis.value"
                as="template"
              >
                <li
                  :class="[
                    active ? 'text-blue-900 bg-blue-100' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-10 pr-4',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate text-left',
                    ]"
                    >{{ axis.name }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>

      <div class="flex items-center gap-4">
        <label for="filter-value" class="w-32 text-left">Filter Value</label>
        <input
          name="filter-value"
          v-model.number="filterValue"
          type="range"
          min="-3"
          max="3"
          step="0.1"
          class="w-32"
        />
        <div class="w-4">{{ filterValue }}</div>
      </div>

      <div class="flex items-center gap-4">
        <label for="filter-width" class="w-32 text-left">Filter Width</label>
        <input
          name="filter-width"
          v-model.number="filterWidth"
          type="range"
          min="0"
          max="6"
          step="0.1"
          class="w-32"
        />
        <div class="w-4">{{ filterWidth }}</div>
      </div>

      <div v-if="nullPoint" class="flex items-center gap-4">
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

      <button
        @click="resetFilters()"
        class="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
      >
        Reset filters
      </button>
    </div>

    <button
      v-if="!showFilters"
      @click="showFilters = true"
      class="sm:hidden absolute bottom-4 left-4 mx-auto px-6 py-2 bg-gray-200 rounded-lg"
    >
      Show filters
    </button>
  </div>
</template>

<script>
import { Object3D, Color, Vector3 } from 'three';
import chroma from 'chroma-js';
import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue';

import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';

import { CSVToArray } from '../lib/csv-to-array';

export default {
  components: {
    Switch,
    SwitchLabel,
    SwitchGroup,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },
  props: {
    vectorFieldData: {
      type: String,
      required: true,
    },
    nullPoint: {
      type: Object,
    },
    colorScale: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    c: 0,
    sign: 1,

    coneRadius: 0.8,
    coneHeight: 2.5,
    coneOpacity: 1,

    density: 5,
    filterAxis: 2,
    filterValue: 0,
    filterWidth: 6,

    coordinateMultiplier: 20,
    showNullPoint: true,

    showFilters: false,
    axes: [
      {
        name: 'X',
        value: 0,
      },
      {
        name: 'Y',
        value: 1,
      },
      {
        name: 'Z',
        value: 2,
      },
    ],
  }),
  created() {
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
  },
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
      .scale(this.colorScale)
      .padding([0.01, 0.01])
      .mode('lab')
      .correctLightness()
      .colors(80);

    this.dummy = new Object3D();

    this.parsedData = CSVToArray(this.vectorFieldData);

    this.renderer.onBeforeRender(this.updateInstanceMatrix);
  },
  methods: {
    resizeHandler() {
      this.showFilters = window.innerWidth >= 640;
    },
    resetFilters() {
      this.coneRadius = 0.8;
      this.coneHeight = 2.5;
      this.coneOpacity = 1;

      this.density = 5;
      this.filterAxis = 2;
      this.filterValue = 0;
      this.filterWidth = 6;

      this.showNullPoint = true;
    },
    updateInstanceMatrix() {
      let index = 0;

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
        if (index % (11 - this.density) == 0) {
          if (
            this.parsedData[i][this.filterAxis] >
              this.filterValue - this.filterWidth &&
            this.parsedData[i][this.filterAxis] <
              this.filterValue + this.filterWidth
          ) {
            this.dummy.scale.set(len, len, len);
          }
        }
        this.dummy.position.set(x, y, z);
        this.dummy.rotation.set(
          vector.angleTo(new Vector3(1, 0, 0)) * (180 / Math.PI),
          vector.angleTo(new Vector3(0, 1, 0)) * (180 / Math.PI),
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
