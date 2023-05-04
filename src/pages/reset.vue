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
  <form>
    <div v-if="$q.platform.is.mobile" class="mobile-window-height row justify-center items-center">
      <div class="q-gutter-md" style="width: 100%">
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="password" outlined
          placeholder="Password" :rules="[(val) => !!val || 'Field is required']" />
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="cpassword" outlined
          placeholder="Confirm password" :rules="[(val) => val === password || 'Password is not matching']" />
        <div class="row column justify-center">
          <q-btn size="20px" color="white" push @click="reset" text-color="positive" label="Reset" />
        </div>
      </div>
    </div>

    <div v-else class="desktop-window-height row justify-center items-center">
      <div class="q-gutter-md" style="width: 40%">
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="password" outlined
          placeholder="Password" :rules="[(val) => !!val || 'Field is required']" />
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="cpassword" outlined
          placeholder="Confirm password" :rules="[(val) => val === password || 'Password is not matching']" />
        <div class="row justify-center">
          <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click="reset" text-color="positive"
            label="Reset" />
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MainStore } from 'stores/main-store';
import { Notify } from 'quasar';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'ResetPage',

  setup() {
    const store = MainStore()
    const route = useRoute()
    const router = useRouter()
    const code = ref('')
    const id = ref('')
    router.isReady().then(() => {
      code.value = typeof route.params.code === 'string' ? route.params.code : ''
      id.value = typeof route.params.reset_id === 'string' ? route.params.reset_id : ''
    }).catch()
    return {
      store,
      code,
      id,
    }
  },

  data() {
    return {
      password: <string | null>null,
      cpassword: <string | null>null,
    };
  },

  methods: {
    reset() {
      if (this.password === null || !this.password.trim().length) {
        Notify.create({
          message: 'Please enter the data correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      } else if (this.password.length < 8) {
        Notify.create({
          message: 'The length of password is less than 8',
          position: 'top',
          type: 'negative',
        });
        return false;
      }

      if (this.password !== this.cpassword) {
        Notify.create({
          message: 'Password not matching',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      this.store.resetpassword(this.id, this.code, this.password, this.cpassword)
    },
  },
});
</script>
