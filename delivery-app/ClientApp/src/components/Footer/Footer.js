import React from 'react';
import { OrderPanel } from '../Order/OrderPanel';

export function Footer(props) {
    return props.user.dispatch
        ? null
        : <footer id="footer">
                <div className="scroll-area">
                    <OrderPanel
                        cart={props.cart}
                        changeCart={props.changeCart}
                        user={props.user}
                        dataSources={props.dataSources}/>
                </div>
            </footer>
}