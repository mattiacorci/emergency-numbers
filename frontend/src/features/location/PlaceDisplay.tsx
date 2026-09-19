// Props: { coords: Coords }
// Mostra lat, lng, accuracy formattati (es. 4 decimali)
//
import type { Coords, NominatimResponse } from "@/types";
import { useTranslation } from "react-i18next";

export function PlaceDisplay({ coords, place }: { coords: Coords; place: NominatimResponse | null }) {

  const { t } = useTranslation();

  return (
    <div>
      {coords && (
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl/normal font-medium">{t('location.youAreIn', { place: place?.display_name ?? '' })}</h2>
          <div className="text-xl font-medium text-neutral-600">
            {t('location.latitude')}: {coords?.lat.toFixed(4)}<br />
            {t('location.longitude')}: {coords?.lon.toFixed(4)}<br />
            {t('location.accuracy')}: {coords?.accuracy} {t('location.meters')}
          </div>
        </div>
      )}
    </div>

  )
}



