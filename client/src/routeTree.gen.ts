/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AdminRouteImport } from './routes/admin/route'
import { Route as clientRouteImport } from './routes/(client)/route'
import { Route as AdminIndexImport } from './routes/admin/index'
import { Route as clientIndexImport } from './routes/(client)/index'

// Create/Update Routes

const AdminRouteRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const clientRouteRoute = clientRouteImport.update({
  id: '/(client)',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AdminRouteRoute,
} as any)

const clientIndexRoute = clientIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => clientRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(client)': {
      id: '/(client)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof clientRouteImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRoute
    }
    '/(client)/': {
      id: '/(client)/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof clientIndexImport
      parentRoute: typeof clientRouteImport
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminRouteImport
    }
  }
}

// Create and export the route tree

interface clientRouteRouteChildren {
  clientIndexRoute: typeof clientIndexRoute
}

const clientRouteRouteChildren: clientRouteRouteChildren = {
  clientIndexRoute: clientIndexRoute,
}

const clientRouteRouteWithChildren = clientRouteRoute._addFileChildren(
  clientRouteRouteChildren,
)

interface AdminRouteRouteChildren {
  AdminIndexRoute: typeof AdminIndexRoute
}

const AdminRouteRouteChildren: AdminRouteRouteChildren = {
  AdminIndexRoute: AdminIndexRoute,
}

const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof clientIndexRoute
  '/admin': typeof AdminRouteRouteWithChildren
  '/admin/': typeof AdminIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof clientIndexRoute
  '/admin': typeof AdminIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(client)': typeof clientRouteRouteWithChildren
  '/admin': typeof AdminRouteRouteWithChildren
  '/(client)/': typeof clientIndexRoute
  '/admin/': typeof AdminIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/admin' | '/admin/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/admin'
  id: '__root__' | '/(client)' | '/admin' | '/(client)/' | '/admin/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  clientRouteRoute: typeof clientRouteRouteWithChildren
  AdminRouteRoute: typeof AdminRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  clientRouteRoute: clientRouteRouteWithChildren,
  AdminRouteRoute: AdminRouteRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(client)",
        "/admin"
      ]
    },
    "/(client)": {
      "filePath": "(client)/route.tsx",
      "children": [
        "/(client)/"
      ]
    },
    "/admin": {
      "filePath": "admin/route.tsx",
      "children": [
        "/admin/"
      ]
    },
    "/(client)/": {
      "filePath": "(client)/index.tsx",
      "parent": "/(client)"
    },
    "/admin/": {
      "filePath": "admin/index.tsx",
      "parent": "/admin"
    }
  }
}
ROUTE_MANIFEST_END */
