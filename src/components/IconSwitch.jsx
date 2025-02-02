import { Spacer, VisuallyHidden, useSwitch } from "@heroui/react";
import React, { Children } from 'react';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Text from "./Text";
import Button from "./Button";



const IconSwitch = ({ children, Icon, setOn, isOn, fullWidth, ...props }) => {
    const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
        useSwitch(props);
    // console.log(useSwitch(props).getInputProps().onChange
    // )

    return (
        <Button onPress={() => {
            setOn(!isOn)
        }} className={` ${!isOn ? 'bg-slate-500' : 'bg-primary'}`}>


            {Icon ? Icon : <></>}
            <Text type="heading">{children}{isOn ? "開啟" : "關閉"}</Text>


        </Button>
    );
};

export default IconSwitch