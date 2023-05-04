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
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-toolbar-title v-if="$q.platform.is.mobile">
          <q-img class="on-right on-left" src="icons/favicon-128x128.png" style="height: 30px; width: 50px" />
        </q-toolbar-title>
        <q-toolbar-title v-else>
          <q-img class="on-right on-left" src="icons/favicon-128x128.png" style="height: 30px; width: 50px" />
        </q-toolbar-title>
        <q-btn v-if="$router.currentRoute.value.path === '/'" push class="on-right on-left" color="white"
          text-color="primary" @click="ToRegister" round icon="app_registration">
          <q-tooltip class="bg-white text-primary" style="font-size: 15px">
            <b>Registration</b>
          </q-tooltip>
        </q-btn>

        <q-btn v-else-if="$router.currentRoute.value.path === '/register'" push class="on-right on-left" color="white"
          text-color="primary" @click="GoBack" round icon="chevron_left">
          <q-tooltip class="bg-white text-primary" style="font-size: 15px"><b>Login</b></q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-linear-progress indeterminate stripe v-if="store.busy && !store.loading" />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MainStore } from 'stores/main-store';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {
      store: MainStore()
    }
  },

  methods: {
    ToRegister() {
      this.store.setRoute('/register');
    },
    GoBack() {
      this.store.setRoute('/');
    },
  },
});
</script>
