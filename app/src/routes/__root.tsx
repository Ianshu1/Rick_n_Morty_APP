import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import SearchBar from '@/components/atoms/SearchBar'
import { Suspense } from 'react';

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="flex justify-between items-center p-4">
                <h1 className="text-xl font-bold">
                    Rick & Morty
                </h1>
                <div className="flex items-center space-x-6">
                    <SearchBar />
                    <nav className="space-x-6">
                        <Link to="/" search={{
                            name: undefined,
                            status: undefined,
                            gender: undefined,
                            location: undefined,
                            page: undefined
                        }}
                            className="[&.active]:font-bold">
                            Home
                        </Link>
                        <Link to="/favorites"
                            search={{
                                name: undefined,
                                status: undefined,
                                gender: undefined,
                                location: undefined,
                                page: undefined
                            }}
                            className="[&.active]:font-bold">
                            Favorites
                        </Link>
                    </nav>
                </div>
            </div>
            <hr className="mb-4" />
            <div className="p-4">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </div>
            <TanStackRouterDevtools />
        </>
    ),
    validateSearch: (search) => {
        return {
            name: search.name as string | undefined,
            status: search.status as string | undefined,
            gender: search.gender as string | undefined,
            location: search.location as string | undefined,
            page: Number(search.page) || undefined,
        }
    }
});
