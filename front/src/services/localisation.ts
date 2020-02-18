export class Localisation {
    public static GEOLOCALITION_NOT_SUPPORTED = "Geolocation is not supported by this browser.";

    public static getUserLocalisation(): Promise<Coordinates> {
        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {
                reject(Localisation.GEOLOCALITION_NOT_SUPPORTED)
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position.coords),
                positionError => reject(positionError),
                {
                    enableHighAccuracy: true
                }
            )
        })
    }
}
