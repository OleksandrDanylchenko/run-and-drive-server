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

export const getLiteralFromPoint = (
  point: Point,
): google.maps.LatLngLiteral => {
  const {
    coordinates: [lng, lat],
  } = point;
  return {
    lat,
    lng,
  };
};
