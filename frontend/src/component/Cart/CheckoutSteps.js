import { Step, StepLabel, Stepper, Typography } from '@material-ui/core'
import React, { Fragment } from 'react'
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import "./CheckOutSteps.css"

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShippingIcon />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheckIcon />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalanceIcon />
        }
    ]
    const styles = {
        boxSizing : "border-box",
    }
    return (
        <>
        <Stepper alternativeLabel activeStep={activeStep} style={styles}>
            {steps.map((step, index) => (
                <Step key={index} active={activeStep === index ? true : false}
                completed={activeStep >= index ? true : false}
                 >
                    <StepLabel 
                    style={{color : activeStep >= index ? "tomato" : "unset" }}
                    icon={step.icon} >{step.label}</StepLabel>
                </Step>))}
        </Stepper>
        </>
    )
}

export default CheckoutSteps
