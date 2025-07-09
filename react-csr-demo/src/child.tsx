import React, { Suspense } from 'react';
import './style.css';

export type RefType = {
    sayHello: () => void;
}

const ChildComponent = (props: any) => {
   console.log(props.ref);
   
    return (
        <Suspense>
            {props.name}
            <h1 className='box1'>Child</h1>
        </Suspense>
    )
}

export const Child = ChildComponent;