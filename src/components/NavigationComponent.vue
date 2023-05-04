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
  <q-menu>
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div v-for="item in menuitems" v-bind:key="item">
          <br>
          <q-item :to="item.link" exact clickable @click="changepage(item.link)" class="on-left on-right">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <br>
      </div>
    </div>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MainStore } from 'stores/main-store';

export default defineComponent({
  name: 'NavigationComponent',

  props: ['menuitems'],

  setup() {
    const store = MainStore()
    return {
      store,
    };
  },
  methods: {
    changepage(link: string) {
      this.store.setRoute(link)
    }
  },

});
</script>
