import React from 'react';

import Aux from '../../../hoc/Auxilary/Auxilary';
import Button from '../../UI/Button/Button';

const orderSummary = props => {
   // Can be a functional component

   const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
      return (
         <li key={igKey}>
            <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
            {props.ingredients[igKey]}
         </li>
      );
   });

   return (
      <Aux>
         <h3>YOur Order</h3>
         <p>A delicious burger with the following ingredients: </p>
         <ul>{ingredientSummary}</ul>
         <p>
            <strong>Total Price: $ {props.price.toFixed(2)}</strong>
         </p>
         <p>Continue to checkout?</p>
         <Button btnType="Danger" click={props.purchaseCancel}>
            CANCEL
         </Button>
         <Button btnType="Success" click={props.purchaseContinue}>
            CONTINUE
         </Button>
      </Aux>
   );
};

export default orderSummary;
