import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  // TODO: Взять переменную из стора\
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector((state) =>
    state.ingredients.data.find((item) => item._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
