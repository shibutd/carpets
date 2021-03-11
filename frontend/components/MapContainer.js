import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

export function MapContainer(props) {
  const mapStyles = {
    maxWidth: '80%',
    height: '80%',
    borderRadius: '15px',
    marginTop: '15px',
  }

  return (
    <Map
      google={props.google}
      zoom={10}
      style={mapStyles}
      initialCenter={props.position}
    >
     <Marker position={props.position} />
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  language: 'russian'
})(MapContainer)