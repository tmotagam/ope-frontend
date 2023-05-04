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
export {};

let RefreshToken: string | null = null;

addEventListener('message', (e) => {
  if (e instanceof MessageEvent) {
    if (e.data.type === 'login') {
      startlogin(
        JSON.parse(e.data.payload).id,
        JSON.parse(e.data.payload).password
      )
        .then((data) => {
          if (Array.isArray(data)) {
            if (data.length === 5) {
              postMessage({ data: data });
            } else {
              postMessage({ data: data });
            }
          } else {
            postMessage({ error: data });
          }
        })
        .catch((err) => {
          postMessage({ error: err });
        });
    } else if (e.data.type === 'refresh') {
      refreshtoken()
        .then((data) => {
          if (data.token === undefined) {
            postMessage({ error: data.error });
          } else {
            postMessage({ data: data.token });
          }
        })
        .catch((err) => {
          postMessage({ error: err });
        });
    } else if (e.data.type === 'logout') {
      logout(JSON.parse(e.data.payload).token)
        .then((data) => {
          if (data.msg !== undefined) {
            postMessage({ data: data });
          } else {
            postMessage({ error: data });
          }
        })
        .catch((err) => {
          postMessage(err);
        });
    } else {
      postMessage('Error: Cannot understand types');
    }
  }
});

const RandomString = () => {
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.';
  let random = '';
  const randomValues = Array.from(crypto.getRandomValues(new Uint8Array(512)));
  randomValues.forEach((v) => (random += charset[v % charset.length]));
  return random;
};

const sha256 = async (data: string) => {
  const digestOp = crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data)
  );
  return digestOp;
};

const ToBase64Url = (data: ArrayBuffer) => {
  const Uintdata = new Uint8Array(data);
  return btoa(String.fromCharCode(...Array.from(Uintdata)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

function createVerifier() {
  return RandomString();
}

function createState() {
  return RandomString();
}

async function createChallenge(verifier: string) {
  const digest = await sha256(verifier);
  return ToBase64Url(digest);
}

async function startlogin(
  id: string,
  password: string
): Promise<string[] | string> {
  const verifier = createVerifier();
  const challenge = await createChallenge(verifier);
  const state = createState();
  const authorizeresult = await authorize(id, challenge, state);
  if (authorizeresult.status !== 302) {
    return authorizeresult.error;
  }
  const loginresult = await login(id, password, state);
  if (loginresult.status !== 302 || loginresult.code === undefined) {
    return loginresult.error;
  }
  const code = loginresult.code;
  const result = await token(id, code, state, verifier);
  if (result.status !== 200) {
    return result.error;
  }
  if (result.user === 'EXAMINEE') {
    return [
      result.accesstoken,
      result.refreshtoken,
      result.user,
      result.msg,
      result.name,
    ];
  }
  RefreshToken = result.refreshtoken;
  return [result.accesstoken, result.user, result.msg, result.name];
}

async function authorize(id: string, challenge: string, state: string) {
  try {
    const result = await fetch(
      `${process.env.serverurl}oauth/authorize/${id}/S256/${challenge}/${state}`,
      {
        mode: 'cors',
        headers: {},
        cache: 'no-cache',
      }
    );
    const response = await result.json();
    if (result.status !== 302) {
      return { error: response.error, status: result.status };
    }
    if (state === response.state) {
      return { status: result.status };
    } else {
      return { error: 'Server compromised', status: 11000 };
    }
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
}

async function login(id: string, password: string, state: string) {
  const data = JSON.stringify({
    id: id,
    password: password,
  });
  try {
    const result = await fetch(`${process.env.serverurl}auth/login/${state}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    const response = await result.json();
    if (result.status !== 302) {
      return { error: response.error, status: result.status };
    }
    if (state === response.state) {
      return { code: response.code, status: result.status };
    } else {
      return { error: 'Server compromised', status: 11000 };
    }
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
}

async function token(
  id: string,
  code: string,
  state: string,
  verifier: string
) {
  try {
    const result = await fetch(
      `${process.env.serverurl}oauth/token/${id}/${verifier}/${code}/${state}`,
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
    if (state === response.state) {
      return {
        accesstoken: response.accesstoken,
        refreshtoken: response.refreshtoken,
        user: response.user,
        msg: response.msg,
        name: response.name,
        status: result.status,
      };
    } else {
      return { error: 'Server compromised', status: 11000 };
    }
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
}

async function refreshtoken(): Promise<{ token?: string; error: unknown }> {
  try {
    const result = await fetch(`${process.env.serverurl}oauth/refresh_token/`, {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${RefreshToken}`,
      },
    });
    const response = await result.json();
    if (result.status !== 200) {
      return { error: response.error };
    }
    RefreshToken = response.refreshtoken;
    return { token: response.accesstoken, error: 'null' };
  } catch (error) {
    return {
      error: 'Network Error',
    };
  }
}

async function logout(token: string) {
  try {
    const result = await fetch(`${process.env.serverurl}auth/logout/`, {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await result.json();
    if (result.status !== 200) {
      return response.error;
    }
    RefreshToken = null;
    return { msg: response.msg };
  } catch (error) {
    return {
      error: 'Network Error',
    };
  }
}
