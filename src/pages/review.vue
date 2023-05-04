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
        <div v-if="$q.platform.is.mobile"></div>

        <div v-else class="desktop-window-height row justify-center items-center">

            <div v-if="store.review[0] === '1'" class="q-gutter-md" style="width: 40%">
                <q-input color="primary" v-model="name" autocomplete="on" rounded outlined placeholder="Enter your Name"
                    :rules="[(val) => !!val || 'Field is required']" />
                <div class="row justify-center">
                    <q-btn class="col-4 on-left" @click.stop="submit(0)" style="font-size: 120%" push color="white"
                        text-color="positive" label="Submit" />
                </div>
            </div>

            <div id="1" v-else-if="store.review[1] === '1'" class="q-gutter-md" style="width: 40%">
                <div v-if="!captured" class="text-h6">ID Photo</div>
                <div v-if="!captured" class="q-pt-none">
                    Please have your face in front of camera and then click the
                    capture button
                </div>
                <div v-if="captured" class="text-h6">ID Photo Captured</div>
                <div v-if="captured" class="q-pt-none">
                    Now Save the photo for verification or capture another photo
                </div>
                <video style="display: none"></video>
                <canvas style="display: none"></canvas>
                <div v-if="!captured" class="row justify-center">
                    <q-btn class="col-10" v-if="err" style="font-size: 120%" push color="white" @click.stop="activateCamera"
                        text-color="positive" label="Activate Camera" />
                    <q-btn class="col-4" v-else style="font-size: 120%" push color="white" @click.stop="captureimage"
                        text-color="positive" label="Capture" />
                </div>
                <div v-else class="row justify-center">
                    <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click.stop="activateCamera"
                        text-color="primary" label="Recapture" />
                    <q-btn class="col-4 on-right" style="font-size: 120%" push color="white" @click.stop="submit(1)"
                        text-color="positive" label="Submit" />
                </div>
            </div>

            <div v-else-if="store.review[2] === '1'" class="q-gutter-md" style="width: 40%">
                <div v-if="!captured" class="text-h6">ID Proof Photo</div>
                <div v-if="!captured" class="q-pt-none">
                    Please have your valid ID proof and your face in front of camera and then click the
                    capture button
                </div>
                <div v-if="captured" class="text-h6">ID Proof Photo Captured</div>
                <div v-if="captured" class="q-pt-none">
                    Now Save the photo for verification or capture another photo
                </div>
                <video style="display: none"></video>
                <canvas style="display: none"></canvas>
                <div v-if="!captured" class="row justify-center">
                    <q-btn class="col-10" v-if="err" style="font-size: 120%" push color="white" @click.stop="activateCamera"
                        text-color="positive" label="Activate Camera" />
                    <q-btn class="col-4" v-else style="font-size: 120%" push color="white" @click.stop="captureimage"
                        text-color="positive" label="Capture" />
                </div>
                <div v-else class="row justify-center">
                    <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click.stop="activateCamera"
                        text-color="primary" label="Recapture" />
                    <q-btn class="col-4 on-right" style="font-size: 120%" push color="white" @click.stop="submit(2)"
                        text-color="positive" label="Submit" />
                </div>
            </div>

            <div v-else class="q-gutter-md" style="width: 60%">
                <div class="row justify-center">
                    <q-icon class="text-grey" name="o_done_all" size="100px"></q-icon>
                </div>
                <div class="text-h5 text-grey text-center">Review Done</div>
            </div>

        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MainStore } from 'src/stores/main-store';
import { Notify, Platform, Loading } from 'quasar';

