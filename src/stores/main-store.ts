// OPE Frontend
// Copyright (C) 2020-2023  Motagamwala Taha Arif Ali

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { defineStore } from 'pinia';
import { Notify, SessionStorage } from 'quasar';

import {
  loginApi,
  logoutApi,
  refreshtokenApi,
  registerApi,
  resetpasswordApi,
  resetrequestApi,
  reviewApi,
  secureApi,
  userverificationApi,
  verificationApi,
} from 'src/apis/auth';
import { AdminStore } from './admin-store';
import { ModeratorStore } from './moderator-store';

export const MainStore = defineStore('mainstore', {
  state: () => ({
    route: '/',
    Worker: new Worker(new URL('../apis/Worker.ts', import.meta.url), {
      type: 'module',
    }),
    busy: false,
    addtests: false,
    loading: false,
    token: <string | null>null,
    name: <string | null>null,
    user: <string | null>null,
    expire: false,
    review: ['0', '0', '0'],
  }),
  getters: {
    getRoute(state): string {
      return state.route;
    },
    isreviewempty(state): boolean {
      let count = 0;
      for (let i = 0; i < state.review.length; i++) {
        const element = state.review[i];
        if (element === '0') count += 1;
      }
      if (count >= 3) {
        return true;
      }
      return false;
    },
  },
  actions: {
    setreview(data: string, index: number) {
      this.review[index] = data;
    },
    setnewreview(data: Array<string>) {
      this.review = data;
    },
    setRoute(route: string): void {
      this.route = route;
      this.router.replace(route);
    },
    async register(payload: string) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        const data = await registerApi(payload);
        this.busy = !this.busy;
        this.loading = !this.loading;
        if (data.status !== 200) {
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        Notify.create({
          message: data.msg,
          position: 'top',
          type: 'positive',
        });
        this.setRoute(`/userverification/${data.type}/${data.id}`);
        return;
      } catch (error) {
        this.busy = !this.busy;
        this.loading = !this.loading;
        Notify.create({
          message: 'Network Error',
          position: 'top',
          type: 'negative',
        });
      }
    },
    async userverification(
      payload: { code: string; images: Array<File> },
      id: string,
      type: string
    ) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        const formpayload = new FormData();
        formpayload.append('code', payload.code);
        formpayload.append('images', payload.images[0]);
        formpayload.append('images', payload.images[1]);
        const data = await userverificationApi(formpayload, id, type);
        this.busy = !this.busy;
        this.loading = !this.loading;
        if (data.status !== 200) {
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        Notify.create({
          message: data.msg,
          position: 'top',
          type: 'positive',
        });
        this.setRoute('/');
      } catch (error) {
        this.busy = !this.busy;
        this.loading = !this.loading;
        Notify.create({
          message: 'Network Error',
          position: 'top',
          type: 'negative',
        });
      }
    },
    login(id: string, password: string) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        loginApi(
          JSON.stringify({ id: id, password: password }),
          this.Worker,
          this.logincallback
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    logincallback(payload: string, failed = false) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      if (failed === true) {
        Notify.create({
          message: JSON.parse(payload).error,
          position: 'top',
          type: 'negative',
        });
        return;
      }
      const data = JSON.parse(payload);
      if (data.data[1] === 'ADMIN') {
        SessionStorage.set('uim', '__a__');
        this.token = data.data[0];
        this.user = data.data[1];
        this.name = data.data[3];
        Notify.create({
          message: data.data[2],
          position: 'top',
          type: 'positive',
        });
        AdminStore().sse(typeof this.token === 'string' ? this.token : '');
        this.setRoute('/admin');
      } else if (data.data[1] === 'MODERATOR') {
        SessionStorage.set('uim', '__m__');
        this.token = data.data[0];
        this.user = data.data[1];
        this.name = data.data[3];
        Notify.create({
          message: data.data[2],
          position: 'top',
          type: 'positive',
        });
        ModeratorStore().sse(typeof this.token === 'string' ? this.token : '');
        this.setRoute('/moderator');
      } else if (data.data[2] === 'EXAMINEE') {
        open(
          `ope://login?accesstoken=${data.data[0]}&refreshtoken=${data.data[1]}&user=${data.data[2]}&name=${data.data[4]}`
        );
      }
    },
    async Review(
      payload: {
        name: string;
        photo: File;
        proof: File;
      },
      type: Array<string>,
      code: string,
      id: string
    ) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('images', payload.photo);
        formData.append('images', payload.proof);
        formData.append('type', JSON.stringify({ type: type }));
        const data = await reviewApi(formData, code, id);
        if (data.status !== 200) {
          this.busy = !this.busy;
          this.loading = !this.loading;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        this.busy = !this.busy;
        this.loading = !this.loading;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.setRoute('/');
        return true;
      } catch (error) {
        this.busy = !this.busy;
        this.loading = !this.loading;
        return false;
      }
    },
    refreshtoken() {
      this.busy = !this.busy;
      try {
        refreshtokenApi(this.Worker, this.refreshtokencallback);
        return true;
      } catch (error) {
        return false;
      }
    },
    refreshtokencallback(payload: string, failed = false) {
      this.busy = !this.busy;
      if (failed === true) {
        Notify.create({
          message: JSON.parse(payload).error,
          position: 'top',
          type: 'negative',
        });
        return;
      }
      this.expire = false;
      this.token = JSON.parse(payload).data;
    },
    logout() {
      this.busy = !this.busy;
      try {
        logoutApi(
          JSON.stringify({ token: this.token }),
          this.Worker,
          this.logoutcallback
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    logoutcallback(payload: string, failed = false) {
      this.busy = !this.busy;
      if (failed === true) {
        if (JSON.parse(payload).error === 'Failed to verify token') {
          if (this.expire === false) {
            this.refreshtoken();
            this.expire = true;
          }
          const timer = setInterval(() => {
            if (this.expire === false) {
              this.logout();
              clearInterval(timer);
            }
          }, 1000);
          return;
        }
        Notify.create({
          message: JSON.parse(payload).error,
          position: 'top',
          type: 'negative',
        });
        try {
          if (this.user === 'ADMIN') AdminStore().stopsse();
          else if (this.user === 'MODERATOR') ModeratorStore().stopsse();
        } catch (error) {}
        this.token = null;
        this.name = null;
        this.user = null;
        this.setRoute('/');
        return;
      }
      Notify.create({
        message: JSON.parse(payload).data.msg,
        position: 'top',
        type: 'positive',
      });
      try {
        if (this.user === 'ADMIN') AdminStore().stopsse();
        else if (this.user === 'MODERATOR') ModeratorStore().stopsse();
      } catch (error) {}
      this.token = null;
      this.name = null;
      this.user = null;
      this.setRoute('/');
    },
    async verification(code: string, id: string) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        const data = await verificationApi(code, id);
        if (data.status !== 200) {
          this.busy = !this.busy;
          this.loading = !this.loading;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        this.busy = !this.busy;
        this.loading = !this.loading;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.setRoute('/');
        return true;
      } catch (error) {
        this.busy = !this.busy;
        this.loading = !this.loading;
        return false;
      }
    },
    async secure(code: string, id: string) {
      this.busy = !this.busy;
      this.loading = !this.loading;
      try {
        const data = await secureApi(code, id);
        if (data.status !== 200) {
          this.busy = !this.busy;
          this.loading = !this.loading;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        this.busy = !this.busy;
        this.loading = !this.loading;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.setRoute('/');
        return true;
      } catch (error) {
        this.busy = !this.busy;
        this.loading = !this.loading;
        return false;
      }
    },
    async resetrequest(idn: string) {
      this.busy = !this.busy;
      try {
        const data = await resetrequestApi(idn);
        if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        this.busy = !this.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        return true;
      } catch (error) {
        this.busy = !this.busy;
        return false;
      }
    },
    async resetpassword(id: string, code: string, pass: string, cpass: string) {
      this.busy = !this.busy;
      try {
        const data = await resetpasswordApi(code, id, pass, cpass);
        if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return false;
        }
        this.busy = !this.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.setRoute('/');
        return true;
      } catch (error) {
        this.busy = !this.busy;
        return false;
      }
    },
  },
});
