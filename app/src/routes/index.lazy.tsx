import axios from "axios";
import { useState, useEffect } from "react";
import { RickAndMortyCharacterResponse } from "../types";
import CharacterList from "../components/molecules/CharacterList";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from '@tanstack/react-router'
import { usePagination } from '@/hooks/usePagination';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevData, setPrevData] = useState<RickAndMortyCharacterResponse | null>(null);

  const getCharacters = async (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());

    const response = await axios.get<RickAndMortyCharacterResponse>(
      `https://rickandmortyapi.com/api/character?${params.toString()}`
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["characters", currentPage, window.location.search],
    queryFn: () => getCharacters(currentPage)
  });

  useEffect(() => {
    if (data) {
      setPrevData(data);
    }
  }, [data]);

  const { getVisiblePages } = usePagination(data?.info.pages || 1);

  if (isLoading && prevData) {
    return (
      <div className="app">
        <CharacterList characters={prevData.results} />
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  if (!data) return null;

  return (
    <div className="app">
      <CharacterList characters={data.results} />
      <div className="pagination flex items-center justify-center space-x-2 py-5">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          onClick={() => setCurrentPage(currentPage - 1)}
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
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === (data?.info.pages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}