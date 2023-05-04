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
        <q-input color="primary" autocomplete="on" rounded v-model="IDN" outlined placeholder="Identification Number"
          :rules="[(val) => !!val || 'Field is required']" />
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="password" outlined
          placeholder="Password" :rules="[(val) => !!val || 'Field is required']" />
        <div class="row column justify-center">
          <q-btn size="20px" color="white" push @click="validate" text-color="positive" label="Login" />
          <br /><br />
          <q-btn size="20px" flat color="white" @click="prompt = true" text-color="info" label="Forgot Password" />
        </div>
      </div>
    </div>

    <div v-else class="desktop-window-height row justify-center items-center">
      <div class="q-gutter-md" style="width: 40%">
        <q-input color="primary" autocomplete="on" rounded v-model="IDN" outlined placeholder="Identification Number"
          :rules="[(val) => !!val || 'Field is required']" />
        <q-input color="primary" autocomplete="on" rounded type="password" v-model="password" outlined
          placeholder="Password" :rules="[(val) => !!val || 'Field is required']" />
        <div class="row justify-center">
          <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click="validate" text-color="positive"
            label="Login" />
          <q-btn class="col-1 on-right" style="font-size: 120%" flat rounded color="white" @click="prompt = true"
            text-color="info" icon="lock_reset">
            <q-tooltip class="bg-white text-info" style="font-size: 15px">
              <b>Forgot Password</b>
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </form>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Your Identification Number</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="idn" type="text" autofocus @keyup.enter="reset" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat class="text-red-10" label="Cancel" v-close-popup />
        <q-btn flat v-if="idn !== null && idn.length === 24" class="text-primary" @click="reset" label="Reset Password" />
        <q-btn flat v-else class="text-primary" disable label="Reset Password" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { MainStore } from 'stores/main-store';
import { Notify, Loading } from 'quasar';

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const store = MainStore()
    watch(() => store.busy, (newValue) => {
      if (newValue && store.loading) {
        Loading.show({
          message: 'Signing in please wait...',
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
    return {
      store,
    };
  },

  data() {
    return {
      prompt: <boolean>false,
      idn: <string | null>null,
      IDN: <string | null>null,
      password: <string | null>null,
    };
  },

  methods: {
    async validate() {
      const id = this.IDN
      const password = this.password
      if (id === null || id.trim().length === 0) {
        Notify.create({
          message: 'Please enter the Identification Number correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (password === null || password.trim().length === 0) {
        Notify.create({
          message: 'Please enter the Password correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      this.store.login(id, password)
    },

    reset() {
      if (this.idn === null || this.idn.trim().length === 0) {
        Notify.create({
          message: 'Please enter the Identification Number correctly',
          position: 'top',
          type: 'negative',
        });
        return -1;
      }
      this.prompt = false;
      this.store.resetrequest(this.idn)
      return 0;
    },
  },
});
</script>
