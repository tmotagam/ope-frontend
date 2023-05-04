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
      `${process.env.serverurl}api/admin/notification`,
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
        }api/admin/notification_details/${JSON.stringify({ ids: data })}`
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
      encodeURI(`${process.env.serverurl}api/admin/mark_notification/${id}`),
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
      encodeURI(`${process.env.serverurl}api/admin/unmark_notification/${id}`),
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
      encodeURI(`${process.env.serverurl}api/admin/delete_notification/${id}`),
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

const examineesApi = async (token: string) => {
  try {
    const result = await fetch(`${process.env.serverurl}api/admin/examinees`, {
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
    return {
      status: result.status,
      ids: response.examineesIds,
      examineestatus: response.examineesStatus,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const examinees_detailApi = async (
  token: string,
  status: string,
  data: Array<string>
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${
          process.env.serverurl
        }api/admin/examinees_details/${status}/${JSON.stringify({
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
    return { status: result.status, examinees: response.examinees };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const examinee_imagesApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/examinee_images/${id}`),
      {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 200 || result.body === null) {
      return { error: response.error, status: result.status };
    }
    return {
      status: result.status,
      images: response.images,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const verify_examineeApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/verify_examinee/${id}`),
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

const disprove_examineeApi = async (
  token: string,
  id: string,
  reason: string,
  problem: string
) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/disprove_examinee/${id}`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
        body: JSON.stringify({ reason: reason, type: problem }),
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

const delete_examineeApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/delete_examinee/${id}`),
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

const moderatorsApi = async (token: string) => {
  try {
    const result = await fetch(`${process.env.serverurl}api/admin/moderators`, {
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
    return {
      status: result.status,
      ids: response.moderatorsIds,
      moderatorstatus: response.moderatorsStatus,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const moderators_detailApi = async (
  token: string,
  status: string,
  data: Array<string>
) => {
  try {
    const result = await fetch(
      encodeURI(
        `${
          process.env.serverurl
        }api/admin/moderators_details/${status}/${JSON.stringify({
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
    return { status: result.status, moderators: response.moderators };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const moderator_imagesApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/moderator_images/${id}`),
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
    return { status: result.status, images: response.images };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const verify_moderatorApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/verify_moderator/${id}`),
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

const disprove_moderatorApi = async (
  token: string,
  id: string,
  reason: string,
  problem: string
) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/disprove_moderator/${id}`),
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
        body: JSON.stringify({ reason: reason, type: problem }),
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

const delete_moderatorApi = async (token: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}api/admin/delete_moderator/${id}`),
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
      encodeURI(`${process.env.serverurl}api/admin/account_name`),
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
      `${process.env.serverurl}api/admin/account_getcomm`,
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
      encodeURI(`${process.env.serverurl}api/admin/account_commid`),
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
      encodeURI(`${process.env.serverurl}api/admin/account_password`),
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

export {
  notificationsApi,
  notifications_detailApi,
  mark_notificationApi,
  unmark_notificationApi,
  delete_notificationApi,
  examineesApi,
  examinees_detailApi,
  examinee_imagesApi,
  verify_examineeApi,
  disprove_examineeApi,
  delete_examineeApi,
  moderatorsApi,
  moderators_detailApi,
  moderator_imagesApi,
  verify_moderatorApi,
  disprove_moderatorApi,
  delete_moderatorApi,
  account_nameApi,
  account_getcommApi,
  account_commidApi,
  account_passwordApi,
};
