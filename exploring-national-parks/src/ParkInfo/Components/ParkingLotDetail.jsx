import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../Style/parkInfo.css';

function useQuery() {
  return new URLSearchParams(window.location.search);
}

const coordsToGMaps = (lat, lng, name) => {
  if (!lat || !lng) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + ',' + lng)}&travelmode=driving&destination_place_id=${encodeURIComponent(name || '')}`;
};

const ParkingLotDetail = () => {
  const query = useQuery();
  const lotId = query.get('lotId');
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLot() {
      try {
        setLoading(true);
        const url = `https://developer.nps.gov/api/v1/parkinglots?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb&id=${lotId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setLot(json.data && json.data.length > 0 ? json.data[0] : null);
      } catch (err) {
        setError(err.message || 'Failed to load parking lot');
      } finally {
        setLoading(false);
      }
    }
    if (lotId) fetchLot();
  }, [lotId]);

  if (loading) return <div className="parking-lot-detail loading">Loading parking lot details...</div>;
  if (error) return <div className="parking-lot-detail error">{error}</div>;
  if (!lot) return <div className="parking-lot-detail empty">Parking lot not found.</div>;

  return (
    <div className="parking-lot-detail">
      <h2>{lot.name || 'Unnamed Parking Lot'}</h2>
      {lot.images && lot.images.length > 0 && (
        <div className="parking-lot-images">
          {lot.images.map(img => (
            <img key={img.url} src={img.url} alt={img.altText || lot.name} style={{ maxWidth: '300px', margin: '8px' }} />
          ))}
        </div>
      )}
      <div className="parking-lot-meta">
        {lot.description && <p>{lot.description}</p>}
        <p><strong>Capacity:</strong> {lot.capacity !== undefined ? lot.capacity : 'Unknown'}</p>
        {lot.latitude && lot.longitude && (
          <p><strong>Coordinates:</strong> {lot.latitude}, {lot.longitude}</p>
        )}
        <p><strong>Accessibility:</strong> {lot.accessibility?.adaFacilitiesDescription || 'Unknown'}</p>
        <p><strong>Fees:</strong> {lot.fees && lot.fees.length > 0 ? lot.fees.map(f => `${f.title}: $${f.cost}`).join(', ') : 'None'}</p>
        <p><strong>Managed By:</strong> {lot.managedByOrganization || 'Unknown'}</p>
        <a href={coordsToGMaps(lot.latitude, lot.longitude, lot.name)} target="_blank" rel="noreferrer">Directions</a>
      </div>
      <div style={{ marginTop: '16px' }}>
        <a href="./ParkInfo?parkCode=" className="park-info-button">Back to Park Info</a>
      </div>
    </div>
  );
};

export default ParkingLotDetail;
