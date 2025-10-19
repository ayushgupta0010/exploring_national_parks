
import React from 'react';
import '../../Style/parkInfo.css';

const coordsToGMaps = (lat, lng, name) => {
  if (!lat || !lng) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + ',' + lng)}&travelmode=driving&destination_place_id=${encodeURIComponent(name || '')}`;
};

const ParkingLots = ({ lots = [] }) => {
  if (!lots || lots.length === 0) {
    return <div className="parking-lot-detail empty">No parking lot information available.</div>;
  }
  return (
    <div className="parking-lot-detail">
      <h3>Parking Lots</h3>
      <ul>
        {lots.map((lot) => (
          <li key={lot.id || lot.name} className="parking-lot-item">
            <div className="parking-lot-title">
              <a href={`./ParkingLotDetail?lotId=${lot.id}`}>{lot.name || 'Unnamed lot'}</a>
            </div>
            {lot.description && <div className="parking-lot-desc">{lot.description}</div>}
            <div className="parking-lot-meta">
              {lot.capacity !== undefined && <span>Capacity: {lot.capacity}</span>}
              {lot.latitude && lot.longitude && (
                <span>
                  {' '}Coordinates: {lot.latitude}, {lot.longitude}
                </span>
              )}
            </div>
            <div className="parking-lot-actions">
              <a href={coordsToGMaps(lot.latitude, lot.longitude, lot.name)} target="_blank" rel="noreferrer">Directions</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingLots;
