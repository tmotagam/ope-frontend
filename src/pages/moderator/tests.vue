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
  <div v-if="store.testsids.length !== 0" class="row justify-center items-center">
    <div class="q-gutter-md" style="width: 90%">
      <br>
      <ManageTestComponent />
      <br>
      <br>
      <div v-if="store.testsdata.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="current" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(store.testsids.length / 10)" />
      </div>
    </div>
  </div>
  <div v-if="store.testsids.length === 0 && !store.mainstore.busy"
    class="desktop-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 60%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_check_circle" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">No tests !</div>
    </div>
  </div>
  <q-dialog v-model="store.mainstore.addtests" persistent :maximized="true" transition-show="slide-up"
    transition-hide="slide-down">
    <q-card class="text-black">
      <q-bar class="bg-white">
        <q-space />
        <q-btn v-if="!store.mainstore.busy" dense flat class="text-negative" icon="close" v-close-popup>
          <q-tooltip class="bg-white text-red">Close</q-tooltip>
        </q-btn>
        <q-btn v-else dense disable flat class="text-negative" icon="close" v-close-popup />
      </q-bar>
      <TestAddComponent />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ModeratorStore } from 'src/stores/moderator-store';
import { computed, defineAsyncComponent, defineComponent, watch } from 'vue';

export default defineComponent({
  name: 'testsPage',

  components: {
    TestAddComponent: defineAsyncComponent(
      () => import('components/TestAddComponent.vue')
    ),
    ManageTestComponent: defineAsyncComponent(
      () => import('components/TestManageComponent.vue')
    )
  },

  setup() {
    const store = ModeratorStore();
    const busy = store.mainstore.busy
    watch(() => store.testsids.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(store.testsids.length / 10) < store.testCurrent) {
        store.setcurrent(store.testCurrent -= 1, 'MANAGETEST')
      }
    })
    const current = computed({
      get: () => store.testCurrent,
      set: (val) => store.setcurrent(val, 'MANAGETEST')
    })
    store.tests()
    return {
      store,
      busy,
      current,
    }
  },

});
</script>
