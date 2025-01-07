import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const SearchBar = () => {
    const {
        filters,
        isOpen,
        setIsOpen,
        handleFilterChange,
        handleClear,
        activeFiltersCount
    } = useSearchFilters();

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentPath = window.location.pathname;

    useEffect(() => {
        const updateSearch = async () => {
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );

            await navigate({
                to: currentPath as '/' | '/favorites',
                search: {
                    name: cleanedFilters.name || undefined,
                    status: cleanedFilters.status || undefined,
                    gender: cleanedFilters.gender || undefined,
                    location: cleanedFilters.location || undefined,
                    page: cleanedFilters.page ? parseInt(cleanedFilters.page) : undefined
                },
                replace: true
            });

            await queryClient.resetQueries();
        };

        updateSearch();
    }, [filters, navigate, queryClient, currentPath]);

    return (
        <div className="relative">
            <div className="flex items-center relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 bg-gray-100 border-y border-r rounded-r-lg hover:bg-gray-200 flex items-center gap-2 ${activeFiltersCount > 0 ? 'text-primary font-medium' : ''}`}
                >
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
                    <div className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Any</option>
                                <option value="alive">Alive</option>
                                <option value="dead">Dead</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                value={filters.gender}
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Any</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="genderless">Genderless</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                placeholder="Enter location..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleClear}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                                disabled={activeFiltersCount === 0}
                            >
                                Clear all
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar; 