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
  <br>
  <q-tabs v-if="store.evaluationsidsstatus.ids.length !== 0" v-model="tab" dense class="text-black" active-color="primary"
    indicator-color="primary" align="justify" narrow-indicator>
    <q-tab name="pending_eval" v-if="store.evaluationsidsstatus.status.includes(false)" icon="pending"
      label="Pending Evaluations" />
    <q-tab name="Evaluated" v-if="store.evaluationsidsstatus.status.includes(true)" icon="o_verified"
      label="Evaluated evaluations" />
  </q-tabs>

  <div v-if="store.evaluationsidsstatus.ids.length === 0 && !store.mainstore.busy"
    class="form-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 60%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_highlight_off" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">There are no evaluations</div>
    </div>
  </div>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="pending_eval">
      <div v-if="store.evaluationsidsstatus.status.includes(false)"
        class="q-ma-xl justify-evenly items-center q-gutter-md">
        <EvaluationLists :EvaluationStatus="false" />
      </div>
      <br>
      <div v-if="store.evaluationsidsstatus.ids.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="pcurrent" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(pevaluation.length / 10)" />
      </div>
    </q-tab-panel>

    <q-tab-panel name="Evaluated">
      <div v-if="store.evaluationsidsstatus.status.includes(true)"
        class="q-ma-xl justify-evenly items-center q-gutter-md">
        <EvaluationLists :EvaluationStatus="true" />
      </div>
      <br>
      <div v-if="store.evaluationsidsstatus.ids.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="vcurrent" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(devaluation.length / 10)" />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import { ModeratorStore } from 'src/stores/moderator-store';
import { defineComponent, ref, computed, defineAsyncComponent, watch } from 'vue';

export default defineComponent({
  name: 'ModeratorEvaluation',

  data() {
    return {
      change: true,
    };
  },

  components: {
    EvaluationLists: defineAsyncComponent(
      () => import('components/EvaluationLists.vue')
    ),
  },

  setup() {
    const store = ModeratorStore()
    store.evaluations()
    const tab = ref('')
    const devaluation = ref<Array<string>>([])
    const pevaluation = ref<Array<string>>([])
    watch(() => devaluation.value.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(devaluation.value.length / 10) < store.devaluationCurrent) {
        store.setcurrent(store.devaluationCurrent -= 1, 'devaluation')
      }
    })
    watch(() => pevaluation.value.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(pevaluation.value.length / 10) < store.pevaluationCurrent) {
        store.setcurrent(store.pevaluationCurrent -= 1, 'pevaluation')
      }
    })
    watch(() => store.evaluationsidsstatus.status.length, (n) => {
      if (n === 0) {
        return
      }
      if (store.evaluationsidsstatus.status.includes(false)) tab.value = 'pending_eval'
      else if (store.evaluationsidsstatus.status.includes(true)) tab.value = 'Evaluated'
    })
    for (let i = 0; i < store.evaluationsidsstatus.status.length; i++) {
      const element = store.evaluationsidsstatus.status[i];
      if (element === true) {
        devaluation.value.push(store.evaluationsidsstatus.ids[i]);
      }
    }
    for (let i = 0; i < store.evaluationsidsstatus.status.length; i++) {
      const element = store.evaluationsidsstatus.status[i];
      if (element === false) {
        pevaluation.value.push(store.evaluationsidsstatus.ids[i]);
      }
    }
    watch(() => store.evaluationsidsstatus.ids.length, () => {
      if (store.evaluationsidsstatus.ids.length === 0) return
      pevaluation.value = []
      devaluation.value = []
      for (let i = 0; i < store.evaluationsidsstatus.status.length; i++) {
        const element = store.evaluationsidsstatus.status[i];
        if (element === true) {
          devaluation.value.push(store.evaluationsidsstatus.ids[i]);
        }
      }
      for (let i = 0; i < store.evaluationsidsstatus.status.length; i++) {
        const element = store.evaluationsidsstatus.status[i];
        if (element === false) {
          pevaluation.value.push(store.evaluationsidsstatus.ids[i]);
        }
      }
    })
    const pcurrent = computed({
      get: () => store.pevaluationCurrent,
      set: (val) => store.setcurrent(val, 'pevaluation')
    })
    const vcurrent = computed({
      get: () => store.devaluationCurrent,
      set: (val) => store.setcurrent(val, 'devaluation')
    })
    return {
      store,
      tab,
      pcurrent,
      vcurrent,
      pevaluation,
      devaluation,
    };
  },
});
</script>
