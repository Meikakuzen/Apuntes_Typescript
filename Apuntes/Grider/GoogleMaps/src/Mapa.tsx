import React, { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { user } from './index'

const containerStyle={
    width : '400px',
    height: '400px'
}


const center ={
    lat: user.getLocationLat(),
    lng: user.getLocationLng() 
}

const Mapa = () => {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU"
    })
  
    const [map, setMap] = useState(null)

    const onLoad = useCallback(function callback(map: any){
        const bounds = new window.google.maps.LatLngBounds()
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = useCallback((map: any)=>{
        setMap(null)
    }, [])
  
  
    return isLoaded ? (
        <GoogleMap
        mapContainerStyle = {containerStyle}
        center = {center}
        zoom ={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        >

        </GoogleMap>
    ): <></>
}

export default Mapa