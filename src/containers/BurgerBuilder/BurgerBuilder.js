import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions'

class BurgerBuilder extends Component {
   state = {
      purchasing: false,
      loading: false,
      error: null
   };

   /* componentDidMount() {
      axios
         .get('https://my-burger-builder-pnt.firebaseio.com/ingredients.json')
         .then(response => {
            this.setState({ ingredients: response.data });
         })
         .catch(error => {
            this.setState({ error: true });
         });
   } */

   updatePurchaseState(ingredients) {
      const sum = Object.keys(ingredients)
         .map(igKey => {
            return ingredients[igKey];
         })
         .reduce((sum, el) => sum + el, 0);

      return sum > 0;
   }

   purchaseHandler = () => {
      this.setState({ purchasing: true });
   };

   purchaseCancelHandler = () => {
      this.setState({ purchasing: false });
   };

   purchaseContinueHandler = () => {
      this.props.history.push('/checkout');
   };

   render() {
      const disabledInfo = { ...this.props.ings };
      for (let key in disabledInfo) {
         disabledInfo[key] = disabledInfo[key] <= 0;
      }
      let orderSummary = null;
      let burger = this.state.error ? (
         <p>Ingredients can't be loaded.</p>
      ) : (
            <Spinner />
         );
      if (this.props.ings) {
         burger = (
            <Aux>
               <Burger ingredients={this.props.ings} />
               <BuildControls
                  addIngredient={this.props.onIngredientAdded}
                  removeIngredient={this.props.onIngredientRemoved}
                  disabled={disabledInfo}
                  price={this.props.totPrice}
                  purchaseable={this.updatePurchaseState(this.props.ings)}
                  orderNow={this.purchaseHandler}
               />
            </Aux>
         );
         orderSummary = (
            <OrderSummary
               ingredients={this.props.ings}
               price={this.props.totPrice}
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

const mapStateToProps = state => {
   return {
      ings: state.ingredients,
      totPrice: state.totalPrice
   }
}

const mapDispatchToProps = dispatch => {
   return {
      onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, payload: { ingredientName: ingName } }),
      onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, payload: { ingredientName: ingName } }),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
