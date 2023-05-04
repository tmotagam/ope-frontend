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
const notificationsApi = async (token: string) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}api/moderator/notification`,
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, notification: response.notification };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const notifications_detailApi = async (token: string, data: Array<string>) => {
  try {
    const result = await fetch(
      encodeURI(
        `${
          process.env.serverurl
        }api/moderator/notification_details/${JSON.stringify({ ids: data })}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, notification: response.notification };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const mark_notificationApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/mark_notification/${id}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, message: response.message };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const unmark_notificationApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/unmark_notification/${id}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, message: response.message };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const delete_notificationApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/delete_notification/${id}`
      ),
      {
        mode: 'cors',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, message: response.message };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const searchexamineesApi = async (token: string) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}api/moderator/searchexaminees`,
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, examinees: response.examinees };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const addTestApi = async (token: string, payload: FormData) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}api/moderator/add_test`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      message: response.message,
      status: result.status,
    };
  } catch (error) {
    return { error: 'Network Error', status: 11596 };
  }
};

const testsIdsApi = async (token: string) => {
  try {
    const result = await fetch(`${process.env.serverurl}api/moderator/tests`, {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    });
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, tests: response.tests };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const tests_detailsApi = async (token: string, data: Array<string>) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/tests_detail/${JSON.stringify({
          ids: data,
        })}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, tests: response.tests };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const delete_testApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/delete_test/${id}`),
      {
        mode: 'cors',
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, message: response.message };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_nameApi = async (token: string, name: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/account_name`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ name: name }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
      name: response.name,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_getcommApi = async (token: string) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}api/moderator/account_getcomm`,
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, commid: response.commid };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_commidApi = async (token: string, commid: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/account_commid`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ commid: commid, commtype: 'EMAIL' }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_passwordApi = async (
  token: string,
  opass: string,
  npass: string,
  cnpass: string
) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/account_password`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({
          currentpassword: opass,
          newpassword: npass,
          confirmpassword: cnpass,
        }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const evaluationsApi = async (token: string) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}api/moderator/evaluations`,
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      ids: response.evaluationsIds,
      evaluationstatus: response.evaluationsStatus,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const evaluations_detailApi = async (
  token: string,
  status: boolean,
  data: Array<string>
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${
          process.env.serverurl
        }api/moderator/evaluations_details/${status}/${JSON.stringify({
          ids: data,
        })}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, evaluations: response.evaluations };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getevalApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/done_evaluation_detail/${id}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      devalquestions: response.questions,
      ischeated: response.ischeated,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getpendingevalApi = async (token: string, id: string, stage: number) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/pending_evaluation_detail/${id}/${stage}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, pevalquestions: response.questions };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const eval_examineecheatedApi = async (
  token: string,
  id: string,
  reason: string
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/eval_examinee_cheated/${id}`
      ),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ reason: reason }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return { status: result.status, message: response.message };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const eval_getvideodataApi = async (
  token: string,
  id: string,
  index: number
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/eval_video_data/${id}/${index}`
      ),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    if (result.status === 418) {
      const response = await result.json();
      return JSON.stringify({ error: response.error, status: result.status });
    }
    if (result.status !== 200) {
      const response = await result.json();
      return JSON.stringify({ error: response.error, status: result.status });
    }
    const response = await result.blob();
    return response;
  } catch (error) {
    return JSON.stringify({
      error: 'Network Error',
      status: 11596,
    });
  }
};

const eval_submitevalApi = async (
  token: string,
  id: string,
  index: number,
  iscorrect: boolean
) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/eval_answer_evaluation`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ id: id, index: index, iscorrect: iscorrect }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const eval_completedApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/moderator/eval_completed/${id}`),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const eval_submitreevalApi = async (
  token: string,
  id: string,
  index: number,
  iscorrect: boolean
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${process.env.serverurl}api/moderator/eval_answer_reevaluation`
      ),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ id: id, index: index, iscorrect: iscorrect }),
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

export {
  notificationsApi,
  notifications_detailApi,
  mark_notificationApi,
  unmark_notificationApi,
  delete_notificationApi,
  searchexamineesApi,
  addTestApi,
  testsIdsApi,
  tests_detailsApi,
  delete_testApi,
  account_commidApi,
  account_getcommApi,
  account_nameApi,
  account_passwordApi,
  evaluationsApi,
  evaluations_detailApi,
  getevalApi,
  getpendingevalApi,
  eval_examineecheatedApi,
  eval_getvideodataApi,
  eval_submitevalApi,
  eval_completedApi,
  eval_submitreevalApi,
};
