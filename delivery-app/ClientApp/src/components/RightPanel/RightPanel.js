import React from 'react';
import { DispatchPanel } from '../Dispatch/DispatchPanel';
import { MenuPanel } from '../Menu/MenuPanel';

export function RightPanel(props) {
    return props.user.dispatch
        ? <DispatchPanel
            selectedRestaurantId={props.selectedRestaurantId}
            dataSources={props.dataSources}/>
        : <MenuPanel
            selectedRestaurantId={props.selectedRestaurantId}
            addToCart={props.addToCart}
            dataSources={props.dataSources}/>
}