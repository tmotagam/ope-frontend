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
  <div v-if="store.notificationsdata.length !== 0" class="row justify-center items-center">
    <div v-for="notification in store.notificationsdata" v-bind:key="notification.id" class="q-gutter-md"
      style="width: 90%">
      <br />
      <q-item class="text-info" @click="display(notification)" clickable v-ripple>
        <br>
        <q-tooltip class="bg-white text-black" style="font-size: 15px">Click to view {{ notification.title }}
          notification
          in more detail</q-tooltip>
        <q-item-section avatar top>
          <q-icon name="o_notifications_active" color="info" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">{{ notification.id }}</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ notification.title }}</span>
          </q-item-label>
          <q-item-label caption lines="1">{{ notification.detail.slice(0, 60) }}...</q-item-label>
        </q-item-section>

        <q-item-section v-if="notification.mark === false" top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="15px" color="primary" flat dense round icon="done"
              @click.stop="mark(notification.Id)">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">Mark as read</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
        <q-item-section v-else top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="15px" color="primary" flat dense round icon="o_unpublished"
              @click.stop="unmark(notification.Id)">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">Mark as unread</q-tooltip>
            </q-btn>
            <q-btn class="gt-xs q-ml-md" size="15px" color="negative" flat dense round icon="o_delete"
              @click.stop="deletenoti(notification.Id)">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">Delete Notification</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </div>

  <q-dialog v-model="notification" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ displayNotification.title }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Date: {{ new Date(displayNotification.Date).toLocaleString() }}</div>
      </q-card-section>

      <q-card-section class="text-subtitle2 q-pt-none">
        Type: {{ displayNotification.type }}
      </q-card-section>
      <q-card-section v-if="displayNotification.severity !== undefined" class="text-subtitle2 q-pt-none">
        Severity: {{ displayNotification.severity }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ displayNotification.detail }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="red-10" v-close-popup />
        <q-btn v-if="displayNotification.mark === false" flat label="Mark As Read" color="primary"
          @click.stop="mark(displayNotification.Id)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { AdminStore } from 'src/stores/admin-store';

export default defineComponent({
  name: 'NotificationComponent',

  setup() {
    const store = AdminStore()
    store.notifications_details()
    watch(() => store.notificationsids.length, () => {
      if (!store.eventinprogress) store.notifications_details()
    })
    watch(() => store.notificationCurrent, () => {
      store.notifications_details()
    })
    return {
      store,
    }
  },

  methods: {
    display(notification: {
      id: number;
      Id: string;
      title: string;
      detail: string;
      type: string;
      mark: boolean;
      severity: string;
      Date: Date;
    }) {
      this.displayNotification = notification
      this.notification = true
    },
    mark(id: string) {
      this.store.mark_notification(id)
    },
    unmark(id: string) {
      this.store.unmark_notification(id)
    },
    deletenoti(id: string) {
      this.store.delete_notification(id)
    }
  },

  data() {
    return {
      displayNotification: <{
        id: number;
        Id: string;
        title: string;
        detail: string;
        type: string;
        mark: boolean;
        severity: string;
        Date: Date;
      }>{},
      notification: false,
    }
  },

});
</script>
