import { Button as HeroButton } from '@heroui/react';
import React from 'react';

const Button = ({
    type = 'body', children, className = '', ...props }) => {
    // const styles = {
    //     title: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-center',
    //     subtitle: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 text-center',
    //     heading: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ',
    //     subheading: 'text-lg sm:text-xl md:text-2xl  lg:text-3xl font-semibold ',
    //     body: 'text-sm sm:text-base md:text-lg lg:text-xl ',
    //     caption: 'text-xs sm:text-sm md:text-base ',
    //     small: 'text-xs sm:text-sm '
    // };

    return (
        <HeroButton size='lg' color='primary' className={`py-8 ${className}`}  {...props} >
            {children}
        </HeroButton >
    );
};

export default Button;