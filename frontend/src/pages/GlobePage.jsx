import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3-geo';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';


function GlobePage() {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const { country } = useParams();

  // Load GeoJSON country polygons
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
      });
  }, []);

  // Enable auto-rotation
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.7;
    }
  }, []);

  // Handle country click
  const navigate = useNavigate();

const handleCountryClick = (polygon) => {
  const countryName = polygon?.properties?.ADMIN || polygon?.properties?.name || 'Unknown';

  console.log("Clicked country:", countryName);

  // Navigate to /home/:country
  navigate(`/home/${encodeURIComponent(countryName)}`);
};


  return (
    <div className='w-full h-screen'>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries}
        polygonCapColor={() => 'rgba(0, 200, 255, 0.3)'}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={(d) => {
          const name = d?.properties?.ADMIN || d?.properties?.name || 'Unknown country';
          return `<b>${name}</b>`;
        }}
        onPolygonClick={handleCountryClick}
        onPolygonHover={(hoverD) => {
          // Log hover for debug and pause rotation
          console.log('Hovering:', hoverD?.properties?.ADMIN || hoverD?.properties?.name);
          globeEl.current.controls().autoRotate = !hoverD;
        }}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}

export default GlobePage;
