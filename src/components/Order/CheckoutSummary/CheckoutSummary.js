import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';

const checkoutSummary = props => {
   return (
      <div className={classes.CheckoutSummary}>
         <h1>Enjoy your Burger!</h1>
         <div style={{ width: '100%', margin: 'auto' }}>
            <Burger ingredients={props.ingredients} />
         </div>
         <Button btnType="Danger" click={props.checkoutCancelled}>
            CANCEL
         </Button>
         <Button btnType="Success" click={props.checkoutContinued}>
            CONTINUE
         </Button>
      </div>
   );
};

export default checkoutSummary;
