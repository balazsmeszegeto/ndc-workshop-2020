import React from 'react';
import { ReactComponent as Checked } from './checkbox-checked.svg';
import { ReactComponent as Unchecked } from './checkbox-unchecked.svg';

export function Checkbox(props): React$Element {
    if (props.checked)
        return <Checked alt="checked"/>

    return <Unchecked alt="unchecked"/>
}