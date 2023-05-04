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
  <div v-if="$q.platform.is.mobile" class="mobile-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 100%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_security" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">Secure account Page</div>
    </div>
  </div>

  <div v-else class="desktop-window-height row justify-center items-center">
    <div class="q-gutter-md" style="width: 40%">
      <div class="row justify-center">
        <q-icon class="text-grey" name="o_security" size="100px"></q-icon>
      </div>
      <div class="text-h5 text-grey text-center">Secure account Page</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { MainStore } from 'stores/main-store';
import { useRoute, useRouter } from 'vue-router';
import { Loading } from 'quasar';

export default defineComponent({
  name: 'SecurePage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    router.isReady().then(() => {
      const store = MainStore()
      watch(() => store.busy, (newValue) => {
        if (newValue && store.loading) {
          Loading.show({
            message: 'Sending data for securing account in please wait...',
            messageColor: 'primary',
            customClass: 'text-subtitle2',
            boxClass: 'bg-grey-2 text-grey-9',
            spinnerColor: 'primary'
          })
        } else {
          if (Loading.isActive) {
            Loading.hide()
          }
        }
      })
      const code = typeof route.params.code === 'string' ? route.params.code : ''
      const id = typeof route.params.secure_id === 'string' ? route.params.secure_id : ''
      store.secure(code, id)
    }).catch()
  }

});
</script>
