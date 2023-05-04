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
        <q-input color="primary" autocomplete="on" type="number" rounded v-model="Vcode" outlined
          placeholder="Verification Code" :rules="[(val) => !!val || 'Field is required']" />
        <div class="row column justify-center">
          <q-btn size="20px" push color="white" @click="verify" text-color="positive" label="Verify" />
        </div>
      </div>
    </div>

    <div v-else class="desktop-window-height row justify-center items-center">
      <div class="q-gutter-md" style="width: 40%">
        <q-input color="cyan" autocomplete="on" rounded v-model="Vcode" outlined
          onkeypress="return event.charCode >= 48 && event.charCode <= 57" placeholder="Verification Code"
          :rules="[(val) => !!val || 'Field is required']" />
        <div class="row justify-center">
          <q-btn class="col-4" style="font-size: 120%" push color="white" @click="verify" text-color="positive"
            label="Verify" />
        </div>
      </div>
    </div>
  </form>

  <q-dialog v-if="$q.platform.is.mobile" v-model="dialog" persistent :maximized="true">
    <q-card v-if="change" class="text-black">
      <q-card-section v-if="!captured">
        <div class="text-h6">ID Proof Photo</div>
        <div class="q-pt-none">
          Please have your valid ID proof and your face in front of camera and then click the
          capture button
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">ID Proof Photo Captured</div>
        <div class="q-pt-none">
          Now Save the photo for verification or capture another photo
        </div>
      </q-card-section>
      <q-card-section class="mobile-window-height row justify-center items-center">
        <div class="q-gutter-md">
          <video style="display: block"></video>
          <canvas style="display: none"></canvas>
          <div v-if="!captured" class="row justify-center">
            <q-btn class="col-5" size="20px" push color="white" @click="captureimage" text-color="positive"
              label="Capture" />
          </div>
          <div v-else class="row justify-center">
            <q-btn class="col-5 on-left" size="20px" push color="white" @click="activateCamera" text-color="primary"
              label="Recapture" />
            <q-btn class="col-5 on-right" size="20px" push color="white" @click="Save_and_Exit" text-color="positive"
              label="Save" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="text-black">
      <q-card-section v-if="!captured">
        <div class="text-h6">ID Photo</div>
        <div class="q-pt-none">
          Please have your face in front of camera and then click the
          capture button
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">ID Photo Captured</div>
        <div class="q-pt-none">
          Now Save the photo for verification or capture another photo
        </div>
      </q-card-section>
      <q-card-section class="mobile-window-height row justify-center items-center">
        <div class="q-gutter-md">
          <video style="display: block"></video>
          <canvas style="display: none"></canvas>
          <div v-if="!captured" class="row justify-center">
            <q-btn class="col-5" size="20px" push color="white" @click="captureimage" text-color="positive"
              label="Capture" />
          </div>
          <div v-else class="row justify-center">
            <q-btn class="col-5 on-left" size="20px" push color="white" @click="activateCamera" text-color="primary"
              label="Recapture" />
            <q-btn class="col-5 on-right" size="20px" push color="white" @click="Save" text-color="positive"
              label="Save" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-else v-model="dialog" persistent :maximized="true">
    <q-card v-if="change" class="text-black">
      <q-card-section v-if="!captured">
        <div class="text-h6">ID Proof Photo</div>
        <div class="q-pt-none">
          Please have your valid ID proof and your face in front of camera and then click the
          capture button
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">ID Proof Photo Captured</div>
        <div class="q-pt-none">
          Now Save the photo for verification or capture another photo
        </div>
      </q-card-section>
      <q-card-section class="absolute-center">
        <video style="display: block"></video>
        <canvas style="display: none"></canvas>
        <br /><br />
        <div v-if="!captured" class="row justify-center">
          <q-btn class="col-4" v-if="err" size="20px" push color="white" @click="activateCamera" text-color="positive"
            label="Activate Camera" />
          <q-btn class="col-4" v-else style="font-size: 120%" push color="white" @click="captureimage"
            text-color="positive" label="Capture" />
        </div>
        <div v-else class="row justify-center">
          <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click="activateCamera"
            text-color="primary" label="Recapture" />
          <q-btn class="col-4 on-right" style="font-size: 120%" push color="white" @click="Save_and_Exit"
            text-color="positive" label="Save" />
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else class="text-black">
      <q-card-section v-if="!captured">
        <div class="text-h6">ID Photo</div>
        <div class="q-pt-none">
          Please have your face in front of camera and then click the
          capture button
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">ID Photo Captured</div>
        <div class="q-pt-none">
          Now Save the photo for verification or capture another photo
        </div>
      </q-card-section>
      <q-card-section class="absolute-center">
        <video style="display: block"></video>
        <canvas style="display: none"></canvas>
        <br /><br />
        <div v-if="!captured" class="row justify-center">
          <q-btn class="col-10" v-if="err" style="font-size: 120%" push color="white" @click="activateCamera"
            text-color="positive" label="Activate Camera" />
          <q-btn class="col-4" v-else style="font-size: 120%" push color="white" @click="captureimage"
            text-color="positive" label="Capture" />
        </div>
        <div v-else class="row justify-center">
          <q-btn class="col-4 on-left" style="font-size: 120%" push color="white" @click="activateCamera"
            text-color="primary" label="Recapture" />
          <q-btn class="col-4 on-right" style="font-size: 120%" push color="white" @click="Save" text-color="positive"
            label="Save" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { MainStore } from 'stores/main-store';
