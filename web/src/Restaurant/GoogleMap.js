import React, { useRef, useEffect } from "react";

const GoogleMap = ({ startupLocation, endupLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      // Load Google Maps API script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCgHyHhv9Ypzzjs-U3OJbfeEv-rwf9dg5c&libraries=places`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 0, lng: 0 },
    });

    directionsRenderer.setMap(map);

    const request = {
      origin: startupLocation,
      destination: endupLocation,
      travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed due to " + status);
      }
    });
  };

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default GoogleMap;
