import { Fragment, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { countries } from 'countries-list';
import { saveShippingInfo } from '../../slices/cartSlice';
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from 'react-toastify';
import MetaData from "../layouts/MetaData";
import { MapPin, Phone, Building, Globe, Map, Navigation } from 'lucide-react';

export const validateShipping = (shippingInfo, navigate) => {
    if (
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.country ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode
    ) {
        toast.error('Please fill the Shipping Information', { position: 'bottom-right' })
        navigate('/shipping')
    }
}

export default function Shipping() {
    const { shippingInfo } = useSelector(state => state.cartState);
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNO] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);
    
    const countryList = Object.values(countries);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({
            address,
            city,
            phoneNo,
            postalCode,
            country,
            state
        }));
        navigate('/order/confirm');
    }

    return (
        <Fragment>
            <MetaData title={'Shipping Info'} />
            <CheckoutSteps shipping />
            
            <div className="co-container">
                <div className="co-form-wrap">
                    <div className="co-form-header">
                        <h2>Shipping Details</h2>
                        <p>Where should we send your order?</p>
                    </div>

                    <form onSubmit={submitHandler} className="co-form">
                        
                        <div className="da-form-group">
                            <label>Street Address</label>
                            <div className="da-input-icon">
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    className="da-input"
                                    placeholder="123 Main St, Apt 4B"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="da-form-row">
                            <div className="da-form-group">
                                <label>City</label>
                                <div className="da-input-icon">
                                    <Building size={18} />
                                    <input
                                        type="text"
                                        className="da-input"
                                        placeholder="Mumbai"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="da-form-group">
                                <label>Postal Code</label>
                                <div className="da-input-icon">
                                    <Navigation size={18} />
                                    <input
                                        type="number"
                                        className="da-input"
                                        placeholder="400001"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="da-form-row">
                            <div className="da-form-group">
                                <label>Country</label>
                                <div className="da-input-icon">
                                    <Globe size={18} />
                                    <select
                                        className="da-input"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                    >    
                                        <option value="">Select Country</option>
                                        {countryList.map((country, i) => (
                                            <option key={i} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="da-form-group">
                                <label>State / Province</label>
                                <div className="da-input-icon">
                                    <Map size={18} />
                                    <input
                                        type="text"
                                        className="da-input"
                                        placeholder="Maharashtra"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="da-form-group">
                            <label>Phone Number</label>
                            <div className="da-input-icon">
                                <Phone size={18} />
                                <input
                                    type="number"
                                    className="da-input"
                                    maxLength={12}
                                    placeholder="+91 98765 43210"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNO(e.target.value)}
                                    required
                                />
                            </div>
                            <small className="text-muted mt-1 d-block">May be used to assist delivery</small>
                        </div>

                        <div className="co-actions mt-4">
                            <button type="submit" className="da-btn da-btn-primary w-100 py-3" style={{ fontSize: '1.1rem' }}>
                                Continue to Order Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}