import { Notify, Platform, Loading } from 'quasar';

export default defineComponent({
  name: 'UserVerificationPage',

  setup() {
    const store = MainStore()
    const render = computed(() => store.busy)
    watch(render, (newValue) => {
      if (newValue && store.loading) {
        Loading.show({
          message: 'Verifying please wait...',
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
      store
    }
  },

  data() {
    return {
      camera: <MediaStream | null>null,
      change: <boolean>false,
      captured: <boolean>false,
      Vcode: <string | null>null,
      dialog: <boolean>false,
      err: false,
      images: <Array<File>>[],
      canvas: <HTMLCanvasElement | null>null,
    };
  },

  methods: {
    validate(code: string | null) {
      if (code === null || !code.trim().length) {
        Notify.create({
          message: 'Please enter the data correctly',
          position: 'top',
          type: 'negative',
        });
        return false;
      }

      return true;
    },

    Save() {
      if (this.canvas === null) {
        return -1;
      }
      this.captured = false;
      this.change = true;
      this.canvas.toBlob((blob) => {
        if (blob === null) {
          Notify.create({
            message: 'Image not captured properly',
            position: 'top',
            type: 'negative',
          });
          return
        }
        this.images.push(new File([blob], `image${this.images.length}`, { type: 'image/png' }))
      })
      this.activateCamera();
    },

    Save_and_Exit() {
      if (this.images.length === 2) {
        this.store.userverification({ code: typeof this.Vcode === 'string' ? this.Vcode : '', images: this.images }, typeof this.$route.params.verification_id === 'string' ? this.$route.params.verification_id : '', typeof this.$route.params.user_type === 'string' ? this.$route.params.user_type : '')
      } else {
        if (this.canvas === null) {
          return -1;
        }
        this.canvas.toBlob((blob) => {
          if (blob === null) {
            Notify.create({
              message: 'Image not captured properly',
              position: 'top',
              type: 'negative',
            });
            return
          }
          this.images.push(new File([blob], `image${this.images.length}`, { type: 'image/png' }))
          this.store.userverification({ code: typeof this.Vcode === 'string' ? this.Vcode : '', images: this.images }, typeof this.$route.params.verification_id === 'string' ? this.$route.params.verification_id : '', typeof this.$route.params.user_type === 'string' ? this.$route.params.user_type : '')
        })
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
    },

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

    verify() {
      const val = this.validate(this.Vcode);
      if (val && (this.$route.params.user_type === 'EXAMINEE' || this.$route.params.user_type === 'MODERATOR')) {
        this.dialog = true;
        this.activateCamera();
      } else {
        Notify.create({
          message: 'Verification link is malformed',
          position: 'top',
          type: 'negative',
        });
      }
    },
  },
});
</script>
