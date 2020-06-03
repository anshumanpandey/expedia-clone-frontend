import React, {useState} from 'react';
import styled from 'styled-components';
import useAxios from 'axios-hooks'
import { track } from '../crud/click-tracker.crud';
import { Vehicle, Visitor } from '../types';
import GetTypeClassFromAcrissCode from '../utils/GetTypeClassFromAcrissCode';
import moment from 'moment';
import {Decimal} from 'decimal.js';
import { LoadImageOrPlaceholder } from '../utils/LoadImageOrPlaceholder';

const ListingItemBody = styled.div`
width: 100%!important;
padding-right: 20px !important;
padding-bottom: 0px !important;
padding-left: 20px !important;
padding-top: 0px !important;
display: flex;
flex-direction: column;
flex: 1;
justify-content: space-between;
`;

const ListingItemInner = styled.article`
    height: 100%;
    display: flex;
    flex-direction: column;
    .listing-item.list-layout &{
        flex-direction: row
    }
`;

const Avatar = styled.div`
    float: left
`;


export type ListingItemProps = {
    layout?: 'GRID' | 'LIST',
    vehicle: Vehicle,
    daySpan: number,
    currentVisitor?: Visitor | null,
    doDate: moment.Moment
    doTime: moment.Moment
    puDate: moment.Moment
    puTime: moment.Moment
}
export const ListingItem: React.FC<ListingItemProps> = (props) => {
    const [trackReq, post] = useAxios(track(), { manual: true })

    const [showModal, setShowModal] = useState(false);
    const image_url = props.vehicle.image_preview_url ? props.vehicle.image_preview_url : "images/all/no-car-found.jpg"

    let carTransmission = null
    if (RegExp("(M|N|C)").test(props.vehicle.acriss[2])) {
        carTransmission = "Manual"
    }
    if (RegExp("(A|B|D)").test(props.vehicle.acriss[2])) {
        carTransmission = "Automatic"
    }

    let doors = '4-5'
    if (props.vehicle.acriss[1] == 'B') doors = '2-3'
    if (props.vehicle.acriss[1] == 'C') doors = '2-4'
    if (props.vehicle.acriss[1] == 'D') doors = '4-5'


    let suplierLogoUrl = "images/avatar/1.jpg"
    if (props.vehicle.supplier_logo) {
        if (RegExp('http').test(props.vehicle.supplier_logo)) {
            suplierLogoUrl = props.vehicle.supplier_logo
        } else {
            suplierLogoUrl = `${process.env.REACT_APP_GRCGDS_BACKEND}/public/upload/${props.vehicle.supplier_logo}`
        }
    }

    const RedirectModal: React.FC<{show: boolean}> = ({ show }) => {
        setTimeout(() => {
            setShowModal(false)
        }, 3 * 1000)
        return (
            <div className="main-register-wrap modal" style={{ display: show ? 'block' : 'none'}}>
                <div className="main-overlay" onClick={() => setShowModal(false)}></div>
                <div className="main-register-holder">
                    <div className="main-register fl-wrap custom-form" style={{ display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
                        <img style={{ display: 'unset'}} src={`${process.env.PUBLIC_URL}/images/logoblue.png`} alt="" />
                            <h4 style={{
                                float: 'left',
                                width: '100%',
                                textAlign: 'center',
                                padding: '20px 30px',
                                marginBottom: '20px',
                                fontWeight: 600,
                                color: '#154a64',
                                fontSize: '1.2rem',
                            }}>
                            Thank You for using Car Rental Click website, we are now redirecting you to the car rental company website for you to proceed with your booking. 
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
                                <button onClick={() => {
                                    setShowModal(false)
                                    window.open(props.vehicle.deeplink, '_blank')
                                }} className="log-submit-btn">
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem'}}>Ok</span>
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        )
    };

    let fuelPolicy = props.vehicle.fuel_policy
    if (props.vehicle.fuel_policy == 1) fuelPolicy = 'Full To Full'
    if (props.vehicle.fuel_policy == 2) fuelPolicy = 'Full To Empty'
    if (props.vehicle.fuel_policy == 3) fuelPolicy = 'Empty To Empty'
    if (props.vehicle.fuel_policy == 4) fuelPolicy = 'Half To Empty'
    if (props.vehicle.fuel_policy == 5) fuelPolicy = 'Quarter To Empty'
    if (props.vehicle.fuel_policy == 6) fuelPolicy = 'Half To Half'
    if (props.vehicle.fuel_policy == 7) fuelPolicy = 'Quarter To Quarter'
    if (props.vehicle.fuel_policy == 8) fuelPolicy = 'Prepaid Full To Full'
    if (props.vehicle.fuel_policy == 9) fuelPolicy = 'Prepaid Full To Empty'

    let currencySymbol = '$'
    if (props.vehicle.currency == 'EUR') currencySymbol = '€'

    return (
        <div style={{ height: '13rem', marginBottom: 0, background: 'unset' }} className={`listing-item ${props.layout === 'LIST' ? 'list-layout' : ''}`}>
            <ListingItemInner className="geodir-category-listing fl-wrap listing-item-wrapper">
                <ListingItemBody className="geodir-category-content">
                    <div className="row" style={{ display: 'flex', alignContent: 'stretch', height: '100%', marginRight: '-20px' }}>
                        <div className="col-md-4 " style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ marginTop: '0.5rem'}}>
                                {props.vehicle.acriss && (
                                    <h4 style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    }}>{GetTypeClassFromAcrissCode(props.vehicle.acriss)}</h4>
                                )}
                                <h3 style={{ fontSize: '16px', marginBottom: 0 }}><a href="listing-single.html">{props.vehicle.name}</a></h3>
                            </div>
                            <div className="geodir-category-img" style={{ display: 'flex', height: '200px', width: '170px' }}>
                                <LoadImageOrPlaceholder style={{  transform: 'scaleX(-1)',backgroundColor: 'white', alignSelf: 'center' }} src={image_url} alt={props.vehicle.carrentalcompanyname || props.vehicle.suppliername} />
                            </div>
                            <div className="card-popup-rainingvis" data-starrating2="5" style={{
                                marginBottom: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-around',
                            }}>
                                {(props.vehicle.seats !== null && props.vehicle.seats !== undefined && props.vehicle.seats !== 0) && (
                                    <span style={{ marginLeft: 0 }}>
                                        <i style={{ fontSize: '1rem', color: '#004767' }} className="fas fa-male"></i> {props.vehicle.seats}
                                    </span>
                                )}
                                {props.vehicle.luggages != null && props.vehicle.luggages != undefined && props.vehicle.luggages != 0 && (
                                    <span style={{ marginLeft: 0 }}>
                                        <i style={{ fontSize: '1rem', color: '#004767' }} className="fas fa-briefcase"></i> {props.vehicle.luggages}
                                    </span>
                                )}
                                <span style={{ marginLeft: 0, display: 'flex' }} className="icon icon--car icon--doors">
                                    {doors}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-3" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 0,
                        }}>
                            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column'}}>
                            {props.vehicle.fuel_policy && (
                                <div className="geodir-category-location" style={{ marginTop: '0.5rem', padding: 0, display: 'flex' }}>
                                    <i style={{
                                        fontSize: '1.1rem',
                                        marginRight: '1rem',
                                    }} className="fas fa-gas-pump"></i>
                                    <div>
                                        {props.vehicle.carrentalcompanyname && (
                                            <p style={{ lineHeight: '0.5rem', textAlign: 'left', paddingBottom: '0.3rem' }}>Fuel Policy:</p>
                                        )}
                                        <h4 style={{ marginBottom: 0, textAlign: 'left', padding: 0 }}>{fuelPolicy}</h4>
                                    </div>
                                </div>
                            )}
                            <div className="geodir-category-location" style={{ marginTop: '0.5rem', padding: 0, display: 'flex' }}>
                                <object style={{ height: '1.1rem', marginRight: '1rem' }} type="image/svg+xml" data="images/icons/q1.svg">
                                </object>
                                <div>
                                    <p style={{ lineHeight: 'unset', textAlign: 'left', padding: 0 }}>Mileage:</p>
                                    <h4 style={{ marginBottom: 0, textAlign: 'left', padding: 0 }}>Unlimited</h4>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                marginTop: '1rem',
                                marginBottom: '0.5rem',
                            }}>
                                {carTransmission && (
                                    <span style={{ wordBreak: 'break-word', textAlign: 'left',marginBottom: '0.5rem', marginLeft: 0, display: 'flex' }}>
                                        <i style={{ color: 'inherit' }} className="fas fa-check"></i> {carTransmission || 'N/A'} Transmission
                                    </span>
                                )}

                                {props.vehicle.ac && (
                                    <span style={{ wordBreak: 'break-word', textAlign: 'left',marginBottom: '0.5rem', marginLeft: 0 }}>
                                        <i style={{ color: 'inherit' }} className="fas fa-check"></i> Air Conditioning
                                    </span>
                                )}
                            </div>
                        </div>
                        </div>

                        <div style={{ paddingLeft: 0, paddingRight: 0 }} className="col-md-2">
                            <div className="geodir-category-location" style={{ marginTop: '0.5rem', marginBottom: '0.5rem', padding: 0, color: '#157f41' }} >
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Included for Free</p>
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Collision Damage Waiver</p>
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Theft Protection</p>
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Third Party Liability</p>
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Cancellation</p>
                                <p style={{ color: '#157f41', paddingBottom: 0, textAlign: 'center' }}><i style={{ color: 'inherit' }} className="fas fa-check" />Amendments</p>

                                {props.vehicle.winter_tyres_included && <p style={{ textAlign: 'center', color: 'inherit', paddingBottom: 0 }}><i style={{ color: 'inherit' }} className="fas fa-check"></i> Winter Tyres Included</p>}
                                {props.vehicle.snow_chains_included && <p style={{ textAlign: 'center', color: 'inherit', paddingBottom: 0 }}><i style={{ color: 'inherit' }} className="fas fa-check"></i> Snow Chains Included</p>}
                            </div>
                        </div>


                        <div className="col-md-3" style={{ display: 'flex' }}>

                            <div className="geodir-category-location" style={{
                                marginTop: '0.5rem',
                                padding: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}>
                                <div>
                                    <Avatar>
                                        <img style={{ width: '70px', height: 'auto' }} src={suplierLogoUrl} alt={props.vehicle.carrentalcompanyname || props.vehicle.suppliername} />
                                    </Avatar>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}>
                                        <div className="evticket-meta" style={{ width: '100%', padding: 'unset', display: 'flex', flexDirection: 'column' }}>
                                            Rate for {props.daySpan} days
                                            <div style={{ fontSize: '1.4rem', color: 'black' }} className="evticket-price"><span style={{ color: 'black' }}>
                                                {currencySymbol}</span> {new Decimal(props.vehicle.price).absoluteValue().floor().toNumber()}.00
                                            </div>
                                        </div>
                                        {props.vehicle.secondary_price && <div className="evticket-meta" style={{ paddingRight: 0 }}>
                                            <div className="evticket-price"><span>{currencySymbol}</span> {props.vehicle.secondary_price}</div>
                                        </div>}
                                    </div>
                                    {
                                        props.vehicle.deeplink &&
                                        <a id="book-now-btn" onClick={(e) => {
                                            e.preventDefault()
                                            setShowModal(true)
                                            if (!props.currentVisitor?.ip) return
                                            if (!props.currentVisitor?.country_code) return
                                            
                                            post({ data: { ip: props.currentVisitor.ip, country_code: props.currentVisitor.country_code, supplier_id: props.vehicle.supplier_id }})
                                        }} target='_blank' className="capitalize" href={props.vehicle.deeplink}>Select</a>
                                    }
                                    <div style={{ marginBottom: '0.5rem' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ListingItemBody>
            </ListingItemInner>
            <RedirectModal show={showModal} />
        </div >

    );
}