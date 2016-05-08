export function getMarkersForTeam(team) {
  // for testing purposes use example markers
  // server driven markers => coming soon...
  return [
    {
      coordinate: {
        latitude: 42.004915,
        longitude: 21.392972
      },
      title: '',
      passphrase: 'swordfish',
      description: '',
      iconName: 'book',
      iconColor: '#900'
    },
    {
      coordinate: {
        latitude: 42.003639,
        longitude: 21.392650
      },
      title: '',
      description: '',
      passphrase: 'open sesame',
      iconName: 'camera',
      iconColor: '#333'
    }
  ];
}
