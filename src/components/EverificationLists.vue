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
  <div v-if="!verificationStatus">
    <div v-for="examinee in store.examineesdata" v-bind:key="examinee.Id">
      <br />
      <q-item class="text-teal-14" clickable @click.stop="showDetail(examinee)" v-ripple>
        <q-item-section avatar top>
          <q-icon name="o_how_to_reg" color="teal-14" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">{{ examinee.id }}</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-tooltip class="bg-white text-black" style="font-size: 15px">Click to start verification of {{
            examinee.name
          }}
          </q-tooltip>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ examinee.Id }}</span>
          </q-item-label>
          <q-item-label caption lines="1">Pending Verification of examinee {{ examinee.name }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="17px" color="red-12" flat @click.stop="deleteuser(examinee.Id)" dense round
              icon="o_delete">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">Delete examinee
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </div>
  <div v-if="verificationStatus">
    <div v-for="examinee in store.examineesdata" v-bind:key="examinee.Id">
      <br />
      <q-item class="text-positive" clickable @click.stop="vshowDetail(examinee)" v-ripple>
        <q-item-section avatar top>
          <q-icon name="o_verified" color="positive" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">{{ examinee.id }}</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-tooltip class="bg-white text-black" style="font-size: 15px">Click to view {{ examinee.name }}`s profile
          </q-tooltip>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ examinee.Id }}</span>
          </q-item-label>
          <q-item-label caption lines="1">Verified Examinee {{ examinee.name }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="17px" color="red-12" flat @click.stop="deleteuser(examinee.Id)" dense round
              icon="o_delete">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">Delete examinee
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </div>

  <q-dialog v-model="dialog" persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
    <q-card v-if="!store.mainstore.busy" class="text-black">
      <q-bar class="bg-white">
        <q-space />
        <q-btn dense flat class="text-red-11" icon="close" v-close-popup>
          <q-tooltip class="bg-white text-red">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div style="font-size: 18px;">Name: {{ detail.name }}</div>
      </q-card-section>
      <q-card-section>
        <div style="font-size: 18px;">Identification Number: {{ detail.Id }}</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-xl flex flex-center row justify-center items-center">
          <q-img fit="contain" width="500px" height="500px" :src="'data:image/png;base64,' + store.examineesimages[0]">
            <q-icon class="absolute all-pointer-events" size="32px" name="info" color="info" style="top: 8px; left: 8px">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">
                Photo of {{ detail.name }}
              </q-tooltip>
            </q-icon>
          </q-img>
          <q-img fit="contain" width="500px" height="500px" :src="'data:image/png;base64,' + store.examineesimages[1]">
            <q-icon class="absolute all-pointer-events" size="32px" name="info" color="info" style="top: 8px; left: 8px">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">
                Proof Id of {{ detail.name }}
              </q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn class="q-mr-lg" label='Accept the examinee' style="font-size: 120%" push color="white"
          text-color="positive" @click.stop="store.verify_examinee(detail.Id, verificationStatus)" v-close-popup />
        <q-btn class="q-ml-lg" label='Reject the examinee' style="font-size: 120%" push color="white"
          text-color="negative" @click.stop="rejectdialog = true" />
      </q-card-actions>
    </q-card>
    <q-card v-else class="text-black"></q-card>
  </q-dialog>

  <q-dialog v-model="veridialog" persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
    <q-card v-if="!store.mainstore.busy" class="text-black">
      <q-bar class="bg-white">
        <q-space />
        <q-btn dense flat class="text-red-11" icon="close" v-close-popup>
          <q-tooltip class="bg-white text-red">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div style="font-size: 18px;">Name: {{ detail.name }}</div>
      </q-card-section>
      <q-card-section>
        <div style="font-size: 18px;">Identification Number: {{ detail.Id }}</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-xl flex flex-center row justify-center items-center">
          <q-img fit="contain" width="500px" height="500px" :src="'data:image/png;base64,' + store.examineesimages[0]">
            <q-icon class="absolute all-pointer-events" size="32px" name="info" color="info" style="top: 8px; left: 8px">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">
                Photo of {{ detail.name }}
              </q-tooltip>
            </q-icon>
          </q-img>
          <q-img fit="contain" width="500px" height="500px" :src="'data:image/png;base64,' + store.examineesimages[1]">
            <q-icon class="absolute all-pointer-events" size="32px" name="info" color="info" style="top: 8px; left: 8px">
              <q-tooltip class="bg-white text-black" style="font-size: 15px">
                Proof Id of {{ detail.name }}
              </q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else class="text-black"></q-card>
  </q-dialog>

  <q-dialog persistent v-model="rejectdialog" transition-show="slide-up" transition-hide="slide-down">
    <q-card style="height: 500px; width: 500px;">
      <q-bar class="bg-white">
        <div class="text-h6">Give reason for rejection</div>
        <q-space />
        <q-btn dense flat class="text-red-11" icon="close" v-close-popup>
          <q-tooltip class="bg-white text-red">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-separator />
      <br>
      <br>
      <q-card-section class="flex flex-center row justify-center items-center">
        <div class="q-gutter-lg" style="width:100%">
          <q-select multiple :options="options" use-chips v-model="problem" color="primary" rounded outlined
            label="Select the problem for correction" :rules="[(val) => !!val || 'Field is required']" />
          <q-input v-model="reason" color="primary" autocomplete="on" rounded outlined placeholder="Reason"
            :rules="[(val) => !!val || 'Field is required']" />
        </div>
        <q-btn style="font-size: 120%" push color="white" @click.stop="rejects(detail.Id)" text-color="negative"
          v-close-popup label="Reject" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { AdminStore } from 'src/stores/admin-store';
import { defineComponent, watch } from 'vue';
import { Notify, Dialog } from 'quasar';

export default defineComponent({
  name: 'EverificationLists',

  setup(props) {
    const store = AdminStore()
    store.examinees_details(props.verificationStatus)
    watch(() => store.examineesidsstatus.ids.length, () => {
      if (!store.eventinprogress) store.examinees_details(props.verificationStatus)
    })
    if (props.verificationStatus === true) {
      watch(() => store.vexamineeCurrent, () => {
        store.examinees_details(props.verificationStatus)
      })
    } else {
      watch(() => store.pexamineeCurrent, () => {
        store.examinees_details(props.verificationStatus)
      })
    }
    return {
      store,
    }
  },

  data() {
    return {
      dialog: false,
      veridialog: false,
      rejectdialog: false,
      reason: <string | null>null,
      problem: <Array<string>>[],
      options: ['Problem with name', 'Problem with photo', 'Problem with ID proof'],
      detail: <{
        id: number;
        Id: string;
        name: string;
      }>{}
    };
  },

  methods: {
    showDetail(examinee: {
      id: number;
      Id: string;
      name: string;
    }) {
      this.detail = examinee
      this.store.examinee_images(examinee.Id)
      this.dialog = true
    },
    vshowDetail(examinee: {
      id: number;
      Id: string;
      name: string;
    }) {
      this.detail = examinee
      this.store.examinee_images(examinee.Id)
      this.veridialog = true
    },
    rejects(id: string) {
      if (this.reason === null || this.reason.trim().length === 0) {
        Notify.create({
          message: 'Please enter the reason properly.',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      if (this.problem.length === 0) {
        Notify.create({
          message: 'Please select the problem properly.',
          position: 'top',
          type: 'negative',
        });
        return false;
      }
      this.dialog = false
      this.veridialog = false
      this.store.disprove_examinee(id, this.reason, this.problem)
    },
    deleteuser(id: string) {
      Dialog.create({
        title: 'Confirm',
        ok: {
          'text-color': 'negative',
          flat: true,
          label: 'Yes'
        },
        message: `Do you really want to delete examinee ${id} ?`,
        cancel: {
          'text-color': 'primary',
          flat: true,
          label: 'No'
        },
        persistent: true
      })
        .onOk(() => { this.store.delete_examinee(id) })
        .onCancel(() => undefined)
    },
  },

  props: ['verificationStatus'],
});
</script>
