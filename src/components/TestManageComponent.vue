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
    <div v-if="store.testsdata.length !== 0" class="row justify-center items-center">
        <div v-for="list in store.testsdata" v-bind:key="list._id" class="q-gutter-md" style="width: 90%">
            <br>
            <q-item class="text-info" @click.stop="displaytest(list)" clickable v-ripple>
                <q-item-section avatar top>
                    <q-icon name="o_quiz" color="info" size="34px" />
                </q-item-section>

                <q-item-section top class="col-2 gt-sm">
                    <q-item-label class="q-mt-sm">{{ list.number }}</q-item-label>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">{{ list.name }}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">The test will start at {{
                        new
                            Date(list.windowstart).toLocaleString()
                    }} and
                        end at {{ new Date(list.windowend).toLocaleString() }}</q-item-label>
                </q-item-section>

                <q-item-section top side>
                    <q-btn class="gt-xs" size="17px" color="negative" @click.stop="deletetest(list._id, list.name)" flat
                        dense round icon="o_delete" />
                </q-item-section>
            </q-item>
        </div>
    </div>

    <q-dialog v-model="display" persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
        <q-card class="text-black">
            <q-bar class="bg-white">
                <q-space />
                <q-btn dense flat class="text-red-11" icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-red">Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section>
                <div class="text-h6">Test`s name is {{ data.name }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
                This test is created on {{ new Date(data.date).toLocaleString() }}
            </q-card-section>
            <br>
            <br>
            <q-card-section class="q-pt-none text-subtitle1">
                This test will start on {{ new Date(data.windowstart).toLocaleString() }} and end on {{
                    new
                        Date(data.windowend).toLocaleString()
                }}
            </q-card-section>
            <br>
            <q-card-section class="q-pt-none text-subtitle1">
                The examinee will be allowed to take examination for {{ data.testtime[0] }} hour(s) {{
                    data.testtime[1]
                }}
                minute(s) {{ data.testtime[2] }} second(s)
            </q-card-section>
            <br>
            <q-card-section class="q-pt-none text-subtitle1">
                The examinee(s) assigned for the test are :
            </q-card-section>
            <q-card-section class="q-pt-none text-subtitle1">
                {{ data.examineelist.join(', ') }}
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { ModeratorStore } from 'src/stores/moderator-store';
import { defineComponent, watch } from 'vue';
import { Dialog } from 'quasar';

export default defineComponent({
    name: 'TestManageComponent',

    setup() {
        const store = ModeratorStore()
        store.test_details()
        watch(() => store.testCurrent, () => {
            store.test_details()
        })
        return {
            store,
        }
    },

    data() {
        return {
            display: false,
            addtests: false,
            data: <{
                _id: string;
                number: number;
                name: string;
                date: Date;
                testtime: Array<string>;
                examineelist: Array<string>;
                windowstart: Date;
                windowend: Date;
            }>{},
        }
    },

    methods: {

        displaytest(data: {
            _id: string;
            number: number;
            name: string;
            date: Date;
            testtime: Array<string>;
            examineelist: Array<string>;
            windowstart: Date;
            windowend: Date;
        }) {
            this.data = data
            this.display = true
        },

        deletetest(id: string, name: string) {
            Dialog.create({
                title: 'Confirm',
                ok: {
                    'text-color': 'negative',
                    flat: true,
                    label: 'Yes'
                },
                message: `Do you really want to delete test ${name} ?`,
                cancel: {
                    'text-color': 'primary',
                    flat: true,
                    label: 'No'
                },
                persistent: true
            })
                .onOk(() => { this.store.delete_test(id) })
                .onCancel(() => undefined)
        },
    }

});
</script>

