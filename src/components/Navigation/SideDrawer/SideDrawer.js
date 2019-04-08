import React from 'react';

import Logo from '../../Logo/Logo';
import NavItems from '../NavItems/NavItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxilary/Auxilary';

const sideDrawer = props => {
   let attachedClasses = [classes.SideDrawer, classes.Close];

   if (props.open) {
      attachedClasses = [classes.SideDrawer, classes.open];
   }

   return (
      <Aux>
         <Backdrop show={props.open} click={props.closed} />
         <div className={attachedClasses.join(' ')}>
            <div className={classes.Logo}>
               <Logo />
            </div>
            <nav>
               <NavItems />
            </nav>
         </div>
      </Aux>
   );
};

export default sideDrawer;
