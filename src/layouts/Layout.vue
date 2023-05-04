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
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-toolbar-title v-if="$q.platform.is.mobile">
          <q-img class="on-right on-left" src="icons/favicon-128x128.png" style="height: 30px; width: 50px" />
        </q-toolbar-title>
        <q-toolbar-title v-else>
          <q-img class="on-right on-left" src="icons/favicon-128x128.png" style="height: 30px; width: 50px" />
        </q-toolbar-title>
        <q-btn v-if="store.getRoute === '/moderator/tests'" rounded @click.stop="store.addtests = true"
          class="on-left on-right" label="Add new tests" icon="o_post_add" text-color="primary" />
        <q-btn class="on-left on-right" dropdown-icon="none" rounded :label="'Hi ' + store.name" icon="o_account_circle"
          text-color="primary">
          <NavigationComponent :menuitems="items" />
        </q-btn>
      </q-toolbar>
      <q-linear-progress indeterminate stripe v-if="store.busy" />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import NavigationComponent from 'src/components/NavigationComponent.vue';

import { defineComponent } from 'vue';
import { MainStore } from 'stores/main-store';
import { date, SessionStorage } from 'quasar';

const moderatorList = [
  {
    title: 'Notifications',
    caption: 'Manage Notifications',
    icon: 'o_notifications_active',
    link: '/moderator',
  },

  {
    title: 'Tests',
    caption: 'Manage tests',
    icon: 'quiz',
    link: '/moderator/tests',
  },

  {
    title: 'Evalution',
    caption: 'Evaluation of the tests',
    icon: 'history_edu',
    link: '/moderator/evaluation',
  },

  {
    title: 'Your Account',
    caption: 'Manage your account',
    icon: 'o_manage_accounts',
    link: '/moderator/account',
  },

  {
    title: 'Logout',
    caption: 'Logout from OPE',
    icon: 'o_logout',
    link: '/logout',
  },
];
const adminList = [
  {
    title: 'Notifications',
    caption: 'Manage Notifications',
    icon: 'o_notifications_active',
    link: '/admin',
  },

  {
    title: 'Examinee',
    caption: 'Manage examinees',
    icon: 'o_badge',
    link: '/admin/examinees',
  },

  {
    title: 'Moderators',
    caption: 'Manage Moderators',
    icon: 'supervisor_account',
    link: '/admin/moderators',
  },

  {
    title: 'Your Account',
    caption: 'Manage your account',
    icon: 'o_manage_accounts',
    link: '/admin/account',
  },

  {
    title: 'Logout',
    caption: 'Logout from OPE',
    icon: 'o_logout',
    link: '/logout',
  },
];

export default defineComponent({
  name: 'CommonLayout',

  beforeMount() {
    window.addEventListener('beforeunload', this.beforeUnloadListener);
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
  },

  components: {
    NavigationComponent,
  },

  data() {
    return {
      uim: SessionStorage.getItem('uim'),
    };
  },

  computed: {
    todaysDate() {
      const timeStamp = Date.now();
      return date.formatDate(timeStamp, 'dddd DD MMMM YYYY');
    },
  },

  setup() {
    const store = MainStore()
    let linksList: {
      title: string;
      caption: string;
      icon: string;
      link: string;
    }[];
    if (
      SessionStorage.getItem('uim') === '__m__' &&
      store.getRoute.split('/')[1] === 'moderator'
    ) {
      linksList = moderatorList;
    } else if (
      SessionStorage.getItem('uim') === '__a__' &&
      store.getRoute.split('/')[1] === 'admin'
    ) {
      linksList = adminList;
    } else {
      linksList = [];
    }

    return {
      items: linksList,
      store,
      beforeUnloadListener: (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = '';
        return event.returnValue;
      },
    };
  },
});
</script>
