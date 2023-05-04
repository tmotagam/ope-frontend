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
  <q-tabs v-if="store.moderatorsidsstatus.ids.length !== 0" v-model="tab" dense class="text-black" active-color="primary"
    indicator-color="primary" align="justify" narrow-indicator>
    <q-tab name="pending_verify" v-if="store.moderatorsidsstatus.status.includes('Pending Verification')" icon="pending"
      label="Pending Verifications" />
    <q-tab name="verified" v-if="store.moderatorsidsstatus.status.includes('Verified')" icon="o_verified"
      label="Verified Moderators" />
  </q-tabs>

  <div v-if="store.moderatorsidsstatus.ids.length === 0 && !store.mainstore.busy"
    class="form-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 60%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_no_accounts" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">There are no moderators</div>
    </div>
  </div>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="pending_verify">
      <div v-if="store.moderatorsidsstatus.status.includes('Pending Verification')"
        class="q-ma-xl justify-evenly items-center q-gutter-md">
        <VerificationLists :verificationStatus="false" />
      </div>
      <br>
      <div v-if="store.moderatorsidsstatus.ids.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="pcurrent" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(pmoderator.length / 10)" />
      </div>
    </q-tab-panel>

    <q-tab-panel name="verified">
      <div v-if="store.moderatorsidsstatus.status.includes('Verified')"
        class="q-ma-xl justify-evenly items-center q-gutter-md">
        <VerificationLists :verificationStatus="true" />
      </div>
      <br>
      <div v-if="store.moderatorsidsstatus.ids.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="vcurrent" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(vmoderator.length / 10)" />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import { AdminStore } from 'src/stores/admin-store';
import { defineComponent, ref, computed, defineAsyncComponent, watch } from 'vue';

export default defineComponent({
  name: 'AdminModerators',

  data() {
    return {
      change: true,
    };
  },

  components: {
    VerificationLists: defineAsyncComponent(
      () => import('components/MverificationLists.vue')
    ),
  },

  setup() {
    const store = AdminStore()
    store.moderators()
    const tab = ref('')
    const vmoderator = ref<Array<string>>([])
    const pmoderator = ref<Array<string>>([])
    watch(() => vmoderator.value.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(vmoderator.value.length / 10) < store.vmoderatorCurrent) {
        store.setcurrent(store.vmoderatorCurrent -= 1, 'VMODERATOR')
      }
    })
    watch(() => pmoderator.value.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(pmoderator.value.length / 10) < store.pmoderatorCurrent) {
        store.setcurrent(store.pmoderatorCurrent -= 1, 'PMODERATOR')
      }
    })
    watch(() => store.moderatorsidsstatus.status.length, (n) => {
      if (n === 0) {
        return
      }
      if (store.moderatorsidsstatus.status.includes('Pending Verification')) tab.value = 'pending_verify'
      else if (store.moderatorsidsstatus.status.includes('Verified')) tab.value = 'verified'
    })
    for (let i = 0; i < store.moderatorsidsstatus.status.length; i++) {
      const element = store.moderatorsidsstatus.status[i];
      if (element === 'Verified') {
        vmoderator.value.push(store.moderatorsidsstatus.ids[i]);
      }
    }
    for (let i = 0; i < store.moderatorsidsstatus.status.length; i++) {
      const element = store.moderatorsidsstatus.status[i];
      if (element === 'Pending Verification') {
        pmoderator.value.push(store.moderatorsidsstatus.ids[i]);
      }
    }
    watch(() => store.moderatorsidsstatus.ids.length, () => {
      if (store.moderatorsidsstatus.ids.length === 0) return
      pmoderator.value = []
      vmoderator.value = []
      for (let i = 0; i < store.moderatorsidsstatus.status.length; i++) {
        const element = store.moderatorsidsstatus.status[i];
        if (element === 'Verified') {
          vmoderator.value.push(store.moderatorsidsstatus.ids[i]);
        }
      }
      for (let i = 0; i < store.moderatorsidsstatus.status.length; i++) {
        const element = store.moderatorsidsstatus.status[i];
        if (element === 'Pending Verification') {
          pmoderator.value.push(store.moderatorsidsstatus.ids[i]);
        }
      }
    })
    const pcurrent = computed({
      get: () => store.pmoderatorCurrent,
      set: (val) => store.setcurrent(val, 'PMODERATOR')
    })
    const vcurrent = computed({
      get: () => store.vmoderatorCurrent,
      set: (val) => store.setcurrent(val, 'VMODERATOR')
    })
    return {
      store,
      tab,
      pcurrent,
      vcurrent,
      vmoderator,
      pmoderator,
    };
  },
});
</script>
