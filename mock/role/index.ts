import faker from 'faker'
import { Response, Request } from 'express'
import { asyncRoutes, constantRoutes } from './routes'
import { IRoleData } from '../../src/api/types'

const routes = [...constantRoutes, ...asyncRoutes]
const roles: IRoleData[] = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'admin_project',
    name: 'admin_project',
    description: 'Normal Admin Project. Can see all pages except permission page',
    // routes: routes.filter(i => i.path !== '/permission') // Just a mock
    routes: filterRoutesByRoleAdminProject(routes, 'admin_project') // Just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [...constantRoutes, ...[
        {
          path: '/permission',
          component: 'Layout',
          redirect: '/permission/index',
          meta: {
            title: 'permission',
            icon: 'lock',
            roles: ['admin', 'admin_project'],
            alwaysShow: true
          },
          children: [
            {
              path: 'directive',
              component: 'views/permission/directive',
              name: 'DirectivePermission',
              meta: {
                title: 'directivePermission'
              }
            }
          ]
        }
      ]
      ]
    }]
  }
]

// This function is filter routes by role admin_project. It will return a new array of routes that only contains routes that the role can access.
function filterRoutesByRoleAdminProject(routes: any[], role: string): any[] {
  return routes.reduce((acc, route) => {
    if (route.meta && route.meta.roles && route.meta.roles.includes(role)) {
      // Route matches the role condition
      const newRoute = { ...route }
      if (route.children) {
        newRoute.children = filterRoutesByRoleAdminProject(route.children, role)
      }
      acc.push(newRoute)
    } else if (!route.meta || !route.meta.roles) {
      // Route doesn't have meta or meta.roles defined, allow it
      const newRoute = { ...route }
      if (route.children) {
        newRoute.children = filterRoutesByRoleAdminProject(route.children, role)
      }
      acc.push(newRoute)
    } else if (route.meta.roles && !route.meta.roles.includes(role)) {
      // Route has meta.roles but doesn't include the required role, skip it
      if (route.children) {
        const filteredChildren = filterRoutesByRoleAdminProject(route.children, role)
        if (filteredChildren.length > 0) {
          acc.push({
            ...route,
            children: filteredChildren
          })
        }
      }
    }
    return acc
  }, [] as any[])
}

export const getRoles = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: roles.length,
      items: roles
    }
  })
}

export const createRole = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      key: faker.datatype.number({ min: 3, max: 10000 })
    }
  })
}

export const updateRole = (req: Request, res: Response) => {
  const { role } = req.body
  roles.forEach((item, index) => {
    if (item.key === role.key) {
      roles[index] = role
    }
  })
  return res.json({
    code: 20000,
    data: {
      role
    }
  })
}

export const deleteRole = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getRoutes = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      routes
    }
  })
}
