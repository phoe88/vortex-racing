/**
 * Demo imagery (Unsplash). Replace through the admin media library — every
 * image field in the CMS accepts any URL or a Supabase Storage upload.
 */
export function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const IMG = {
  gridLineup: "1659203206829-218b9b5930e5",
  darkCar: "1614949194403-9602bdc14a3a",
  yellowCar: "1610905376670-5e7e0e8a3cfb",
  redYellowCar: "1632726144626-6f6a8876e35d",
  crowdBlur: "1744841332448-f4a2d6011202",
  carsCurbs: "1652090379496-4219a00c8ebf",
  streetCircuit: "1623258406180-df4c68d0798f",
  garageRear: "1625905928324-577cf7f94ac4",
  redGrid: "1631392426516-affff6b1d41c",
  spaCars: "1773142181818-5842662aea51",
  blueWhiteCar: "1674154634776-acd0fc94ab71",
  aerialWater: "1694865995615-e9fe6962c8dc",
  aerialSunrise: "1777362039145-efdcd02eb988",
  aerialTrees: "1760456015073-da7cefc89a85",
  aerialKart: "1768070855525-f27ebd8c46ef",
  driverRedSuit: "1761751237853-7489598b7498",
  racerFlameJacket: "1645375288944-e7a4d183b106",
  garageHelmets: "1761751237616-df7e2f9211d8",
  driverInCar: "1552255440-ac1fa0a5b2a3",
  garageSilhouettes: "1765202661219-cec5ad98f324",
  garageCrew: "1765202662641-d22f5a214d51",
  pitCrewDark: "1771425105292-bb2737097d5a",
  pitLaneCrowd: "1761044975589-3972343a9958",
  monaco: "1786609852224-7abde72482c5",
  trophies: "1718434067642-49d79ab4d15f",
  driverWave: "1718434120153-6f14ef43a2b3",
  driverTrophy: "1718434144260-e19ab6474279",
  racerWalk: "1770985306049-770d2893ab05",
  fansGrandstand: "1751412168869-45d7fc36ce17",
  sunsetStadium: "1785442851846-99b054e6f14e",
  glovesWheel: "1771920800290-53f22e5ac3f8",
  cockpitSeated: "1780982907230-bb42eb1a4965",
  cockpitClose: "1771216596227-f17c69f33912",
  driverBlueSuit: "1786404765253-7af36b4506f2",
  mechanicEngine: "1761231558088-99b391ad4052",
  whiteSuit: "1552255472-3330e5928013",
  helmetPortrait: "1533573271545-c1604421c980",
} as const;
