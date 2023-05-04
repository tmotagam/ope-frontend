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
import { Notify } from 'quasar';

import { MainStore } from './main-store';
import {
  account_commidApi,
  account_getcommApi,
  account_nameApi,
  account_passwordApi,
  delete_examineeApi,
  delete_moderatorApi,
  delete_notificationApi,
  disprove_examineeApi,
  disprove_moderatorApi,
  examineesApi,
  examinees_detailApi,
  examinee_imagesApi,
  mark_notificationApi,
  moderatorsApi,
  moderators_detailApi,
  moderator_imagesApi,
  notificationsApi,
  notifications_detailApi,
  unmark_notificationApi,
  verify_examineeApi,
  verify_moderatorApi,
} from 'src/apis/admin';

export const AdminStore = defineStore('adminstore', {
  state: () => ({
    eventSource: <EventSource | null>null,
    commid: <string | null>null,
    mainstore: MainStore(),
    eventinprogress: false,
    notificationCurrent: 1,
    notificationsids: <Array<string>>[],
    notificationsdata: <
      Array<{
        id: number;
        Id: string;
        title: string;
        detail: string;
        type: string;
        mark: boolean;
        severity: string;
        Date: Date;
      }>
    >[],
    pexamineeCurrent: 1,
    vexamineeCurrent: 1,
    examineesidsstatus: <{ ids: Array<string>; status: Array<string> }>{},
    examineesdata: <
      Array<{
        id: number;
        Id: string;
        name: string;
      }>
    >[],
    examineesimages: <Array<string>>[],
    pmoderatorCurrent: 1,
    vmoderatorCurrent: 1,
    moderatorsidsstatus: <{ ids: Array<string>; status: Array<string> }>{},
    moderatorsdata: <
      Array<{
        id: number;
        Id: string;
        name: string;
      }>
    >[],
    moderatorsimages: <Array<string>>[],
  }),
  getters: {},
  actions: {
    setcurrent(val: number, type: string) {
      if (type === 'NOTIFICATION') this.notificationCurrent = val;
      if (type === 'PEXAMINEE') this.pexamineeCurrent = val;
      if (type === 'VEXAMINEE') this.vexamineeCurrent = val;
      if (type === 'PMODERATOR') this.pmoderatorCurrent = val;
      if (type === 'VMODERATOR') this.vmoderatorCurrent = val;
    },
    sse(token: string) {
      const events = new EventSource(
        `${process.env.serverurl}api/admin/admin-event/Bearer ${token}`
      );
      this.eventSource = events;
      events.onerror = () => {
        this.eventSource = null;
        Notify.create({
          message: 'Cannot connect to the server',
          position: 'top-left',
          type: 'negative',
        });
        events.close();
      };
      events.addEventListener('ADMIN', (e) => {
        this.eventinprogress = true;
        const data = JSON.parse(e.data);
        data.notifications.forEach((e: string) => {
          this.notificationsids.unshift(e);
        });
        data.users.Type.forEach((e: string, index: number) => {
          if (e === 'MODERATOR') {
            this.moderatorsidsstatus.ids.unshift(data.users.Ids[index]);
            this.moderatorsidsstatus.status.unshift(data.users.Status[index]);
          } else if (e === 'EXAMINEE') {
            this.examineesidsstatus.ids.unshift(data.users.Ids[index]);
            this.examineesidsstatus.status.unshift(data.users.Status[index]);
          }
        });
        Notify.create({
          message: data.message,
          position: 'top-left',
          icon: 'o_notifications_active',
          type: 'info',
        });
        beep();
        this.eventinprogress = false;
      });
      events.addEventListener('ERROR', (e) => {
        if (e.data === 'Failed to verify token') {
          if (this.mainstore.expire === false) {
            this.mainstore.refreshtoken();
            this.mainstore.expire = true;
          }
          events.close();
          this.eventSource = null;
          const timer = setInterval(() => {
            if (this.mainstore.expire === false) {
              this.sse(
                typeof this.mainstore.token === 'string'
                  ? this.mainstore.token
                  : ''
              );
              clearInterval(timer);
            }
          }, 1000);
        }
        Notify.create({
          message: e.data,
          position: 'top-left',
          type: 'negative',
        });
        events.close();
        this.eventSource = null;
      });
    },
    stopsse() {
      if (this.eventSource === null) {
        throw new Error('Event Source is empty');
      }
      this.eventSource.close();
      this.eventSource = null;
    },
    async notifications() {
      this.notificationsids = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await notificationsApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.notifications().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.notificationsids = data.notification;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async notifications_details() {
      this.notificationsdata = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const list = this.notificationsids.slice(
          (this.notificationCurrent - 1) * 10,
          (this.notificationCurrent - 1) * 10 + 10
        );
        const data = await notifications_detailApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          list
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.notifications_details().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.notificationsdata = data.notification;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async mark_notification(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await mark_notificationApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.mark_notification(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.notifications_details();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async unmark_notification(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await unmark_notificationApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.unmark_notification(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.notifications_details();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async delete_notification(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await delete_notificationApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.delete_notification(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.notifications();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async examinees() {
      this.examineesidsstatus.ids = [];
      this.examineesidsstatus.status = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await examineesApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.examinees().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.examineesidsstatus.ids = data.ids;
        this.examineesidsstatus.status = data.examineestatus;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async examinees_details(status: boolean) {
      this.examineesdata = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const examineeslist = <Array<string>>[];
        const current =
          status === true ? this.vexamineeCurrent : this.pexamineeCurrent;
        if (status) {
          for (let i = 0; i < this.examineesidsstatus.status.length; i++) {
            const element = this.examineesidsstatus.status[i];
            if (element === 'Verified') {
              examineeslist.push(this.examineesidsstatus.ids[i]);
            }
          }
        } else {
          for (let i = 0; i < this.examineesidsstatus.status.length; i++) {
            const element = this.examineesidsstatus.status[i];
            if (element === 'Pending Verification') {
              examineeslist.push(this.examineesidsstatus.ids[i]);
            }
          }
        }
        const list = examineeslist.slice(
          (current - 1) * 10,
          (current - 1) * 10 + 10
        );
        const data = await examinees_detailApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          status === true ? 'Verified' : 'Pending Verification',
          list
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.examinees_details(status).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.examineesdata = data.examinees;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async examinee_images(id: string) {
      this.examineesimages = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await examinee_imagesApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.examinee_images(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.examineesimages = data.images;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async verify_examinee(id: string, status: boolean) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await verify_examineeApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.verify_examinee(id, status).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.examinees();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async disprove_examinee(
      id: string,
      reason: string,
      problem: Array<string>
    ) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const problemnum = <Array<number>>[0, 0, 0];
        for (let i = 0; i < problem.length; i++) {
          const element = problem[i];
          if (element === 'Problem with name') problemnum[0] = 1;
          else if (element === 'Problem with photo') problemnum[1] = 1;
          else if (element === 'Problem with ID proof') problemnum[2] = 1;
        }
        const data = await disprove_examineeApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id,
          reason,
          problemnum.join('')
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.disprove_examinee(id, reason, problem).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.examinees();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async delete_examinee(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await delete_examineeApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.delete_examinee(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.examinees();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async moderators() {
      this.moderatorsidsstatus.ids = [];
      this.moderatorsidsstatus.status = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await moderatorsApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.moderators().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.moderatorsidsstatus.ids = data.ids;
        this.moderatorsidsstatus.status = data.moderatorstatus;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async moderators_details(status: boolean) {
      this.moderatorsdata = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const moderatorslist = <Array<string>>[];
        const current =
          status === true ? this.vmoderatorCurrent : this.pmoderatorCurrent;
        if (status) {
          for (let i = 0; i < this.moderatorsidsstatus.status.length; i++) {
            const element = this.moderatorsidsstatus.status[i];
            if (element === 'Verified') {
              moderatorslist.push(this.moderatorsidsstatus.ids[i]);
            }
          }
        } else {
          for (let i = 0; i < this.moderatorsidsstatus.status.length; i++) {
            const element = this.moderatorsidsstatus.status[i];
            if (element === 'Pending Verification') {
              moderatorslist.push(this.moderatorsidsstatus.ids[i]);
            }
          }
        }
        const list = moderatorslist.slice(
          (current - 1) * 10,
          (current - 1) * 10 + 10
        );
        const data = await moderators_detailApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          status === true ? 'Verified' : 'Pending Verification',
          list
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.moderators_details(status).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.moderatorsdata = data.moderators;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async moderator_images(id: string) {
      this.moderatorsimages = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await moderator_imagesApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.moderator_images(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.moderatorsimages = data.images;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async verify_moderator(id: string, status: boolean) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await verify_moderatorApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.verify_moderator(id, status).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.moderators();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async disprove_moderator(
      id: string,
      reason: string,
      problem: Array<string>
    ) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const problemnum = <Array<number>>[0, 0, 0];
        for (let i = 0; i < problem.length; i++) {
          const element = problem[i];
          if (element === 'Problem with name') problemnum[0] = 1;
          else if (element === 'Problem with photo') problemnum[1] = 1;
          else if (element === 'Problem with ID proof') problemnum[2] = 1;
        }
        const data = await disprove_moderatorApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id,
          reason,
          problemnum.join('')
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.disprove_moderator(id, reason, problem).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.moderators();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async delete_moderator(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await delete_moderatorApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.delete_moderator(id).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.moderators();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async editname(name: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await account_nameApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          name
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.editname(name).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.mainstore.name = data.name;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async getcommid() {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await account_getcommApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.getcommid().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        this.commid = data.commid;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async editcommid(commid: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await account_commidApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          commid
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.editcommid(commid).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.mainstore.setRoute('/logout');
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async editpassword(opass: string, npass: string, cnpass: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await account_passwordApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          opass,
          npass,
          cnpass
        );
        if (data.status !== 200) {
          this.mainstore.busy = !this.mainstore.busy;
          if (data.error === 'Failed to verify token') {
            if (this.mainstore.expire === false) {
              this.mainstore.refreshtoken();
              this.mainstore.expire = true;
            }
            const timer = setInterval(() => {
              if (this.mainstore.expire === false) {
                this.editpassword(opass, npass, cnpass).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.mainstore.busy = !this.mainstore.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.mainstore.setRoute('/logout');
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
  },
});

const beep = () => {
  try {
    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = 0.5;
    oscillator.frequency.value = 100;
    oscillator.type = 'sine';

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 500 / 1000);
  } catch (error) {}
};
