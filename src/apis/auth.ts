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
const registerApi = async (payload: string) => {
  try {
    const result = await fetch(`${process.env.serverurl}auth/register`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      msg: response.message,
      id: response.id,
      type: response.type,
      status: result.status,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const userverificationApi = async (
  payload: FormData,
  id: string,
  type: string
) => {
  try {
    const result = await fetch(
      `${process.env.serverurl}auth/userverification/${id}/${type}`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {},
        body: payload,
      }
    );
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error, status: result.status };
    }
    return {
      msg: response.message,
      status: result.status,
    };
  } catch (error) {
    return { error: 'Network Error', status: 11596 };
  }
};

const loginApi = (
  payload: string,
  worker: Worker,
  callback: (payload: string, failed?: boolean) => void
) => {
  worker.postMessage({
    payload: payload,
    type: 'login',
  });
  worker.onmessage = (e) => {
    if (e.data.error) {
      callback(JSON.stringify({ error: e.data.error }), true);
    } else {
      callback(JSON.stringify({ data: e.data.data }));
    }
  };
};

const refreshtokenApi = (
  worker: Worker,
  callback: (payload: string, failed?: boolean) => void
) => {
  worker.postMessage({
    type: 'refresh',
  });
  worker.onmessage = (e) => {
    if (e.data.error) {
      callback(JSON.stringify({ error: e.data.error }), true);
    } else {
      callback(JSON.stringify({ data: e.data.data }));
    }
  };
};

const logoutApi = (
  payload: string,
  worker: Worker,
  callback: (payload: string, failed?: boolean) => void
) => {
  worker.postMessage({
    payload: payload,
    type: 'logout',
  });
  worker.onmessage = (e) => {
    if (e.data.error) {
      callback(JSON.stringify({ error: e.data.error }), true);
    } else {
      callback(JSON.stringify({ data: e.data.data }));
    }
  };
};

const reviewApi = async (payload: FormData, code: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}auth/review/${code}/${id}`),
      {
        method: 'POST',
        mode: 'cors',
        headers: {},
        body: payload,
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

const verificationApi = async (code: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}auth/verification/${id}`),
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
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

const secureApi = async (code: string, id: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}auth/secure/${id}`),
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
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

const resetrequestApi = async (idn: string) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}auth/forgot_password/${idn}`),
      {
        mode: 'cors',
        headers: {},
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

const resetpasswordApi = async (
  code: string,
  id: string,
  pass: string,
  cpass: string
) => {
  try {
    const result = await fetch(
      encodeURI(`${process.env.serverurl}auth/reset_password/${id}/${code}`),
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: pass,
          confirmpassword: cpass,
        }),
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

export {
  registerApi,
  userverificationApi,
  loginApi,
  refreshtokenApi,
  logoutApi,
  reviewApi,
  verificationApi,
  secureApi,
  resetrequestApi,
  resetpasswordApi,
};