export default defineComponent({
    name: 'ReviewPage',

    setup() {
        const store = MainStore()
        watch(() => store.busy, (newValue) => {
            if (newValue && store.loading) {
                Loading.show({
                    message: 'Sending data for review please wait...',
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
        const params = useRoute().params
        store.setnewreview(typeof params.review_type === 'string' ? params.review_type.split('') : [])
        if (store.review.length > 3 || store.review.length < 3) {
            store.setnewreview(['0', '0', '0'])
            store.setRoute('/')
        } else if (store.isreviewempty) {
            store.setnewreview(['0', '0', '0'])
            store.setRoute('/')
        }
        return {
            store,
            type: typeof params.review_type === 'string' ? params.review_type.split('') : []
        }
    },

    methods: {
        async activateCamera() {
            try {
                if (this.err) this.err = false
                const constraints = Platform.is.mobile
                    ? { video: { width: 400 } }
                    : { video: { width: 720, height: 400 } };
                this.camera = await navigator.mediaDevices.getUserMedia(constraints);
                this.captured = false;
                const canvas = document.querySelector('canvas');
                if (canvas === null) {
                    return -1;
                }
                const video = document.querySelector('video');
                if (video === null) {
                    return -1;
                }
                canvas.setAttribute('style', 'display: none;');
                video.setAttribute('style', 'display: block;');
                video.srcObject = new MediaStream(this.camera.getVideoTracks());
                video.onloadedmetadata = () => {
                    video.play();
                };
            } catch (err) {
                Notify.create({
                    message: 'Please enable the camera',
                    position: 'top',
                    type: 'negative',
                });
                this.err = true
            }
        },
        async captureimage() {
            if (this.camera === null) {
                Notify.create({
                    message: 'Please enable the camera',
                    position: 'top',
                    type: 'negative',
                });
                return -1;
            }
            const video = document.querySelector('video');
            if (video === null) {
                return -1;
            }
            video.setAttribute('style', 'display: none;');
            this.canvas = document.querySelector('canvas');
            if (this.canvas === null) {
                return -1;
            }
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;
            const canvasContext = this.canvas.getContext('2d');
            if (canvasContext === null) {
                return -1;
            }
            canvasContext.drawImage(video, 0, 0);
            this.canvas.setAttribute('style', 'display: block;');
            this.captured = !this.captured;
            this.camera.getTracks()[0].stop();
            this.err = true
        },
        validate(data: string | null) {
            if (data === null || data.trim().length === 0) {
                Notify.create({
                    type: 'negative',
                    position: 'top',
                    message: 'Enter your name correctly'
                })
                return false
            }
            return true
        },
        submit(index: number) {
            if (index === 0) {
                if (!this.validate(this.name)) return
                this.store.setreview('0', index)
                if (this.store.isreviewempty) {
                    const reviewtype: Array<string> = []
                    for (let i = 0; i < this.type.length; i++) {
                        const element = this.type[i];
                        if (element === '1' && i === 0) reviewtype.push('Problem with name');
                        else if (element === '1' && i === 1) reviewtype.push('Problem with photo');
                        else if (element === '1' && i === 2) reviewtype.push('Problem with ID proof');
                    }
                    this.store.Review({ name: this.name === null ? '' : this.name, photo: this.image[0], proof: this.image[1] }, reviewtype, typeof this.$route.params.code === 'string' ? this.$route.params.code : '', typeof this.$route.params.review_id === 'string' ? this.$route.params.review_id : '')
                }
            } else if (index === 1) {
                if (this.canvas === null) {
                    return Notify.create({
                        type: 'negative',
                        position: 'top',
                        message: 'Please make sure camera is working properly'
                    })
                }
                this.canvas.toBlob((blob) => {
                    if (blob === null) {
                        return Notify.create({
                            message: 'Image not captured properly',
                            position: 'top',
                            type: 'negative',
                        });
                    }
                    this.store.setreview('0', index)
                    this.image[0] = new File([blob], `image${this.image.length}`, { type: 'image/png' })
                    this.captured = false;
                    if (this.store.isreviewempty) {
                        const reviewtype: Array<string> = []
                        for (let i = 0; i < this.type.length; i++) {
                            const element = this.type[i];
                            if (element === '1' && i === 0) reviewtype.push('Problem with name');
                            else if (element === '1' && i === 1) reviewtype.push('Problem with photo');
                            else if (element === '1' && i === 2) reviewtype.push('Problem with ID proof');
                        }
                        this.store.Review({ name: this.name === null ? '' : this.name, photo: this.image[0], proof: this.image[1] }, reviewtype, typeof this.$route.params.code === 'string' ? this.$route.params.code : '', typeof this.$route.params.review_id === 'string' ? this.$route.params.review_id : '')
                    }
                })
            } else if (index === 2) {
                if (this.canvas === null) {
                    return Notify.create({
                        type: 'negative',
                        position: 'top',
                        message: 'Please make sure camera is working properly'
                    })
                }
                this.canvas.toBlob((blob) => {
                    if (blob === null) {
                        return Notify.create({
                            message: 'Image not captured properly',
                            position: 'top',
                            type: 'negative',
                        });
                    }
                    this.store.setreview('0', index)
                    this.image[1] = new File([blob], `image${this.image.length}`, { type: 'image/png' })
                    this.captured = false;
                    if (this.store.isreviewempty) {
                        const reviewtype: Array<string> = []
                        for (let i = 0; i < this.type.length; i++) {
                            const element = this.type[i];
                            if (element === '1' && i === 0) reviewtype.push('Problem with name');
                            else if (element === '1' && i === 1) reviewtype.push('Problem with photo');
                            else if (element === '1' && i === 2) reviewtype.push('Problem with ID proof');
                        }
                        this.store.Review({ name: this.name === null ? '' : this.name, photo: this.image[0], proof: this.image[1] }, reviewtype, typeof this.$route.params.code === 'string' ? this.$route.params.code : '', typeof this.$route.params.review_id === 'string' ? this.$route.params.review_id : '')
                    }
                })
            }
        },
    },

    data() {
        return {
            name: <string | null>null,
            canvas: <HTMLCanvasElement | null>null,
            captured: false,
            camera: <MediaStream | null>null,
            err: true,
            image: [new File([new Blob()], 'photo', { type: 'image/png' }), new File([new Blob()], 'proof', { type: 'image/png' })],
        }
    }

});
</script>
