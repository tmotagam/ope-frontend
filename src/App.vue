<!-- OPE Frontend
Copyright (C) 2020-2023  Motagamwala Taha Arif Ali

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. -->
<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MainStore } from 'stores/main-store';

export default defineComponent({
  name: 'App',

  watch: {
    $route(to, from) {
      const page = MainStore().getRoute;
      if (
        to.path === '/download' ||
        to.path.split('/')[1] === 'reset_password' ||
        to.path.split('/')[1] === 'verification' ||
        to.path.split('/')[1] === 'secure' ||
        to.path.split('/')[1] === 'userverification' ||
        to.path.split('/')[1] === 'review' ||
        to.path === '/register'
      ) {
        MainStore().setRoute(to.path);
      } else if (
        (from.path === '/download' && to.path === '/') ||
        (from.path.split('/')[1] === 'reset_password' && to.path === '/') ||
        (from.path.split('/')[1] === 'userverification' && to.path === '/') ||
        (from.path.split('/')[1] === 'verification' && to.path === '/') ||
        (from.path.split('/')[1] === 'secure' && to.path === '/') ||
        (from.path.split('/')[1] === 'review' && to.path === '/') ||
        (from.path === '/register' && to.path === '/')
      ) {
        MainStore().setRoute(to.path);
      } else if (from.path.split('/')[1] === 'logout' && to.path === '/') {
        MainStore().setRoute(to.path);
      } else if (!page) {
        this.$router.replace(from.path);
      } else {
        if (to.path !== page) {
          this.$router.replace(from.path);
        } else {
          if (
            from.path.split('/')[1] === 'moderator' &&
            to.path.split('/')[1] === 'moderator'
          ) {
            MainStore().setRoute(to.path);
          } else if (
            from.path.split('/')[1] === 'admin' &&
            to.path.split('/')[1] === 'admin'
          ) {
            MainStore().setRoute(to.path);
          } else if (
            from.path === '/' &&
            (to.path.split('/')[1] === 'admin' ||
              to.path.split('/')[1] === 'moderator')
          ) {
            MainStore().setRoute(to.path);
          } else if ((from.path.split('/')[1] === 'moderator' &&
            to.path.split('/')[1] === 'logout') || (from.path.split('/')[1] === 'admin' &&
              to.path.split('/')[1] === 'logout')) {
            MainStore().setRoute(to.path);
          } else {
            this.$router.replace(from.path);
          }
        }
      }
    },
  },
});
</script>
