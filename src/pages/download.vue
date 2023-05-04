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
    <div class="q-pa-md">
      <q-img src="icons/favicon-128x128.png" style="height: 140px; width: 140px" />
      <div class="text-h2 q-mb-md">Online Proctored Examination System</div>
      <div class="subtitle-1 q-mb-md">You are on a unsupported system</div>
    </div>
  </div>

  <div v-else class="desktop-window-height row justify-center items-center">
    <q-splitter v-model="split" disable :separator-style="{ backgroundColor: 'white' }">

      <template v-slot:before>
        <div class="q-pa-md">
          <q-img src="icons/favicon-128x128.png" style="height: 140px; width: 140px" />
          <div class="text-h2 q-mb-md">Online Proctored Examination System</div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-gutter-md q-pa-md">
          <q-select model-value="Windows" color="primary" hide-dropdown-icon rounded outlined label="Operating System" />
          <q-select model-value="x64" color="primary" hide-dropdown-icon rounded outlined label="Architecture" />
          <div class="row justify-center">
            <q-btn class="col-4 on-left" :href="link" style="font-size: 120%" push color="white" text-color="info"
              label="Download" />
          </div>
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DownloadPage',

  setup() {
    return {
      link: `${process.env.serverurl}public/download/Windows/x64`,
      split: 55,
    }
  },
});
</script>
