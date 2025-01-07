import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import { Character as CharacterType } from "../../../../types";
import FavoritesButton from "@/components/atoms/FavoritesButton/index";
import ViewMoreButton from "@/components/atoms/ViewMoreButton/index";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
    character: CharacterType;
    isFavorite?: boolean;
};

const Character = ({ character }: Props) => {
    const queryClient = useQueryClient();

    const { data: isFavorite, isLoading: isFavoriteLoading } = useQuery({
        queryKey: ["favorites", character.id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/favorites?characterId=${character.id}`);
            return response.data.length > 0;
        },
    });

    const addToFavorites = async (id: number) => {
        await axios.post("http://localhost:3000/favorites", { characterId: id });
    };

    const removeFromFavorites = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:3000/favorites?characterId=${id}`);
            if (response.data.length > 0) {
                const favoriteId = response.data[0].id;
                await axios.delete(`http://localhost:3000/favorites/${favoriteId}`);
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    };

    const { mutate: toggleFavoriteMutation, isPending: isMutating } = useMutation({
        mutationFn: async () => {
            if (isFavorite) {
                await removeFromFavorites(character.id);
            } else {
                await addToFavorites(character.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.refetchQueries({
                queryKey: ['favoriteCharacters'],
                type: 'active',
            });
        }
    });

    const toggleFavorite = () => {
        toggleFavoriteMutation();
    };


    return (
        <div className="character-card border border-gray-300 rounded-lg shadow-md p-4" >
            <img src={character.image} alt={character.name} className="mb-4" />
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold"> {character.name}</h2>
                <FavoritesButton
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    isLoading={isFavoriteLoading || isMutating}
                />
            </div>
            <p className="text-gray-600"> {character.status}</p>

            <Dialog>
                <DialogTrigger asChild>
                    <ViewMoreButton onClick={() => { }} />
                </DialogTrigger>
                <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-md p-6 max-w-md w-full shadow-lg">
                        <div className="text-center mb-4">
                            <img src={character.image} alt={character.name} className="mx-auto mb-2" />
                            <DialogTitle className="text-xl font-bold">{character.name}</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600"> Additional info about the character: </DialogDescription>
                        </div>
                        <div className="space-y-2 text-left">
                            <p>
                                <strong>Status:</strong> {character.status}
                            </p>
                            <p>
                                <strong>Species:</strong> {character.species}
                            </p>
                            <p>
                                <strong>Gender:</strong> {character.gender}
                            </p>
                            <p>
                                <strong>Location:</strong> {character.location.name}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <DialogClose asChild>
                                <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                    Close
                                </button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default Character;




