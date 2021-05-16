<template>
  <div class="w-screen h-screen overflow-hidden">
     <div class="absolute top-4 left-4 bg-gray-100 rounded-lg px-10 py-8">
      <h1 class="flex flex-col text-left">
        <span class="text-xl font-bold">Vizualization of magnetic field near a black hole</span>
        <span class="text-sm">by Tomáš Trejdl</span>
      </h1>
      <div class="flex items-center gap-4 mt-4">
        <label for="filter-axis" class="font-bold">Field to display</label>
        <select name="filter-axis" v-model="selectedField" class="w-32">
          <option value="el">Electic</option>
          <option value="mag">Magnetic</option>
        </select>
      </div>
      <!-- <div class="flex items-center gap-4">
        <label for="filter-axis" class="w-32 text-left">Dataset</label>
        <select name="filter-axis" v-model="selectedDataSet" class="w-32">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div> -->
    </div>

    <GlyphViz
      :vectorFieldData="datasets[selectedDataSet][selectedField].vectorFieldData"
      :nullPoint="datasets[selectedDataSet][selectedField].nullPoint"
      :colorScale="colorScales[selectedField]"
      :key="selectedDataSet+selectedField"
    />

    <div :class="(showHelp ? 'px-10 pt-8 pb-16 bg-gray-100 rounded-lg' : 'rounded-full w-12 h-12 flex justify-center items-center') + ' absolute bottom-4 right-4 bg-gray-200 transition-all ease-in-out duration-200'">
      <button v-if="!showHelp" class="w-full h-full rouded-full focus:outline-none" @click="showHelp = true">
        <span class="font-bold text-2xl text-gray-600">?</span>
      </button>

      <div v-if="showHelp" :class="(showHelp ? 'scale-100': 'scale-0') + ' transform transition-transform ease-in-out duration-200 delay-200'">
        <div class="flex items-center gap-2">
          Left
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
          to rotate
        </div>

        <div class="flex items-center gap-2">
          Right
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
          to pan
        </div>

        <div class="flex items-center gap-2">
          Scroll
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="2" width="12" height="20" rx="6" stroke="currentColor" stroke-width="2"/><path d="M12 10.5V7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          to zoom
        </div>
      </div>

      <button v-if="showHelp" class="absolute bottom-4 right-4 self-end p-1 mt-4 rounded-full focus:outline-none" @click="showHelp = false">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

  </div>
</template>

<script>
import GlyphViz from './views/GlyphViz.vue';

import { vectorFieldData as vectorFieldDataEl1, nullPoint as nullPointEl1 } from '../data/el_1_subset';
import { vectorFieldData as vectorFieldDataMag1, nullPoint as nullPointMag1} from '../data/mag_1_subset';
import { vectorFieldData as vectorFieldDataEl2, nullPoint as nullPointEl2 } from '../data/el_2_subset';
import { vectorFieldData as vectorFieldDataMag2, nullPoint as nullPointMag2} from '../data/mag_2_subset';

export default {
  components: {GlyphViz},
  data: () => ({
    datasets: {
      '1': {
        el:{
          vectorFieldData: vectorFieldDataEl1,
          nullPoint: nullPointEl1
        },
        mag: {
          vectorFieldData: vectorFieldDataMag1,
          nullPoint: nullPointMag1
        }
      },
      '2': {
        el:{
          vectorFieldData: vectorFieldDataEl2,
          nullPoint: nullPointEl2
        },
        mag: {
          vectorFieldData: vectorFieldDataMag2,
          nullPoint: nullPointMag2
        }
      }
    },
    selectedField: 'el',
    selectedDataSet: '1',
    showHelp: false,
    colorScales: {
      el: ['#EFDE1D', '#209A89', '#430254'],
      mag: ['#2563EB', '#B91C1C']
    }
  })
}
</script>
