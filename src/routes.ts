import { lazy } from 'solid-js';
import { RouteDefinition } from 'solid-app-router';

/**
 * Here, we define our routes.
 */

export const routes: RouteDefinition[] = [
    // define your routes here.
    {
        // home page
        path: '/',
        component: lazy(() => import('./pages/home/home'))
    },
    {
        // blog page.
        path: '/blog',
        component: lazy(() => import('./pages/blog/blog')),
    },
    {
        path: 'blog/post/:id',
        component: lazy(() => import('./pages/blog-post/Blog-Post'))
    },
    {
        // portfolio
        path: '/portfolio',
        component: lazy(() => import('./pages/portfolio/portfolio'))
    },
    {
        // project detail.
        path: '/portfolio/project/:id',
        component: lazy(() => import('./pages/project-detail/Project-Detail'))
    },
    {
        path: '/contact',
        component: lazy(() => import('./pages/contact/Contact'))
    },
    {
        // Fallback/Not Found page.
        path: '/*all',
        component: lazy(() => import('./pages/not-found/Not-Found')),
    }
]