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
  <q-page class="flex flex-center row justify-center items-center">
    <q-card flat>
      <q-card-section>
        <p style="font-size: 20px">Name</p>
        <q-input v-model="testName" color="primary" autocomplete="on" hint="Enter test`s name" rounded outlined
          :rules="[(val) => !!val || 'Field is required']" />
        <p class="q-pt-xl" style="font-size: 20px">Test Paper</p>
        <q-file v-model="testpaper" clearable color="info" outlined rounded accept="text/plain" hint="Test paper" />
        <p class="q-pt-xl" style="font-size: 20px">Test time</p>
        <q-select color="primary" v-model="time" :options="options" rounded outlined class="col-12"
          hint="Actual time for test" />
        <p v-if="time === 'Custom Time'" class="q-pt-xl" style="font-size: 20px">Custom test time</p>
        <q-input mask="##:##:##" v-model="ctime" v-if="time === 'Custom Time'" color="primary" hint="Test time"
          autocomplete="on" rounded outlined :rules="[(val) => !!val || 'Field is required']" />
        <p class="q-pt-xl" style="font-size: 20px">Test window start time</p>
        <div class="row">
          <q-date v-model="sdate" :options="optionFn" mask="YYYY/MM/DD" class="q-mr-md" color="primary" />
          <q-time v-model="stime" class="q-ml-md" with-seconds color="primary" />
        </div>
        <p class="q-pt-xl" style="font-size: 20px">Test window end time</p>
        <div class="row">
          <q-date v-model="edate" :options="optionFn" mask="YYYY/MM/DD" class="q-mr-md" color="primary" />
          <q-time v-model="etime" class="q-ml-md" with-seconds color="primary" />
        </div>
        <p class="q-pt-xl" style="font-size: 20px">Add Examinees</p>
        <q-select color="primary" map-options emit-value use-chips v-model="elist" multiple :options="store.elist" rounded
          outlined class="col-12" hint="Add examinees for participating in the test" />
        <br />
        <br />
        <q-btn size="20px" style="width: 100%" @click.stop="submitpaper" push color="white" text-color="positive"
          label="Add Test" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { date, Notify } from 'quasar';
import { ModeratorStore } from 'src/stores/moderator-store';

export default defineComponent({
  name: 'TestAddComponent',

  setup() {
    const store = ModeratorStore()
    store.search()
    return {
      store,
    }
  },

  data() {
    return {
      sdate: '',
      stime: '',
      testpaper: <File | null>null,
      options: <string[]>[
        '1:00:00',
        '2:00:00',
        '3:00:00',
        'Custom Time',
      ],
      testName: <string | null>null,
      time: <string>'1:00:00',
      ctime: <string>'00:00:00',
      edate: '',
      etime: '',
      elist: <Array<string>>[],
    };
  },

  methods: {
    optionFn(d: string) {
      return d >= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
    submitpaper() {
      if (this.testName === null || this.testName.trim().length === 0) {
        Notify.create({
          message: 'Please enter the test name correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.testpaper === null || this.testpaper.type !== 'text/plain') {
        Notify.create({
          message: 'Please select test paper correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.time === null || this.time.trim().length === 0) {
        Notify.create({
          message: 'Please enter the active test time correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.time === 'Custom Time') {
        if (this.ctime === null || this.ctime.trim().length === 0) {
          Notify.create({
            message: 'Please enter the active test time correctly',
            position: 'top',
            type: 'negative',
          });
          return false
        }
      }
      if (this.elist.length === 0) {
        Notify.create({
          message: 'Please select the examinees correctly',
          position: 'top',
          type: 'negative',
        });
        return false
      }
      if (this.stime === null || this.stime.trim().length === 0) {
        Notify.create({
          message: 'Please enter the start window time correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.etime === null || this.etime.trim().length === 0) {
        Notify.create({
          message: 'Please enter the end window time correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.sdate === null || this.sdate.trim().length === 0) {
        Notify.create({
          message: 'Please enter the start window date correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.edate === null || this.edate.trim().length === 0) {
        Notify.create({
          message: 'Please enter the end window date correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      const startwindowdatetime = new Date(this.sdate + ', ' + this.stime)
      const endwindowdatetime = new Date(this.edate + ', ' + this.etime)
      const formdata = new FormData()
      formdata.append('name', this.testName)
      formdata.append('time', this.time === 'Custom Time' ? this.ctime : this.time)
      formdata.append('testfile', this.testpaper)
      formdata.append('examlist', JSON.stringify({ examlist: this.elist }))
      formdata.append('windowstart', startwindowdatetime.toISOString())
      formdata.append('windowend', endwindowdatetime.toISOString())
      this.store.addtest(formdata)
      this.sdate = ''
      this.stime = ''
      this.testpaper = null
      this.testName = null
      this.time = '1:00:00'
      this.ctime = '00:00:00'
      this.edate = ''
      this.etime = ''
      this.elist = []
      this.store.mainstore.addtests = false
    }
  },

});
</script>
