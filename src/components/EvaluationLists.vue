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
    <div v-if="!EvaluationStatus">
        <div v-for="evaluation in store.evaluationsdata" @click.stop="showDetail(evaluation)" v-bind:key="evaluation.Id">
            <br />
            <q-item class="text-teal-14" clickable v-ripple>
                <q-item-section avatar top>
                    <q-icon name="o_how_to_reg" color="teal-14" size="34px" />
                </q-item-section>

                <q-item-section top class="col-2 gt-sm">
                    <q-item-label class="q-mt-sm">{{ evaluation.id }}</q-item-label>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">{{ evaluation.Id }}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">{{ evaluation.name }}`s Pending Evaluation</q-item-label>
                </q-item-section>

                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="15px" color="positive" @click.stop="store.eval_completed(evaluation.Id)"
                            flat dense round icon="done">
                            <q-tooltip class="bg-white text-black" style="font-size: 15px">Evaluation Completed</q-tooltip>
                        </q-btn>
                    </div>
                </q-item-section>
            </q-item>
        </div>
    </div>
    <div v-if="EvaluationStatus">
        <div v-for="evaluation in store.evaluationsdata" @click.stop="vshowDetail(evaluation)" v-bind:key="evaluation.Id">
            <br />
            <q-item class="text-positive" clickable v-ripple>
                <q-item-section avatar top>
                    <q-icon name="o_verified" color="positive" size="34px" />
                </q-item-section>

                <q-item-section top class="col-2 gt-sm">
                    <q-item-label class="q-mt-sm">{{ evaluation.id }}</q-item-label>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">{{ evaluation.Id }}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">{{ evaluation.name }}`s evaluated Evaluation</q-item-label>
                </q-item-section>

                <q-item-section top side v-if="evaluation.cheated === false">
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="15px" @click.stop="revshowDetail(evaluation)" color="positive" flat dense
                            round icon="published_with_changes">
                            <q-tooltip class="bg-white text-black" style="font-size: 15px">Reevaluate</q-tooltip>
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
                <div style="font-size: 20px;">Evaluation Id: {{ detail.Id }}</div>
            </q-card-section>
            <q-card-section v-if="store.PendingEvaluation.Stage === 1">
                <div style="font-size: 18px;">Marks Obtained: {{ store.PendingEvaluation.Marksobtained }} / {{
                    store.PendingEvaluation.Totalmarks }}</div>
            </q-card-section>
            <q-card-section v-if="store.PendingEvaluation.Stage === 1 && !(store.question &&
                Object.keys(store.question).length === 0 &&
                store.question.constructor === Object)">
                <div style="font-size: 18px;">Marks Obtained in this question: {{ store.question.obtainmarks === null ? 0 :
                    store.question.obtainmarks }} / {{
        store.question.marks }}</div>
            </q-card-section>
            <q-card-section v-if="store.PendingEvaluation.Stage === 0">
                <q-carousel control-color="black" class="shadow-2 rounded-borders" arrows animated v-model="slide"
                    height="600px">
                    <q-carousel-slide :name="1" class="column no-wrap">
                        <div class="q-gutter-xl flex flex-center row justify-center items-center">
                            <q-img fit="contain" width="500px" height="500px"
                                :src="'data:image/png;base64,' + store.PendingEvaluation.Images[0]">
                                <div class="absolute-bottom custom-caption">
                                    <div class="text-subtitle1">During Registeration</div>
                                </div>
                            </q-img>
                            <q-img fit="contain" width="500px" height="500px"
                                :src="'data:image/png;base64,' + store.PendingEvaluation.Images[1]">
                                <div class="absolute-bottom custom-caption">
                                    <div class="text-subtitle1">During Examination</div>
                                </div>
                            </q-img>
                            <div class="absolute-bottom custom-caption">
                                <div class="text-h2">Photo Id of Examinee</div>
                            </div>
                        </div>
                    </q-carousel-slide>
                    <q-carousel-slide :name="2" class="column no-wrap">
                        <div class="q-gutter-xl flex flex-center row justify-center items-center">
                            <q-img fit="contain" width="500px" height="500px"
                                :src="'data:image/png;base64,' + store.PendingEvaluation.Images[2]">
                                <div class="absolute-bottom custom-caption">
                                    <div class="text-subtitle1">During Registeration</div>
                                </div>
                            </q-img>
                            <q-img fit="contain" width="500px" height="500px"
                                :src="'data:image/png;base64,' + store.PendingEvaluation.Images[3]">
                                <div class="absolute-bottom custom-caption">
                                    <div class="text-subtitle1">During Examination</div>
                                </div>
                            </q-img>
                            <div class="absolute-bottom custom-caption">
                                <div class="text-h2">Proof Id of Examinee</div>
                            </div>
                        </div>
                    </q-carousel-slide>
                </q-carousel>
            </q-card-section>
            <q-card-section v-else>
                <q-scroll-area class="bg-grey-1 rounded-borders" :bar-style="barStyle"
                    :horizontal-thumb-style="horizontalthumbStyle" style="height: 60px; width: 100%">
                    <div class="row no-wrap">
                        <div v-for="i in store.PendingEvaluation.Question" v-bind:key="i.index">
                            <q-chip @click.stop="selectques(i)" :selected="store.question.index === i.index" clickable
                                icon="quiz" size="20px" color="white" text-color="primary">
                                Question No: {{ i.questionnumber }} | Section: {{ i.section }}
                                <q-tooltip class="bg-white text-black" style="font-size: 15px">{{ i.question }}</q-tooltip>
                            </q-chip>
                        </div>
                    </div>
                </q-scroll-area>
                <br>
                <video :src="store.pendingvideo" style="display: block; margin: 0 auto;" width="500" height="300" controls
                    v-if="!(store.question && Object.keys(store.question).length === 0 && store.question.constructor === Object)">
                </video>
                <br>
                <q-card v-if="!(store.question &&
                        Object.keys(store.question).length === 0 &&
                        store.question.constructor === Object)" class="my-card">
                    <q-scroll-area :bar-style="barStyle" :vertical-thumb-style="verticalthumbStyle" visible
                        style="height: 45vh; width: 100%">
                        <q-item>
                            <q-item-section side>
                                <q-item-label style="font-size: 25px">Q{{ store.question.questionnumber }}.</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label style="font-size: 25px">{{
                                    store.question.question
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <br />
                        <div v-if="store.question.type === 'multiple'">
                            <div v-for="option in store.question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-checkbox disable :val="option" :model-value="store.question.markedoption" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label style="font-size: 25px">{{ option
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                        <div v-if="store.question.type === 'single'">
                            <div v-for="option in store.question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-radio disable :model-value="store.question.markedoption" :val="option" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label style="font-size: 25px">{{ option
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                    </q-scroll-area>
                </q-card>
            </q-card-section>
            <q-card-actions align="center" v-if="store.PendingEvaluation.Stage === 0 && slide === 2">
                <q-btn class="q-ma-lg" label='Examinee is genuine' @click.stop="store.getpendingeval(detail.Id, 1)"
                    style="font-size: 120%" push color="white" text-color="positive" />
                <q-btn class="q-ma-lg" label='Examinee is not genuine' @click.stop="rejectdialog = true"
                    style="font-size: 120%" push color="white" text-color="negative" />
            </q-card-actions>
            <q-card-actions align="center" v-else-if="store.PendingEvaluation.Stage === 1 && !(store.question &&
                    Object.keys(store.question).length === 0 &&
                    store.question.constructor === Object)">
                <q-btn
                    v-if="store.question.obtainmarks === null && store.question.skipped === false && store.question.answered === true"
                    class="q-ma-lg" label='Answer is correct'
                    @click.stop="store.submiteval(detail.Id, store.question.index, true)" style="font-size: 120%" push
                    color="white" text-color="positive" />
                <q-btn
                    v-if="store.question.obtainmarks === null && store.question.skipped === false && store.question.answered === true"
                    class="q-ma-lg" label='Answer is incorrect'
                    @click.stop="store.submiteval(detail.Id, store.question.index, false)" style="font-size: 120%" push
                    color="white" text-color="primary" />
                <q-btn class="q-ma-lg" label='Examinee is cheating' @click.stop="rejectdialog = true"
                    style="font-size: 120%" push color="white" text-color="negative" />
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
                <div style="font-size: 20px;">Evaluation Id: {{ detail.Id }}</div>
            </q-card-section>
            <q-card-section>
                <div style="font-size: 18px;">Marks Obtained: {{ store.evaluated_questions.marksobtained }} / {{
                    store.evaluated_questions.totalmarks }}</div>
            </q-card-section>
            <q-card-section v-for="question in store.evaluated_questions.answers" v-bind:key="question.index">
                <q-card class="my-card">
                    <q-scroll-area :bar-style="barStyle" :vertical-thumb-style="verticalthumbStyle" visible
                        style="height: 45vh; width: 100%">
                        <q-item>
                            <q-item-section side>
                                <q-item-label style="font-size: 25px">Q{{ question.questionnumber }}.</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label style="font-size: 25px">{{
                                    question.question
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <br />
                        <div v-if="question.type === 'multiple'">
                            <div v-for="option in question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-checkbox disable :val="option"
                                            :color="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option)"
                                            :model-value="question.markedoption" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === undefined"
                                            style="font-size: 25px">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'positive'"
                                            style="font-size: 25px; color: #3de09c;">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'negative'"
                                            style="font-size: 25px; color: #db162f;">{{ option
                                            }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                        <div v-if="question.type === 'single'">
                            <div v-for="option in question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-radio disable :model-value="question.markedoption"
                                            :color="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option)"
                                            :val="option" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === undefined"
                                            style="font-size: 25px">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'positive'"
                                            style="font-size: 25px; color: #3de09c;">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'negative'"
                                            style="font-size: 25px; color: #db162f;">{{ option
                                            }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                    </q-scroll-area>
                    <div class="row justify-center">
                        <div style="font-size: 20px;" class="q-ma-lg">Marks Obtained: {{ question.obtainmarks === null ? 0 :
                            question.obtainmarks }} / {{
        question.marks }}</div>
                        <div style="font-size: 20px;" class="q-ma-lg">{{ question.skipped === true ? 'Skipped' :
                            question.answered === true ? 'Answered' : 'Not Answered' }}</div>
                    </div>
                    <br>
                </q-card>
                <br>
            </q-card-section>
        </q-card>
        <q-card v-else class="text-black"></q-card>
    </q-dialog>

    <q-dialog v-model="reveridialog" persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
        <q-card v-if="!store.mainstore.busy" class="text-black">
            <q-bar class="bg-white">
                <q-space />
                <q-btn dense flat class="text-red-11" icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-red">Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section>
                <div style="font-size: 20px;">Evaluation Id: {{ detail.Id }}</div>
            </q-card-section>
            <q-card-section>
                <div style="font-size: 18px;">Total Marks Obtained: {{ store.evaluated_questions.marksobtained }} / {{
                    store.evaluated_questions.totalmarks }}</div>
            </q-card-section>
            <q-card-section v-for="question in store.evaluated_questions.answers" v-bind:key="question.index">
                <q-card class="my-card">
                    <div style="font-size: 20px;" class="q-ma-lg">Marks Obtained: {{ question.obtainmarks === null ? 0 :
                        question.obtainmarks }} / {{
        question.marks }}</div>
                    <q-scroll-area :bar-style="barStyle" :vertical-thumb-style="verticalthumbStyle" visible
                        style="height: 45vh; width: 100%">
                        <q-item>
                            <q-item-section side>
                                <q-item-label style="font-size: 25px">Q{{ question.questionnumber }}.</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label style="font-size: 25px">{{
                                    question.question
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <br />
                        <div v-if="question.type === 'multiple'">
                            <div v-for="option in question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-checkbox disable :val="option"
                                            :color="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option)"
                                            :model-value="question.markedoption" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === undefined"
                                            style="font-size: 25px">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'positive'"
                                            style="font-size: 25px; color: #3de09c;">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'negative'"
                                            style="font-size: 25px; color: #db162f;">{{ option
                                            }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                        <div v-if="question.type === 'single'">
                            <div v-for="option in question.option" v-bind:key="option">
                                <q-item tag="label" v-ripple>
                                    <q-item-section side>
                                        <q-radio disable :model-value="question.markedoption"
                                            :color="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option)"
                                            :val="option" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === undefined"
                                            style="font-size: 25px">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'positive'"
                                            style="font-size: 25px; color: #3de09c;">{{ option
                                            }}</q-item-label>
                                        <q-item-label
                                            v-if="getcolor(question.markedoption, question.obtainmarks === null ? 0 : question.obtainmarks, option) === 'negative'"
                                            style="font-size: 25px; color: #db162f;">{{ option
                                            }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <br />
                            </div>
                        </div>
                    </q-scroll-area>
                    <div class="row justify-center">
                        <q-btn class="q-ma-lg" label='Answer is correct'
                            v-if="question.answered === true && question.skipped === false"
                            @click.stop="store.submitreeval(detail.Id, question.index, true)" style="font-size: 120%" push
                            color="white" text-color="positive" />
                        <q-btn class="q-ma-lg" label='Answer is incorrect'
                            v-if="question.answered === true && question.skipped === false"
                            @click.stop="store.submitreeval(detail.Id, question.index, false)" style="font-size: 120%" push
                            color="white" text-color="primary" />
                    </div>
                    <br>
                </q-card>
                <br>
            </q-card-section>
        </q-card>
        <q-card v-else class="text-black"></q-card>
    </q-dialog>

    <q-dialog persistent v-model="rejectdialog" transition-show="slide-up" transition-hide="slide-down">
        <q-card style="height: 300px; width: 500px;">
            <q-bar class="bg-white">
                <div class="text-h6">Give reason</div>
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
                    <q-input v-model="reason" color="primary" autocomplete="on" rounded outlined placeholder="Reason"
                        :rules="[(val) => !!val || 'Field is required']" />
                </div>
                <q-btn style="font-size: 120%" push color="white" @click.stop="rejects(detail.Id)" text-color="negative"
                    v-close-popup label="Submit" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { Notify } from 'quasar';
import { ModeratorStore } from 'src/stores/moderator-store';

export default defineComponent({
    name: 'EvaluationLists',

    setup(props) {
        const store = ModeratorStore()
        store.evaluations_details(props.EvaluationStatus)
        if (props.EvaluationStatus === true) {
            watch(() => store.devaluationCurrent, () => {
                store.evaluations_details(props.EvaluationStatus)
            })
        } else {
            watch(() => store.pevaluationCurrent, () => {
                store.evaluations_details(props.EvaluationStatus)
            })
        }
        return {
            store,
            verticalthumbStyle: {
                borderRadius: '100px',
                backgroundColor: '#00b4ff',
                width: '8px',
            },

            barStyle: {
                borderRadius: '100px',
                boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
            },
            horizontalthumbStyle: {
                borderRadius: '100px',
                backgroundColor: '#00b4ff',
                width: '5px',
            },
        }
    },

    data() {
        return {
            dialog: false,
            veridialog: false,
            reveridialog: false,
            rejectdialog: false,
            reason: <string | null>null,
            slide: 1,
            detail: <{
                id: number;
                Id: string;
                name: string;
            }>{}
        };
    },

    methods: {
        selectques(question: {
            type: 'multiple' | 'single';
            marks: number;
            index: number;
            section: string;
            questionnumber: number;
            question: string;
            option: string[];
            answered: boolean;
            skipped: boolean;
            markedoption: never;
            obtainmarks: number | null;
        }) {
            this.store.getvideodata(question.index, this.detail.Id)
            this.store.question = question
        },
        showDetail(evaluation: {
            id: number;
            Id: string;
            name: string;
        }) {
            this.detail = evaluation
            this.store.getpendingeval(evaluation.Id, 0)
            this.dialog = true
        },
        vshowDetail(evaluation: {
            id: number;
            Id: string;
            name: string;
        }) {
            this.detail = evaluation
            this.store.getevaldetail(evaluation.Id)
            this.veridialog = true
        },
        revshowDetail(evaluation: {
            id: number;
            Id: string;
            name: string;
        }) {
            this.detail = evaluation
            this.store.getevaldetail(evaluation.Id)
            this.reveridialog = true
        },
        getcolor(markedoption: string | string[], obtainmarks: number, option: string) {
            if (typeof markedoption === 'string') {
                if (markedoption === option) {
                    if (obtainmarks > 0) {
                        return 'positive'
                    } else {
                        return 'negative'
                    }
                } else {
                    return undefined
                }
            } else if (Array.isArray(markedoption)) {
                if (markedoption.find(v => v === option) === option) {
                    if (obtainmarks > 0) {
                        return 'positive'
                    } else {
                        return 'negative'
                    }
                } else {
                    return undefined
                }
            } else {
                undefined
            }
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
            this.dialog = false
            this.rejectdialog = false
            this.store.eval_examineecheated(id, this.reason)
        },
    },

    props: ['EvaluationStatus'],
});
</script>
