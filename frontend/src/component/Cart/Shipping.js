import React, { useState } from 'react'
import "./Shipping.css"
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import { Country, State } from "country-state-city";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import { saveShippingInfo } from '../../actions/cartActions';

const Shipping = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { shippingInfo } = useSelector(state => state.cart);
    const [address, setAddress] = useState(shippingInfo?.address);
    const [city, setCity] = useState(shippingInfo?.city);
    const [state, setState] = useState(shippingInfo?.state);
    const [country, setCountry] = useState(shippingInfo?.country);
    const [pincode, setPincode] = useState(shippingInfo?.pincode);
    const [phone, setPhone] = useState(shippingInfo?.phone);
    const shippingSubmit = (e) => {
        e.preventDefault();
        if (phone.length > 10 || phone.length < 10) {
            alert.error("Phone number must be 10 digits");
            return;
        }
        dispatch(saveShippingInfo({ address, city, state, country, pincode, phone }));
        history.push("./order/confirm")
    }
    return (
        <>
        <MetaData title="Shipping Details" />
        <CheckoutSteps activeStep={0} />
            <div className='shippingContainer'>
                <div className='shippingBox'>
                    <h2 className='shippingHeading'>Shipping Details</h2>
                    <form
                        className='shippingForm'
                        encType='multipart/form-data'
                        onSubmit={shippingSubmit}
                    >
                        <div>
                            <HomeIcon/>
                            <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            />
                        </div>
                        <div>
                            <LocationCityIcon/>
                            <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            />
                        </div>
                        <div>
                            <PinDropIcon/>
                            <input
                            type="number"
                            placeholder="Pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            required
                            />
                        </div>
                        <div>
                            <PhoneIcon/>
                            <input
                            type="number"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            />
                        </div>
                        <div>
                            <PublicIcon/>
                            <select
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Select Country</option>
                                {Country && Country.getAllCountries().map(item => (
                                    <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                ))}    
                            </select>
                        </div>
                        {country && (
                            <div>
                            <TransferWithinAStationIcon/>
                            <select
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Select State</option>
                                {country && State.getStatesOfCountry(country).map(item => (
                                    <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                ))}    
                            </select>
                        </div>
                        )}
                        <input
                        type="submit"
                        value="Continue"
                        className='shippingBtn'
                        disabled= {state ? false : true}
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default Shipping
