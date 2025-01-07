import { Character as CharacterType } from "../../../types";
import Character from "./Character";

type Props = {
    characters: CharacterType[];
};

const CharacterList = ({ characters }: Props) => {
    if (!characters || characters.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-5 justify-center">
            {characters.map((character) => (
                <Character
                    key={character.id}
                    character={character}
                />
            ))}
        </div>
    );
};

export default CharacterList;