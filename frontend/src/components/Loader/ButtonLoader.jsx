import React from 'react'
import { BounceLoader } from 'react-spinners';

const ButtonLoader = ({size = 50}) => {
    return <BounceLoader size={size} color="rgba(30,215,96,1)"/>;
}

export default ButtonLoader;