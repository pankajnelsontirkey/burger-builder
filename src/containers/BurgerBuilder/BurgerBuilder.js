import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
   state = {
      purchasing: false
   };

   componentDidMount() {
      this.props.onInitIngredients();
   }

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
      this.props.onInitPurchase();
      this.props.history.push('/checkout');
   };

   render() {
      const disabledInfo = { ...this.props.ings };
      for (let key in disabledInfo) {
         disabledInfo[key] = disabledInfo[key] <= 0;
      }
      let orderSummary = null;
      let burger = this.props.error ? (
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
      ings: state.burgerBuilder.ingredients,
      totPrice: state.burgerBuilder.totalPrice,
      error: state.burgerBuilder.error
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
      onIngredientRemoved: ingName =>
         dispatch(actions.removeIngredient(ingName)),
      onInitIngredients: () => dispatch(actions.initIngredients()),
      onInitPurchase: () => dispatch(actions.purchaseInit())
   };
};

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
