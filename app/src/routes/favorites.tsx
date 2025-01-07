import CharacterList from '@/components/molecules/CharacterList';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Character as CharacterType } from '../types';
import { usePagination } from '@/hooks/usePagination';

const ITEMS_PER_PAGE = 20;

export const Route = createFileRoute('/favorites')({
  component: Favorites
});

function Favorites() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [prevCharacters, setPrevCharacters] = useState<CharacterType[]>([]);

  const { data: characters, isLoading, error } = useQuery({
    queryKey: ['favoriteCharacters', window.location.search],
    queryFn: async () => {
      const favoritesResponse = await axios.get("http://localhost:3000/favorites");
      const favoriteIds = favoritesResponse.data.map((fav: { characterId: number }) => fav.characterId);

      if (favoriteIds.length === 0) {
        return [];
      }

      const charactersPromises = favoriteIds.map((id: number) =>
        axios.get(`https://rickandmortyapi.com/api/character/${id}`)
      );

      const charactersResponses = await Promise.all(charactersPromises);
      return charactersResponses.map(response => response.data);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (!isLoading) {
      setIsSearching(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (characters) {
      setPrevCharacters(characters);
    }
  }, [characters]);

  const filterCharacters = (characters: CharacterType[]) => {
    const params = new URLSearchParams(window.location.search);
    const searchParams = {
      name: params.get('name')?.toLowerCase() || '',
      status: params.get('status')?.toLowerCase() || '',
      gender: params.get('gender')?.toLowerCase() || '',
      location: params.get('location')?.toLowerCase() || ''
    };

    return characters.filter(char => {
      if (searchParams.name && !char.name.toLowerCase().includes(searchParams.name)) return false;
      if (searchParams.status && char.status.toLowerCase() !== searchParams.status) return false;
      if (searchParams.gender && char.gender.toLowerCase() !== searchParams.gender) return false;
      if (searchParams.location && !char.location.name.toLowerCase().includes(searchParams.location)) return false;
      return true;
    });
  };

  if (isSearching && !error && characters) {
    return (
      <div className="min-h-screen">
        <CharacterList characters={filterCharacters(characters)} />
      </div>
    );
  }

  if (isLoading && prevCharacters.length > 0) {
    return (
      <div className="min-h-screen">
        <CharacterList characters={filterCharacters(prevCharacters)} />
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading favorites: {error.message}</div>;

  const filteredCharacters = characters ? filterCharacters(characters) : [];
  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCharacters = filteredCharacters.slice(startIndex, endIndex);

  const { getVisiblePages } = usePagination(totalPages);

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Favorite Characters
      </h1>
      {currentCharacters.length > 0 ? (
        <>
          <CharacterList characters={currentCharacters} />
          {totalPages > 1 && (
            <div className="pagination flex items-center justify-center space-x-2 py-5">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getVisiblePages(currentPage).map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === page
                    ? "bg-primary text-white"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                    }`}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          <p>No favorite characters found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
            Go back to characters
          </a>
        </div>
      )}
    </div>
  );
}
