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
  <br />
  <q-item class="text-teal-14" clickable @click="supervise(number)" v-ripple>
    <q-tooltip class="bg-white text-black" style="font-size: 15px">
      Click to supervise {{ title }} test</q-tooltip>
    <br /><br />
    <q-item-section avatar top>
      <q-icon name="o_today" color="teal-14" size="34px" />
    </q-item-section>

    <q-item-section top class="col-2 gt-sm">
      <q-item-label class="q-mt-sm">{{ number }}</q-item-label>
    </q-item-section>

    <q-item-section top>
      <q-item-label lines="1">
        <span class="text-weight-medium">{{ title }}</span>
      </q-item-label>
      <q-item-label caption lines="1">{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScheduleLists',

  emits: ['ClickSchedule'],

  props: {
    number: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
    },
  },

  methods: {
    supervise(number: number) {
      this.$emit('ClickSchedule', { number: number });
    },
  },
});
</script>
