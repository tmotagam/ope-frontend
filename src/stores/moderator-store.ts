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

import {
  notificationsApi,
  searchexamineesApi,
  addTestApi,
  notifications_detailApi,
  mark_notificationApi,
  unmark_notificationApi,
  delete_notificationApi,
  testsIdsApi,
  tests_detailsApi,
  delete_testApi,
  account_commidApi,
  account_getcommApi,
  account_nameApi,
  account_passwordApi,
  evaluations_detailApi,
  evaluationsApi,
  getevalApi,
  getpendingevalApi,
  eval_examineecheatedApi,
  eval_getvideodataApi,
  eval_submitevalApi,
  eval_completedApi,
  eval_submitreevalApi,
} from 'src/apis/moderator';
import { MainStore } from './main-store';

interface paper {
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
}

export const ModeratorStore = defineStore('moderatorstore', {
  state: () => ({
    eventSource: <EventSource | null>null,
    mainstore: MainStore(),
    commid: <string | null>null,
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
    elist: <Array<{ value: string; label: string }>>[],
    testsids: <Array<string>>[],
    testsdata: <
      Array<{
        _id: string;
        number: number;
        name: string;
        date: Date;
        testtime: Array<string>;
        examineelist: Array<string>;
        windowstart: Date;
        windowend: Date;
      }>
    >[],
    testCurrent: 1,
    pevaluationCurrent: 1,
    devaluationCurrent: 1,
    evaluationsidsstatus: <{ ids: Array<string>; status: Array<boolean> }>{},
    evaluationsdata: <
      Array<{
        id: number;
        Id: string;
        name: string;
        cheated: boolean;
      }>
    >[],
    evaluated_questions: <
      {
        totalmarks: number;
        marksobtained: number;
        answers: paper[];
        ischeated: boolean;
      }
    >{},
    PendingEvaluation: <
      {
        Stage: number;
        userId: string;
        Images: string[];
        Question: paper[];
        Totalmarks: number;
        Marksobtained: number;
      }
    >{},
    pendingvideo: '',
    question: <
      {
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
      }
    >{},
  }),
  getters: {},
  actions: {
    setcurrent(val: number, type: string) {
      if (type === 'NOTIFICATION') this.notificationCurrent = val;
      if (type === 'MANAGETEST') this.testCurrent = val;
    },
    sse(token: string) {
      const events = new EventSource(
        `${process.env.serverurl}api/moderator/moderator-event/Bearer ${token}`
      );
      this.eventSource = events;
      events.onerror = () => {
        this.eventSource = null;
        events.close();
        setTimeout(() => {
          this.sse(
            typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
          );
        }, 5000);
      };
      events.addEventListener('MODERATOR', (e) => {
        this.eventinprogress = true;
        const data = JSON.parse(e.data);
        data.notifications.forEach((e: string) => {
          this.notificationsids.unshift(e);
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
        setTimeout(() => {
          this.sse(
            typeof this.mainstore.token === 'string' ? this.mainstore.token : ''
          );
        }, 5000);
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
    async search() {
      this.elist = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await searchexamineesApi(
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
                this.search().then().catch();
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
        this.elist = data.examinees;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async addtest(payload: FormData) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await addTestApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          payload
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
                this.addtest(payload).then().catch();
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
        this.tests();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async tests() {
      this.testsids = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await testsIdsApi(
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
                this.tests().then().catch();
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
        this.testsids = data.tests;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async test_details() {
      this.testsdata = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const list = this.testsids.slice(
          (this.testCurrent - 1) * 10,
          (this.testCurrent - 1) * 10 + 10
        );
        const data = await tests_detailsApi(
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
                this.test_details().then().catch();
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
        this.testsdata = data.tests;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async delete_test(id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await delete_testApi(
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
                this.delete_test(id).then().catch();
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
        this.tests();
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
    async evaluations() {
      this.evaluationsidsstatus.ids = [];
      this.evaluationsidsstatus.status = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await evaluationsApi(
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
                this.evaluations().then().catch();
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
        this.evaluationsidsstatus.ids = data.ids;
        this.evaluationsidsstatus.status = data.evaluationstatus;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async evaluations_details(status: boolean) {
      this.evaluationsdata = [];
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const evaluationslist = <Array<string>>[];
        const current =
          status === true ? this.devaluationCurrent : this.pevaluationCurrent;
        if (status) {
          for (let i = 0; i < this.evaluationsidsstatus.status.length; i++) {
            const element = this.evaluationsidsstatus.status[i];
            if (element === true) {
              evaluationslist.push(this.evaluationsidsstatus.ids[i]);
            }
          }
        } else {
          for (let i = 0; i < this.evaluationsidsstatus.status.length; i++) {
            const element = this.evaluationsidsstatus.status[i];
            if (element === false) {
              evaluationslist.push(this.evaluationsidsstatus.ids[i]);
            }
          }
        }
        const list = evaluationslist.slice(
          (current - 1) * 10,
          (current - 1) * 10 + 10
        );
        const data = await evaluations_detailApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          status,
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
                this.evaluations_details(status).then().catch();
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
        this.evaluationsdata = data.evaluations;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async getevaldetail(id: string) {
      this.evaluated_questions = {} as {
        totalmarks: number;
        marksobtained: number;
        answers: paper[];
        ischeated: boolean;
      };
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await getevalApi(
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
                this.getevaldetail(id).then().catch();
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
        this.evaluated_questions = data.devalquestions;
        this.evaluated_questions.ischeated = data.ischeated;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async getpendingeval(id: string, stage: number) {
      this.PendingEvaluation = {} as {
        Stage: number;
        userId: string;
        Images: string[];
        Question: paper[];
        Totalmarks: number;
        Marksobtained: number;
      };
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await getpendingevalApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id,
          stage
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
                this.getpendingeval(id, stage).then().catch();
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
        this.PendingEvaluation = data.pevalquestions;
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async eval_examineecheated(id: string, reason: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await eval_examineecheatedApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id,
          reason
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
                this.eval_examineecheated(id, reason).then().catch();
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
        this.evaluations();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async getvideodata(index: number, id: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        this.pendingvideo = '';
        const data = await eval_getvideodataApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          id,
          index
        );
        if (typeof data === 'string') {
          this.mainstore.busy = !this.mainstore.busy;
          if (JSON.parse(data).status === 418) {
            Notify.create({
              message: JSON.parse(data).error,
              position: 'top',
              type: 'info',
            });
            return;
          } else {
            if (JSON.parse(data).error === 'Failed to verify token') {
              if (this.mainstore.expire === false) {
                this.mainstore.refreshtoken();
                this.mainstore.expire = true;
              }
              const timer = setInterval(() => {
                if (this.mainstore.expire === false) {
                  this.getvideodata(index, id).then().catch();
                  clearInterval(timer);
                }
              }, 1000);
              return;
            }
            Notify.create({
              message: JSON.parse(data).error,
              position: 'top',
              type: 'negative',
            });
            return;
          }
        } else {
          this.mainstore.busy = !this.mainstore.busy;
          this.pendingvideo = window.URL.createObjectURL(data);
        }
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async submiteval(eid: string, qindex: number, iscorrect: boolean) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await eval_submitevalApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          eid,
          qindex,
          iscorrect
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
                this.submiteval(eid, qindex, iscorrect).then().catch();
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
        this.PendingEvaluation.Question = JSON.parse(data.data).answers;
        this.PendingEvaluation.Marksobtained = JSON.parse(
          data.data
        ).marksobtained;
        this.question = JSON.parse(data.data).answers[this.question.index];
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async eval_completed(eid: string) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await eval_completedApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          eid
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
                this.eval_completed(eid).then().catch();
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
        this.evaluations();
      } catch (error) {
        this.mainstore.busy = !this.mainstore.busy;
        return;
      }
    },
    async submitreeval(eid: string, qindex: number, iscorrect: boolean) {
      this.mainstore.busy = !this.mainstore.busy;
      try {
        const data = await eval_submitreevalApi(
          typeof this.mainstore.token === 'string' ? this.mainstore.token : '',
          eid,
          qindex,
          iscorrect
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
                this.submitreeval(eid, qindex, iscorrect).then().catch();
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
        this.evaluated_questions.answers = JSON.parse(data.data).answers;
        this.evaluated_questions.marksobtained = JSON.parse(
          data.data
        ).marksobtained;
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
