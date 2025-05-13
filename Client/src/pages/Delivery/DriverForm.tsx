import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (position: [number, number] | null) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected driver location</Popup>
    </Marker>
  ) : null;
};

enum DriverStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  OFFLINE = 'OFFLINE',
}

interface Driver {
  driverId: string;
  driverName: string;
  contactNumber: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  currentAddress: string;
  isAvailable: boolean;
  status: DriverStatus;
}

const DriverForm = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(driverId);

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mapRef = useRef<any>(null);

  const [driver, setDriver] = useState<Driver>({
    driverId: '',
    driverName: '',
    contactNumber: '',
    email: '',
    latitude: null,
    longitude: null,
    currentAddress: '',
    isAvailable: true,
    status: DriverStatus.PENDING,
  });

  useEffect(() => {
    if (isEditMode && driverId) {
      setLoading(true);
      axios.get(`/api/v1/delivery/drivers/${driverId}`)
        .then(response => {
          const driverData = response.data;
          setDriver(driverData);
          if (driverData.latitude && driverData.longitude) {
            setPosition([driverData.latitude, driverData.longitude]);
          }
        })
        .catch(err => {
          console.error('Error fetching driver:', err);
          setError('Failed to load driver data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [driverId, isEditMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!driver.driverId) return setError('Please enter a driver ID');
    if (!driver.driverName) return setError('Please enter the driver name');
    if (!driver.latitude || !driver.longitude) return setError('Please select a location on the map');

    try {
      setLoading(true);

      const locationData = {
        driverId: driver.driverId,
        driverName: driver.driverName,
        latitude: driver.latitude,
        longitude: driver.longitude,
      };

      await axios.post('http://localhost:8082/api/v1/delivery/update-location', locationData);

      setSuccess('Driver location updated successfully!');
      setTimeout(() => navigate('/drivers'), 2000);
    } catch (err) {
      console.error('Error saving driver location:', err);
      setError('Failed to update driver location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        setDriver(prev => ({
          ...prev,
          currentAddress: data.display_name,
        }));
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setDriver(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    await reverseGeocode(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setDriver(prev => ({ ...prev, latitude, longitude }));
          reverseGeocode(latitude, longitude);
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  useEffect(() => {
    setMapLoaded(true);
    if (navigator.geolocation && !isEditMode) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setDriver(prev => ({ ...prev, latitude, longitude }));
          reverseGeocode(latitude, longitude);
        },
        () => setPosition([6.9271, 79.8612])
      );
    } else {
      setPosition([6.9271, 79.8612]);
    }
  }, [isEditMode]);

  return (
    <div className="bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-black via-black/80 to-black/60">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">
          {isEditMode ? 'Edit Driver Details' : 'Add New Driver'}
        </h1>

        {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Driver Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Driver ID *</label>
              <input
                type="text"
                name="driverId"
                value={driver.driverId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter driver ID"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Driver Name *</label>
              <input
                type="text"
                name="driverName"
                value={driver.driverName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter driver name"
                required
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-orange-500">Driver Location *</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Use My Current Location
              </button>
              <div className="border rounded shadow-md" style={{ height: '400px' }}>
                {mapLoaded && (
                  <MapContainer
                    center={position || [6.9271, 79.8612]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                      onLocationSelect={handleLocationSelect}
                    />
                  </MapContainer>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">Click on the map to set driver location</p>
            </div>

            <div className="md:w-1/2">
              <label className="block mb-2">Current Address</label>
              <textarea
                name="currentAddress"
                value={driver.currentAddress}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded"
                placeholder="Address will appear here after selecting location"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2">Latitude *</label>
                  <input
                    type="text"
                    value={driver.latitude || ''}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block mb-2">Longitude *</label>
                  <input
                    type="text"
                    value={driver.longitude || ''}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Driver' : 'Save Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
