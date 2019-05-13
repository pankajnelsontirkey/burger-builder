import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
   ingredients: null,
   totalPrice: 3,
   error: false
};

const INGREDIENT_PRICES = {
   salad: 0.5,
   bacon: 0.7,
   cheese: 0.4,
   meat: 1.3
};

const addIngredient = (state, action) => {
   const updatedIngredient = {
      [action.payload.ingredientName]:
         state.ingredients[action.payload.ingredientName] + 1
   };
   const updatedIngredients = updateObject(
      state.ingredients,
      updatedIngredient
   );
   const updatedState = {
      ingredients: updatedIngredients,
      totalPrice:
         state.totalPrice + INGREDIENT_PRICES[action.payload.ingredientName]
   };
   return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
   const updatedIng = {
      [action.payload.ingredientName]:
         state.ingredients[action.payload.ingredientName] - 1
   };
   const updatedIngs = updateObject(state.ingredients, updatedIng);
   const updatedStat = {
      ingredients: updatedIngs,
      totalPrice:
         state.totalPrice + INGREDIENT_PRICES[action.payload.ingredientName]
   };
   return updateObject(state, updatedStat);
};

const setIngredients = (state, action) => {
   return updateObject(state, {
      ingredients: {
         salad: action.payload.ingredients.salad,
         bacon: action.payload.ingredients.bacon,
         cheese: action.payload.ingredients.cheese,
         meat: action.payload.ingredients.meat
      },
      totalPrice: 4,
      error: false
   });
};

const fetchIngredientsFailed = (state, action) => {
   return updateObject(state, {
      error: true
   });
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.ADD_INGREDIENT:
         return addIngredient(state, action);
      case actionTypes.REMOVE_INGREDIENT:
         return removeIngredient(state, action);
      case actionTypes.SET_INGREDIENTS:
         return setIngredients(state, action);
      case actionTypes.FETCH_INGREDIENTS_FAILED:
         return fetchIngredientsFailed(state, action);
      default:
         return state;
   }
};

export default reducer;
