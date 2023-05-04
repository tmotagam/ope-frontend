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
  <div v-if="store.notificationsids.length !== 0" class="row justify-center items-center">
    <div class="q-gutter-md" style="width: 90%">
      <br>
      <NotificationComponent />
      <br>
      <br>
      <div v-if="store.notificationsdata.length !== 0" class="row justify-center items-center">
        <q-pagination v-model="current" direction-links push boundary-numbers :max-pages="6" boundary-links :min="1"
          :max="Math.ceil(store.notificationsids.length / 10)" />
      </div>
    </div>
  </div>
  <div v-if="store.notificationsids.length === 0 && !store.mainstore.busy"
    class="desktop-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 60%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_check_circle" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">No Notifications !</div>
    </div>
  </div>
</template>

<script lang="ts">
import NotificationComponent from 'components/ANotificationComponent.vue';
import { AdminStore } from 'src/stores/admin-store';
import { computed, defineComponent, watch } from 'vue';

export default defineComponent({
  name: 'NotificationsPage',

  components: {
    NotificationComponent,
  },

  setup() {
    const store = AdminStore();
    const busy = store.mainstore.busy
    watch(() => store.notificationsids.length, (n) => {
      if (n === 0) {
        return
      }
      if (Math.ceil(store.notificationsids.length / 10) < store.notificationCurrent) {
        store.setcurrent(store.notificationCurrent -= 1, 'NOTIFICATION')
      }
    })
    const current = computed({
      get: () => store.notificationCurrent,
      set: (val) => store.setcurrent(val, 'NOTIFICATION')
    })
    store.notifications()
    return {
      store,
      busy,
      current,
    }
  },

});
</script>
