import React from 'react';
import { RestaurantsPanel } from '../Restaurants/RestaurantsPanel';
import { RightPanel } from '../RightPanel/RightPanel';

export function Body(props) {
    return <body-wrapper>
        <left-panel>
            <div className="scroll-area">
                <RestaurantsPanel
                    selectedTagIds={props.selectedTagIds}
                    changeSelectedTagIds={props.changeSelectedTagIds}
                    selectedRestaurantId={props.selectedRestaurantId}
                    handleRestaurantSelect={props.handleRestaurantSelect}
                    dataSources={props.dataSources}/>
            </div>
        </left-panel>
        <right-panel>
            <div className="scroll-area">
                <RightPanel
                    user={props.user}
                    selectedRestaurantId={props.selectedRestaurantId}
                    addToCart={props.addToCart}
                    dataSources={props.dataSources}/>
            </div>
        </right-panel>
    </body-wrapper>
}