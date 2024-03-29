<template>
  <div class="w-screen h-screen overflow-hidden">
    <div
      class="absolute top-0 sm:top-4 left-0 sm:left-4 w-full sm:w-auto sm:bg-gray-100 sm:rounded-lg px-4 sm:px-10 py-4 sm:py-8"
    >
      <h1 class="flex flex-col text-left">
        <span class="sm:text-xl font-bold"
          >Vizualization of magnetic field near a black hole</span
        >
        <span class="text-sm">by Tomáš Trejdl</span>
      </h1>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center sm:gap-4 mt-4"
      >
        <Listbox v-model="selectedField">
          <ListboxLabel>Field to display:</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-32 py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
            >
              <span class="block truncate">{{
                fields.find((f) => f.value == selectedField).name
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
                  v-for="field in fields"
                  :key="field.value"
                  :value="field.value"
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
                      >{{ field.name }}</span
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
      :vectorFieldData="
        datasets[selectedDataSet][selectedField].vectorFieldData
      "
      :nullPoint="datasets[selectedDataSet][selectedField].nullPoint"
      :colorScale="colorScales[selectedField]"
      :key="selectedDataSet + selectedField"
    />

    <div
      :class="
        (showHelp
          ? 'px-10 pt-8 pb-16 bg-gray-100 rounded-lg'
          : 'rounded-full w-12 h-12 flex justify-center items-center') +
          ' absolute bottom-4 right-4 bg-gray-200 transition-all ease-in-out duration-200 z-10'
      "
    >
      <button
        v-if="!showHelp"
        class="w-full h-full rouded-full focus:outline-none"
        @click="showHelp = true"
      >
        <span class="font-bold text-2xl text-gray-600">?</span>
      </button>

      <div
        v-if="showHelp"
        :class="
          (showHelp ? 'scale-100' : 'scale-0') +
            ' transform transition-transform ease-in-out duration-200 delay-200'
        "
      >
        <div class="hidden sm:block">
          <div class="flex items-center gap-2">
            Left
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            to rotate
          </div>

          <div class="flex items-center gap-2">
            Right
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            to pan
          </div>

          <div class="flex items-center gap-2">
            Scroll
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="6"
                y="2"
                width="12"
                height="20"
                rx="6"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 10.5V7"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            to zoom
          </div>
        </div>
        <div class="sm:hidden text-lg space-y-2">
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              viewBox="0 0 50 50"
            >
              <path
                d="M33.83,31.941c1.386-1.189,1.164-5.261.987-8.532-.048-.87-.093-1.708-.109-2.467a1.182,1.182,0,0,0-2.34.023v1.922a.6.6,0,0,1-.594.6h-.006a.6.6,0,0,1-.6-.588L31.1,19.663a1.21,1.21,0,0,0-1.324-.978c-.719,0-1.326.459-1.326,1v2.4a.6.6,0,0,1-.6.6h0a.6.6,0,0,1-.6-.6l-.022-3.232a1.338,1.338,0,0,0-2.65.036v2.987a.6.6,0,0,1-.6.6h0a.6.6,0,0,1-.6-.6L23.36,8.616A1.36,1.36,0,0,0,22.035,7.24a1.377,1.377,0,0,0-1.326,1.42V19.717a6.747,6.747,0,0,1-.777,3.031,2.841,2.841,0,0,0-.324,1.276,7.025,7.025,0,0,0,.483,2.628A.6.6,0,0,1,19,27.146a8.214,8.214,0,0,1-.589-3.122,4.029,4.029,0,0,1,.451-1.815,6.4,6.4,0,0,0,.494-1.3H18.83a1.2,1.2,0,0,0-.468.1,3.57,3.57,0,0,0-1.625,1.546,7.059,7.059,0,0,0-.235,6.09c.68,1.645,2.829,3.6,4.113,4.764,1,.91,1.211,1.1,1.211,1.471v2.222H32.076C32.012,35.89,32.116,33.412,33.83,31.941Z"
                fill="none"
              />
              <path
                d="M22.035,6.041A2.551,2.551,0,0,1,24.559,8.6l0,2.534a3.738,3.738,0,1,0-5.054-.039V8.66A2.576,2.576,0,0,1,22.035,6.041Z"
                fill="none"
              />
              <path
                d="M34.612,32.852c1.834-1.574,1.605-5.789,1.4-9.507-.047-.857-.092-1.683-.108-2.429a2.287,2.287,0,0,0-2.369-2.175,2.468,2.468,0,0,0-1.317.376,2.47,2.47,0,0,0-2.441-1.631,2.757,2.757,0,0,0-1.553.466,2.515,2.515,0,0,0-2.32-1.423,2.632,2.632,0,0,0-1.333.357l-.008-4.28a4.921,4.921,0,1,0-5.086-.023c.009.006.02.006.029.011v7.111h-.7a2.38,2.38,0,0,0-.963.212,4.752,4.752,0,0,0-2.168,2.06,8.256,8.256,0,0,0-.29,7.12c.782,1.893,3.057,3.958,4.416,5.192.313.284.66.6.818.766v2.039H19.143a.6.6,0,0,0-.6.6v7.979a.6.6,0,1,0,1.2,0v-7.38H34.268v7.38a.6.6,0,1,0,1.2,0V37.694a.6.6,0,0,0-.6-.6H33.28C33.223,36.127,33.268,34,34.612,32.852ZM18.32,8.374a3.733,3.733,0,1,1,6.244,2.764l0-2.534a2.526,2.526,0,1,0-5.05.057V11.1A3.7,3.7,0,0,1,18.32,8.374Zm3.507,28.721V34.873c0-.37-.208-.561-1.211-1.471-1.284-1.167-3.434-3.119-4.113-4.764a7.059,7.059,0,0,1,.235-6.09A3.57,3.57,0,0,1,18.363,21a1.2,1.2,0,0,1,.468-.1h.522a6.4,6.4,0,0,1-.494,1.3,4.029,4.029,0,0,0-.451,1.815A8.214,8.214,0,0,0,19,27.146a.6.6,0,0,0,1.094-.494,7.025,7.025,0,0,1-.483-2.628,2.841,2.841,0,0,1,.324-1.276,6.747,6.747,0,0,0,.777-3.031V8.66a1.377,1.377,0,0,1,1.326-1.42A1.36,1.36,0,0,1,23.36,8.616l.022,13.271a.6.6,0,0,0,.6.6h0a.6.6,0,0,0,.6-.6V18.9a1.338,1.338,0,0,1,2.65-.036l.022,3.232a.6.6,0,0,0,.6.6h0a.6.6,0,0,0,.6-.6v-2.4c0-.543.607-1,1.326-1a1.21,1.21,0,0,1,1.324.978l.065,3.236a.6.6,0,0,0,.6.588h.006a.6.6,0,0,0,.594-.6V20.966a1.182,1.182,0,0,1,2.34-.023c.017.759.062,1.6.109,2.467.177,3.271.4,7.343-.987,8.532-1.715,1.471-1.819,3.949-1.755,5.153Z"
              />
            </svg>
            to rotate
          </div>

          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              viewBox="0 0 50 50"
            >
              <path
                d="M19.861,6.6h.007a2.551,2.551,0,0,1,2.525,2.555l.152,1.915.08-3.887a2.273,2.273,0,0,1,.752-1.681,2.592,2.592,0,0,1,1.766-.682h.008a2.434,2.434,0,0,1,2.523,2.309l-.054,2.893a3.725,3.725,0,1,0-5.661-4.681.605.605,0,0,1-.74.255,3.727,3.727,0,0,0-3.649,6.42l-.224-2.742A2.585,2.585,0,0,1,19.861,6.6Z"
                fill="none"
              />
              <path
                d="M32.78,33.105c1.413-1.22,1.132-6.675.945-10.285-.046-.892-.088-1.717-.105-2.417a1.113,1.113,0,0,0-1.17-1h0a1.245,1.245,0,0,0-.845.32.964.964,0,0,0-.322.709l.012,3.622a.6.6,0,0,1-.593.6h0a.6.6,0,0,1-.6-.589l-.079-4.37a1.208,1.208,0,0,0-1.32-.97h-.007a1.21,1.21,0,0,0-1.246,1.059l-.065,3.5a.6.6,0,0,1-.6.589h-.011a.6.6,0,0,1-.589-.61v-.011l.063-3.421c0-.038,0-.075,0-.111l.235-12.583a1.26,1.26,0,0,0-1.322-1.113h-.006a1.4,1.4,0,0,0-.954.363,1.1,1.1,0,0,0-.368.811l-.324,15.9a.6.6,0,0,1-1.2.035L21.2,9.221A1.374,1.374,0,0,0,19.868,7.8h0a1.378,1.378,0,0,0-1.321,1.425l1.08,13.208c.008,1.831-.261,3-.8,3.52-.507.494-1.621,1.173-3.379.145-.562-.33-1.077-.67-1.554-.984a5.918,5.918,0,0,0-2.589-1.255h0c-1.183,0-2.6.243-2.659,1.362-.018.346-.021.4.9.445a2.767,2.767,0,0,1,1.8.523,14.608,14.608,0,0,1,1.378,1.627,21.249,21.249,0,0,0,3.623,3.9c.044.032,4.436,3.3,4.439,4.353l.007,2.22,10.249-.032C30.974,37.058,31.071,34.581,32.78,33.105Z"
                fill="none"
              />
              <path
                d="M33.565,34.014c1.856-1.6,1.58-6.955,1.358-11.255-.045-.88-.087-1.694-.1-2.386a2.287,2.287,0,0,0-2.369-2.167h-.008a2.446,2.446,0,0,0-1.5.511,2.567,2.567,0,0,0-2.244-1.187h-.012a2.556,2.556,0,0,0-1.206.3l.118-6.334a4.923,4.923,0,1,0-6.4-7.175,4.831,4.831,0,0,0-1.352-.193,4.93,4.93,0,0,0-2.493,9.184l.339.143.738,9.03c0,1.721-.271,2.448-.436,2.608s-.708.688-1.935-.03c-.543-.318-1.039-.646-1.5-.951a6.482,6.482,0,0,0-3.25-1.452h0c-3.248.01-3.811,1.571-3.857,2.5-.079,1.6,1.3,1.667,2.041,1.705a1.975,1.975,0,0,1,1.061.219,15.027,15.027,0,0,1,1.233,1.472,22.056,22.056,0,0,0,3.862,4.134,25.736,25.736,0,0,1,3.945,3.492l.007,2.114-1.484,0a.6.6,0,0,0-.6.6l.025,7.98a.6.6,0,0,0,.6.6h0a.6.6,0,0,0,.6-.6L18.712,39.5l12.978-.04.011,0,.026,0,1.509,0,.023,7.381a.6.6,0,0,0,1.2,0l-.024-7.98a.6.6,0,0,0-.6-.6h0l-1.588,0C32.186,37.291,32.226,35.169,33.565,34.014ZM16.11,9.063A3.717,3.717,0,0,1,21.219,5.6a.605.605,0,0,0,.74-.255A3.694,3.694,0,0,1,25.17,3.479a3.73,3.73,0,0,1,2.45,6.547l.054-2.893a2.433,2.433,0,0,0-2.521-2.309h-.011a2.592,2.592,0,0,0-1.766.682,2.273,2.273,0,0,0-.752,1.681l-.08,3.887-.152-1.915A2.551,2.551,0,0,0,19.868,6.6h-.007a2.585,2.585,0,0,0-2.515,2.675l.224,2.742A3.7,3.7,0,0,1,16.11,9.063Zm4.683,29.231-.007-2.22c0-1.048-4.4-4.32-4.439-4.353a21.249,21.249,0,0,1-3.623-3.9,14.608,14.608,0,0,0-1.378-1.627,2.767,2.767,0,0,0-1.8-.523c-.923-.046-.92-.1-.9-.445C8.7,24.1,10.12,23.865,11.3,23.861h0a5.918,5.918,0,0,1,2.589,1.255c.477.314.991.654,1.554.984,1.758,1.028,2.872.35,3.379-.145.535-.521.8-1.688.8-3.52L18.543,9.229A1.378,1.378,0,0,1,19.865,7.8h0A1.374,1.374,0,0,1,21.2,9.221L22.3,23.129a.6.6,0,0,0,1.2-.035l.324-15.9a1.1,1.1,0,0,1,.368-.811,1.4,1.4,0,0,1,.954-.363h.006a1.26,1.26,0,0,1,1.322,1.113L26.24,19.721c0,.036,0,.073,0,.111l-.063,3.421v.011a.6.6,0,0,0,.589.61h.007a.6.6,0,0,0,.6-.589l.065-3.5a1.21,1.21,0,0,1,1.246-1.059h0a1.209,1.209,0,0,1,1.322.97l.079,4.37a.6.6,0,0,0,.6.589H30.7a.6.6,0,0,0,.593-.6l-.012-3.622a.964.964,0,0,1,.322-.709,1.245,1.245,0,0,1,.845-.32h0a1.113,1.113,0,0,1,1.17,1c.018.7.06,1.525.105,2.417.187,3.61.468,9.065-.945,10.285-1.708,1.476-1.806,3.953-1.738,5.157Z"
              />
            </svg>
            to pan
          </div>

          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              viewBox="0 0 50 50"
            >
              <path
                d="M18.736,38.12V44.9H33.261V38.12Zm12.448,2.234a1.156,1.156,0,1,1-1.156,1.156A1.157,1.157,0,0,1,31.183,40.354Z"
                fill="none"
              />
              <path
                d="M32.823,31.768c1.416-1.217,1.152-6.673.977-10.284-.043-.891-.083-1.716-.1-2.416a1.182,1.182,0,0,0-2.34.024v3.622a.6.6,0,0,1-1.2.026l-.193-4.425c-.029-.533-.634-.931-1.354-.932a1.525,1.525,0,0,0-.967.36.877.877,0,0,0-.327.681l.125,3.471a.6.6,0,0,1-.552.619.582.582,0,0,1-.644-.523l-.571-4.584a1.263,1.263,0,0,0-1.461-.938,1.4,1.4,0,0,0-.9.483,1.1,1.1,0,0,0-.259.851l.51,3.83a.6.6,0,0,1-1.164.268c-.935-2.819-2.486-7.437-2.674-7.826L17.97,9.082C17.361,7.723,16.721,7.1,16.454,7.21l-.635.314c-.629.528-.007,2.138.408,3.208l.194.511c.01.026.125.417.292.987.4,1.367,1.228,4.213,1.4,4.69l.621,2.828c.051.12.134.323.218.529a5.1,5.1,0,0,1,.557,2.989,2.514,2.514,0,0,1-.618,1.308c-.074.071-.133.14-.185.2a1.016,1.016,0,0,1-.771.447h0c-.453,0-.8-.356-1.325-.941-1.508-1.688-4.324-3.473-5.249-3.522l-.23-.014c-1.425-.083-2.715-.079-2.976.884-.1.367-.079.489,1.009.84a3.658,3.658,0,0,1,1.526.77,18.646,18.646,0,0,1,1.444,1.934c1.162,1.664,2.918,4.179,4.262,5.161.045.032,4.426,3.32,4.426,4.367v2.222h10.25C31,35.717,31.109,33.238,32.823,31.768Z"
                fill="none"
              />
              <circle cx="31.183" cy="41.51" r="1.156" />
              <path
                d="M33.6,32.678c1.862-1.6,1.6-6.951,1.395-11.252-.043-.88-.082-1.693-.1-2.385a2.287,2.287,0,0,0-2.369-2.175,2.45,2.45,0,0,0-1.589.575,2.536,2.536,0,0,0-2.364-1.257,2.722,2.722,0,0,0-1.726.66l-.063.059a2.472,2.472,0,0,0-2.729-1.624,2.6,2.6,0,0,0-1.662.9,2.364,2.364,0,0,0-.406.7c-.617-1.816-1.008-2.917-1.168-3.291h0l-1.74-4.95c-1.2-2.675-2.349-2.851-3.131-2.519l-.721.356a.571.571,0,0,0-.088.054c-1.429,1.042-.624,3.119-.037,4.637l.182.474c.018.057.122.415.271.927.6,2.057,1.253,4.289,1.4,4.687l.622,2.831c.078.213.166.429.256.647a4.193,4.193,0,0,1,.5,2.278,1.426,1.426,0,0,1-.279.7c-.065.063-.122.124-.173.181-.087-.086-.21-.215-.385-.41-1.517-1.7-4.62-3.844-6.079-3.923l-.224-.013c-1.284-.077-3.669-.218-4.205,1.77-.426,1.577.967,2.026,1.8,2.295a2.922,2.922,0,0,1,1.046.475,20.46,20.46,0,0,1,1.31,1.772c1.28,1.833,3.033,4.344,4.538,5.443a25.728,25.728,0,0,1,3.935,3.5v2.115H18.136a.6.6,0,0,0-.6.6V45.5a.6.6,0,0,0,.6.6H33.861a.6.6,0,0,0,.6-.6V37.521a.6.6,0,0,0-.6-.6H32.273C32.216,35.953,32.262,33.83,33.6,32.678ZM33.261,44.9H18.736V38.12H33.261ZM20.819,36.921V34.7c0-1.047-4.381-4.335-4.426-4.367-1.344-.982-3.1-3.5-4.262-5.161a18.646,18.646,0,0,0-1.444-1.934,3.658,3.658,0,0,0-1.526-.77c-1.088-.351-1.107-.473-1.009-.84.261-.963,1.551-.967,2.976-.884l.23.014c.925.05,3.741,1.834,5.249,3.522.521.585.872.941,1.323.941h.007a1.016,1.016,0,0,0,.771-.447c.052-.06.11-.128.185-.2a2.514,2.514,0,0,0,.618-1.308,5.1,5.1,0,0,0-.557-2.989c-.084-.206-.167-.409-.218-.529l-.621-2.828c-.174-.478-1-3.323-1.4-4.69-.167-.57-.282-.961-.292-.987l-.194-.511c-.415-1.07-1.037-2.68-.408-3.208l.635-.314c.268-.114.907.513,1.517,1.872l1.762,4.992c.188.389,1.739,5.007,2.674,7.826a.6.6,0,0,0,1.164-.268l-.51-3.83a1.1,1.1,0,0,1,.259-.851,1.4,1.4,0,0,1,.9-.483,1.263,1.263,0,0,1,1.461.938l.571,4.584a.582.582,0,0,0,.644.523.6.6,0,0,0,.552-.619l-.125-3.471a.877.877,0,0,1,.327-.681,1.525,1.525,0,0,1,.967-.36c.72,0,1.324.4,1.354.932l.193,4.425a.6.6,0,0,0,1.2-.026V19.092a1.182,1.182,0,0,1,2.34-.024c.015.7.055,1.525.1,2.416.176,3.611.439,9.067-.977,10.284-1.714,1.471-1.818,3.949-1.754,5.153Z"
              />
              <path
                d="M9.34,17a.6.6,0,0,0-.642-.556l-1.216.088,1.764-1.46c.011-.008.025-.011.036-.02l3.038-2.515-.191,1.606a.6.6,0,0,0,.524.667.608.608,0,0,0,.072,0,.6.6,0,0,0,.595-.528l.364-3.055a.567.567,0,0,0,.014-.122l0-.031a.6.6,0,0,0-.162-.485.637.637,0,0,0-.477-.185l-3.087.224a.6.6,0,0,0-.556.642.612.612,0,0,0,.642.556l1.348-.1L9.511,13.3c-.01.007-.022.009-.032.017L6.428,15.846l.2-1.717a.6.6,0,0,0-1.191-.143l-.382,3.207V17.2a.6.6,0,0,0,.025.246.64.64,0,0,0,.034.062.575.575,0,0,0,.075.139c0,.006.013.008.018.014s.006.013.011.018a.579.579,0,0,0,.125.087.618.618,0,0,0,.066.046.6.6,0,0,0,.242.052H5.7l3.087-.224A.6.6,0,0,0,9.34,17Z"
              />
            </svg>
            to zoom
          </div>
        </div>
      </div>

      <button
        v-if="showHelp"
        class="absolute bottom-4 right-4 self-end p-1 mt-4 rounded-full focus:outline-none"
        @click="showHelp = false"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import GlyphViz from './views/GlyphViz.vue';

import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';

import {
  vectorFieldData as vectorFieldDataEl1,
  nullPoint as nullPointEl1,
} from '../data/el_1_subset';
import {
  vectorFieldData as vectorFieldDataMag1,
  nullPoint as nullPointMag1,
} from '../data/mag_1_subset';
import {
  vectorFieldData as vectorFieldDataEl2,
  nullPoint as nullPointEl2,
} from '../data/el_2_subset';
import {
  vectorFieldData as vectorFieldDataMag2,
  nullPoint as nullPointMag2,
} from '../data/mag_2_subset';

export default {
  components: {
    GlyphViz,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },
  data: () => ({
    datasets: {
      '1': {
        el: {
          vectorFieldData: vectorFieldDataEl1,
          nullPoint: nullPointEl1,
        },
        mag: {
          vectorFieldData: vectorFieldDataMag1,
          nullPoint: nullPointMag1,
        },
      },
      '2': {
        el: {
          vectorFieldData: vectorFieldDataEl2,
          nullPoint: nullPointEl2,
        },
        mag: {
          vectorFieldData: vectorFieldDataMag2,
          nullPoint: nullPointMag2,
        },
      },
    },
    fields: [
      {
        name: 'Electric',
        value: 'el',
      },
      {
        name: 'Magnetic',
        value: 'mag',
      },
    ],
    selectedField: 'el',
    selectedDataSet: '1',
    showHelp: false,
    colorScales: {
      el: ['#EFDE1D', '#209A89', '#430254'],
      mag: ['#2563EB', '#B91C1C'],
    },
  }),
};
</script>
