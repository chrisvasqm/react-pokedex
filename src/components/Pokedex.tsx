import { useEffect, useState } from 'react';
import { VStack, useToast } from '@chakra-ui/react';
import TopBar from './TopBar';
import Screen from './Screen';
import BottomBar from './BottomBar';
import Pokemon from '../models/Pokemon';
import PokemonsService from '../services/pokemons';
const service = new PokemonsService();

function PokeDex() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonId, setPokemonId] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoaded, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLoading(false);

    service
      .find(pokemonId)
      .then(response => {
        setLoading(true);
        setPokemon(response.data);
      })
      .catch(error => {
        setLoading(true);

        console.log(`Error fetching Pokemon details: ${error}`);
        toast({
          description: error.response.data,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  }, [pokemonId, toast]);

  function handleNext() {
    if (pokemonId >= 1017) return;

    setPokemonId(pokemonId + 1);
  }

  function handlePrevious() {
    if (pokemonId <= 1) return;

    setPokemonId(pokemonId - 1);
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    if (query == '') return;

    if (query == pokemon?.name) return;

    setLoading(true);

    service
      .search(query)
      .then(response => {
        setLoading(false);
        setPokemon(response.data);
        setPokemonId(response.data.id);
      })
      .catch(error => {
        setLoading(false);

        console.log(`Error searching Pokemon details: ${error}`);
        toast({
          description: error.response.data,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  }

  return (
    <VStack
      align={'left'}
      width={'100%'}
      borderTopLeftRadius={15}
      borderTopRightRadius={0}
      borderBottomLeftRadius={15}
      borderBottomRightRadius={0}
      placeContent={'start'}
      padding={6}
      backgroundColor={'#E80D28'}
      boxShadow='10px 10px 10px rgba(0, 0, 0, 0.4)'
    >
      <TopBar />
      <Screen pokemon={pokemon} isLoaded={isLoaded} />
      <BottomBar
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLoaded={isLoaded}
        onSearch={e => setQuery(e.target.value)}
        onSubmit={handleSubmit}
      />
    </VStack>
  );
}

export default PokeDex;
