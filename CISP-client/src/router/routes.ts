import type { RouteRecordRaw } from 'vue-router'
import { Meta, RoutePath } from '@/types/route'
import { Bell, Compass, Connection, Document, Search, Setting, User } from '@element-plus/icons-vue'

export type RouteRecord = RouteRecordRaw & {
  meta: Meta
}

const routes: readonly RouteRecord[] = [
  {
    path: RoutePath.Home,
    name: 'home',
    component: () => import('@/views/HomePage/homePage.vue'),
    meta: {
      layout: true,
      label: '首页',
      icon: Compass,
      exact: true,
      auth: true
    }
  },
  {
    path: RoutePath.Friend,
    name: 'friend',
    component: () => import('@/views/Friend/friendPage.vue'),
    children: [
      {
        path: RoutePath.Friend_Chat,
        name: 'chat',
        component: () => import('@/views/Friend/chatPage.vue'),
        meta: {
          label: '聊天',
          auth: true
        }
      }
    ],
    meta: {
      layout: true,
      label: '通讯录',
      icon: Connection,
      auth: true
    }
  },
  {
    path: RoutePath.Search,
    name: 'search',
    component: () => import('@/views/searchPage.vue'),
    meta: {
      layout: true,
      label: '搜寻',
      icon: Search
    }
  },
  {
    path: RoutePath.Bulletin,
    name: 'bulletin',
    component: () => import('@/views/bulletinBoard.vue'),
    meta: {
      layout: true,
      label: '公告栏',
      icon: Bell
    }
  },
  {
    path: RoutePath.News,
    name: 'news',
    component: () => import('@/views/newsPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '新闻',
      icon: Document
    }
  },
  {
    path: RoutePath.PersonalCenter,
    name: 'personalCenter',
    component: () => import('@/views/personalCenter.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '个人中心',
      icon: User
    }
  },
  {
    path: RoutePath.Settings,
    name: 'settings',
    component: () => import('@/views/settingPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '设置',
      icon: Setting
    }
  },
  {
    path: RoutePath.LoginOrRegistry,
    name: 'loginOrRegistry',
    component: () => import('@/views/loginAndRegistryPage.vue'),
    meta: {
      layout: false,
      hideInMenu: true
    }
  },
  {
    path: RoutePath.ForgetPwd,
    name: 'forgetPwd',
    component: () => import('@/views/forgetPwd.vue'),
    meta: {
      layout: false,
      hideInMenu: true
    }
  },
  {
    path: RoutePath.NotFound,
    name: '404',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      layout: false,
      hideInMenu: true
    }
  }
]

export default routes
