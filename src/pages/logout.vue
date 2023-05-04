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
      <h5 class="text-weight-bold">Redirecting you to login page</h5>
    </div>
  </div>

  <div v-else class="desktop-window-height row justify-center items-center">
    <div class="q-gutter-md">
      <h2 class="text-weight-bold">Redirecting you to login page</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MainStore } from 'stores/main-store';
import { SessionStorage } from 'quasar';

export default defineComponent({
  name: 'LogoutPage',

  setup() {
    const store = MainStore()
    SessionStorage.remove('uim')
    store.logout()
  },
});
</script>
