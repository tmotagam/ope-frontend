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
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login.vue') },
      { path: 'register', component: () => import('pages/register.vue') },
      { path: 'logout', component: () => import('pages/logout.vue') },
      { path: 'download', component: () => import('pages/download.vue') },
      {
        path: 'reset_password/:code/:reset_id',
        component: () => import('pages/reset.vue'),
      },
      {
        path: 'userverification/:user_type/:verification_id',
        component: () => import('src/pages/userverification.vue'),
      },
      {
        path: 'verification/:code/:verification_id',
        component: () => import('src/pages/verification.vue'),
      },
      {
        path: 'review/:code/:review_id/:review_type',
        component: () => import('src/pages/review.vue'),
      },
      {
        path: 'secure/:code/:secure_id',
        component: () => import('src/pages/secure.vue'),
      },
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/notification.vue'),
      },
      {
        path: 'examinees',
        component: () => import('pages/admin/examinees.vue'),
      },
      {
        path: 'moderators',
        component: () => import('pages/admin/moderators.vue'),
      },
      {
        path: 'account',
        component: () => import('pages/admin/account.vue'),
      },
    ],
  },

  {
    path: '/moderator',
    component: () => import('layouts/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/moderator/notification.vue'),
      },
      {
        path: 'evaluation',
        component: () => import('pages/moderator/eval.vue'),
      },
      {
        path: 'tests',
        component: () => import('pages/moderator/tests.vue'),
      },
      {
        path: 'account',
        component: () => import('pages/moderator/account.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
