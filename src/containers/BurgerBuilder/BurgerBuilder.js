import React, { Component } from 'react';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
   salad: 0.5,
   bacon: 0.7,
   cheese: 0.4,
   meat: 1.3
};

class BurgerBuilder extends Component {
   state = {
      ingredients: null,
      totalPrice: 3,
      purchaseable: false,
      purchasing: false,
      loading: false,
      error: null
   };

   componentDidMount() {
      axios
         .get('https://my-burger-builder-pnt.firebaseio.com/ingredients.json')
         .then(response => {
            this.setState({ ingredients: response.data });
         })
         .catch(error => {
            this.setState({ error: true });
         });
   }

   updatePurchaseState(ingredients) {
      const sum = Object.keys(ingredients)
         .map(igKey => {
            return ingredients[igKey];
         })
         .reduce((sum, el) => sum + el, 0);

      this.setState({ purchaseable: sum > 0 });
   }

   addIngredientHandler = type => {
      const oldCount = this.state.ingredients[type];
      const updatedCount = oldCount + 1;
      const updatedIngredients = { ...this.state.ingredients };
      updatedIngredients[type] = updatedCount;
      const oldPrice = this.state.totalPrice;
      const addPrice = INGREDIENT_PRICES[type];
      const updatedPrice = oldPrice + addPrice;

      this.setState({
         ingredients: updatedIngredients,
         totalPrice: updatedPrice
      });
      this.updatePurchaseState(updatedIngredients);
   };

   removeIngredientHandler = type => {
      const oldCount = this.state.ingredients[type];

      if (oldCount <= 0) {
         return;
      } else {
         const updatedCount = oldCount - 1;
         const updatedIngredients = { ...this.state.ingredients };
         updatedIngredients[type] = updatedCount;
         const oldPrice = this.state.totalPrice;
         const removePrice = INGREDIENT_PRICES[type];
         const updatedPrice = oldPrice - removePrice;

         this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
         });
         this.updatePurchaseState(updatedIngredients);
      }
   };

   purchaseHandler = () => {
      this.setState({ purchasing: true });
   };

   purchaseCancelHandler = () => {
      this.setState({ purchasing: false });
   };

   purchaseContinueHandler = () => {
      // alert('Order has been placed!');
      this.setState({ loading: true });
      const order = {
         ingredients: this.state.ingredients,
         price: this.state.totalPrice,
         customer: {
            name: 'Pankaj Nelson Tirkey',
            address: {
               street: 'Test Street 3',
               pincode: '301234',
               country: 'India'
            },
            email: 'test@test.com'
         },
         deliveryType: 'one-day'
      };
      axios
         .post('/orders.json', order)
         .then(response => {
            this.setState({ loading: false, purchasing: false });
         })
         .catch(error => {
            this.setState({ loading: false, purchasing: false });
         });
   };

   render() {
      const disabledInfo = { ...this.state.ingredients };
      for (let key in disabledInfo) {
         disabledInfo[key] = disabledInfo[key] <= 0;
      }
      let orderSummary = null;
      let burger = this.state.error ? (
         <p>Ingredients can't be loaded.</p>
      ) : (
         <Spinner />
      );
      if (this.state.ingredients) {
         burger = (
            <Aux>
               <Burger ingredients={this.state.ingredients} />
               <BuildControls
                  addIngredient={this.addIngredientHandler}
                  removeIngredient={this.removeIngredientHandler}
                  disabled={disabledInfo}
                  price={this.state.totalPrice}
                  purchaseable={this.state.purchaseable}
                  orderNow={this.purchaseHandler}
               />
            </Aux>
         );
         orderSummary = (
            <OrderSummary
               ingredients={this.state.ingredients}
               price={this.state.totalPrice}
               purchaseCancel={this.purchaseCancelHandler}
               purchaseContinue={this.purchaseContinueHandler}
            />
         );
      }

      if (this.state.loading) {
         orderSummary = <Spinner />;
      }

      return (
         <Aux>
            <Modal
               show={this.state.purchasing}
               modalClosed={this.purchaseCancelHandler}
            >
               {orderSummary}
            </Modal>
            {burger}
         </Aux>
      );
   }
}

export default withErrorHandler(BurgerBuilder, axios);
