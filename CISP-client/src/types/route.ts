// 路由的 meta 属性
import type { VNode } from 'vue'

export interface Meta {
  layout: boolean // 是否启动布局
  hideInMenu?: boolean //是否在菜单栏显示
  auth?: boolean // 是否需要登录验证
  exact?: boolean // 是否精准匹配
  label: string // 路由名称
  icon: VNode
}

export enum RoutePath {
  Home = '/',
  Friend = '/friend',
  Friend_Chat = '/friend/chat',
  Search = '/search',
  Bulletin = '/bulletin',
  News = '/news',
  PersonalCenter = '/personalCenter',
  Settings = '/settings',
  LoginOrRegistry = '/loginOrRegistry',
  ForgetPwd = '/forgetPwd',
  NotFound = '/:pathMatch(.*)'
}
