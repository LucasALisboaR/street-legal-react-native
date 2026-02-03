import Mapbox from '@rnmapbox/maps';

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibHVjYXNsaXNib2EiLCJhIjoiY2xraDFmdWJ4MDF1cDNlbnk5Z25oN3FjNyJ9.XfaFVX1TIK2FVEZu26Urmw';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

export { Mapbox };
