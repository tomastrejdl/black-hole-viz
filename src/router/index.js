import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/glyphs',
    name: 'Glyphs',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "glyphs" */ '../views/Glyphs.vue');
    },
  },
  {
    path: '/glyphs-with-shaders',
    name: 'GlyphsWithShaders',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(
        /* webpackChunkName: "glyphs-with-shaders" */ '../views/GlyphsWithShaders.vue'
      );
    },
  },
  {
    path: '/glyphs-with-iba',
    name: 'GlyphsWithIBA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(
        /* webpackChunkName: "glyphs-with-iba" */ '../views/GlyphsWithIBA.vue'
      );
    },
  },
  {
    path: '/test',
    name: 'Test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "test" */ '../views/Test.vue');
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ '../views/About.vue');
    },
  },
];

const router = createRouter({
  history: createWebHistory('.'),
  routes,
});

export default router;
