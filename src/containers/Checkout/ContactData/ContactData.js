import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
   state = {
      name: '',
      email: '',
      address: {
         street: '',
         postalCode: ''
      }
   };

   orderHandler = event => {
      event.preventDefault();
      this.setState({ loading: true });
      const order = {
         ingredients: this.props.ingredients,
         price: this.props.price,
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
            this.setState({ loading: false });
            this.props.history.push('/');
         })
         .catch(error => {
            this.setState({ loading: false });
         });
   };

   render() {
      let form = (
         <form>
            <input
               className={classes.Input}
               type="text"
               name="name"
               placeholder="Full Name"
            />
            <input
               className={classes.Input}
               type="email"
               name="email"
               placeholder="Email"
            />
            <input
               className={classes.Input}
               type="text"
               name="street"
               placeholder="Street"
            />
            <input
               className={classes.Input}
               type="text"
               name="postal"
               placeholder="Post Code"
            />
            <Button btnType="Success" click={this.orderHandler}>
               ORDER
            </Button>
         </form>
      );
      if (this.state.loading) {
         form = <Spinner />;
      }
      return (
         <div className={classes.ContactData}>
            <h4>Enter contact details</h4>
            {form}
         </div>
      );
   }
}

export default ContactData;
