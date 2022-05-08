import { Point } from 'geojson';

export const getPointFromLiteral = (
  location: google.maps.LatLngLiteral,
): Point => {
  const { lat, lng } = location;
  return {
    type: 'Point',
    coordinates: [lng, lat],
  };
};
