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
    <div v-if="$q.platform.is.mobile">
      <q-tabs v-model="tab" dense class="text-black" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="examinees" icon="o_account_circle" label="Examinees" />
        <q-tab name="moderators" icon="o_manage_accounts" label="Moderators" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="examinees">
          <div class="q-gutter-md">
            <q-input color="primary" autocomplete="on" rounded outlined v-model="eemail" type="email"
              placeholder="Email Address" :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined v-model="efull_name" placeholder="Full Name"
              :rules="[(val) => !!val || 'Field is required']" />
            <div class="row column justify-center">
              <q-btn size="20px" push color="white" @click="register" text-color="positive" label="Register" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="moderators">
          <div class="q-gutter-md">
            <q-input color="primary" autocomplete="on" rounded outlined v-model="memail" type="email"
              placeholder="Email Address" :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined v-model="mfull_name" placeholder="Full Name"
              :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined type="password" v-model="password"
              placeholder="Password" :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined type="password" v-model="cp"
              placeholder="Confirm Password"
              :rules="[(val) => val === password || 'Confirm password and password should be same']" />
            <div class="row column justify-center">
              <q-btn size="20px" push color="white" @click="register" text-color="positive" label="Register" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog :model-value="true" v-if="tab === 'moderators'" persistent :maximized="true" transition-show="slide-up"
        transition-hide="slide-down">
        <q-card class="bg-info text-white">
          <q-bar class="bg-white text-primary">
            <q-space />
            <q-btn dense flat icon="close" v-close-popup />
          </q-bar>

          <q-card-section>
            <div class="text-h6">Password Rules:</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <b style="font-size: 16px">Atleast one lowercase and uppercase letter</b><br />
            <b style="font-size: 16px">Atleast one number</b><br />
            <b style="font-size: 16px">Atleast one special character</b><br />
            <b style="font-size: 16px">Password length should be greater than or equal to 8 characters</b><br />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

    <div v-else>
      <q-tabs v-model="tab" class="text-black" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="examinees" icon="o_account_circle" label="Examinees" />
        <q-tab name="moderators" icon="o_manage_accounts" label="Moderators" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="examinees">
          <div class="fixed-center q-gutter-md" style="width: 40%">
            <q-input color="primary" autocomplete="on" rounded outlined v-model="eemail" type="email"
              placeholder="Email Address" :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined v-model="efull_name" placeholder="Full Name"
              :rules="[(val) => !!val || 'Field is required']" />
            <div class="row justify-center">
              <q-btn class="col-4" size="120%" push color="white" @click="register" text-color="positive"
                label="Register" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="moderators">
          <div class="fixed-center q-gutter-md" style="width: 40%">
            <q-input color="primary" autocomplete="on" rounded outlined v-model="memail" type="email"
              placeholder="Email Address" :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined v-model="mfull_name" placeholder="Full Name"
              :rules="[(val) => !!val || 'Field is required']" />
            <q-input color="primary" autocomplete="on" rounded outlined type="password" v-model="password"
              placeholder="Password" :rules="[(val) => !!val || 'Field is required']">
              <q-tooltip class="bg-white text-primary" anchor="bottom end" self="top left" style="font-size: 15px">
                <b>Password Rules:</b><br />
                <b>Atleast one lowercase and uppercase letter</b><br />
                <b>Atleast one number</b><br />
                <b>Atleast one special character</b><br />
                <b>Password length should be greater than or equal to 8 characters</b><br />
              </q-tooltip>
            </q-input>
            <q-input color="primary" autocomplete="on" rounded outlined type="password" v-model="cp"
              placeholder="Confirm Password"
              :rules="[(val) => val === password || 'Confirm password and password should be same']" />
            <div class="row justify-center">
              <q-btn class="col-4" size="120%" push color="white" @click="register" text-color="positive"
                label="Register" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { MainStore } from 'stores/main-store';
import { Notify, Loading } from 'quasar';

export default defineComponent({
  name: 'PageIndex',

  setup() {
    const store = MainStore()
    const render = computed(() => store.busy)
    watch(render, (newValue) => {
      if (newValue && store.loading) {
        Loading.show({
          message: 'Registering please wait...',
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
      dialog: true,
      tab: <'examinees' | 'moderators'>'examinees',
      eemail: <string | null>null,
      memail: <string | null>null,
      password: <string | null>null,
      cp: <string | null>null,
      efull_name: <string | null>null,
      mfull_name: <string | null>null,
    };
  },

  methods: {
    validate(whois: 'examinees' | 'moderators') {
      const pattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      if (whois === 'examinees') {
        if (typeof this.eemail == 'string' && !pattern.test(this.eemail)) {
          Notify.create({
            message: 'Please enter the email correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        } else if (this.eemail === null) {
          Notify.create({
            message: 'Please enter the email correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        if (this.efull_name === null || !this.efull_name.trim().length) {
          Notify.create({
            message: 'Please enter your name correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
      } else if (whois === 'moderators') {
        if (typeof this.memail == 'string' && !pattern.test(this.memail)) {
          Notify.create({
            message: 'Please enter the email correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        } else if (this.memail === null) {
          Notify.create({
            message: 'Please enter the email correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        if (this.mfull_name === null || !this.mfull_name.trim().length) {
          Notify.create({
            message: 'Please enter your name correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        if (this.password === null || !this.password.trim().length) {
          Notify.create({
            message: 'Please enter the password correctly',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        if (this.password !== this.cp) {
          Notify.create({
            message: 'Password and confirm password are not same',
            position: 'top',
            type: 'negative',
          });
          return false;
        }
      }

      return true;
    },
    register() {
      if (this.tab === 'examinees') {
        const val = this.validate('examinees');
        if (val) {
          this.store.register(JSON.stringify({ comType: 'EMAIL', comid: this.eemail, name: this.efull_name, type: 'EXAMINEE' }))
        }
      } else if (this.tab === 'moderators') {
        const val = this.validate('moderators');
        if (val) {
          this.store.register(JSON.stringify({ comType: 'EMAIL', comid: this.memail, name: this.mfull_name, type: 'MODERATOR', password: this.password, confirmPassword: this.cp }))
        }
      }
    },
  },
});
</script>
