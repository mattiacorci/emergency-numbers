// Props: { number: EmergencyNumber }
// Mostra name, category, number
// Pulsante "Chiama" con href="tel:XXX"
// Usa Card + Badge di shadcn per la category

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { HoldToConfirmButton } from "@/components/ui/hold-to-confirm-button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { EmergencyNumber } from "@/types";
import { CircleCheckBig } from 'lucide-react';
import { useTranslation } from "react-i18next";


export function EmergencyCard({ number, className }: { number: EmergencyNumber, className?: string }) {

  let colorsClasses = null;

  if (number.is_primary) {
    colorsClasses = "bg-brand text-white hover:bg-brand-hover outline-none outline-blue-500 focus:outline-2 focus:bg-brand-focus";
  } else if (number.number_type === "police") {
    colorsClasses = "bg-police text-black hover:bg-police-hover outline-none outline-blue-500 focus:outline-2 focus:bg-police-focus";
  } else if (number.number_type === "fire") {
    colorsClasses = "bg-fire text-black hover:bg-fire-hover outline-none outline-blue-500 focus:outline-2 focus:bg-fire-focus";
  } else if (number.number_type === "medical") {
    colorsClasses = "bg-medical text-black hover:bg-medical-hover outline-none outline-blue-500 focus:outline-2 focus:bg-medical-focus";
  }

  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <>
      <Drawer showSwipeHandle={isMobile} swipeDirection={isMobile ? "down" : "right"}>
        <DrawerTrigger render={
          <Button size={null} className={`p-6 rounded-3l text-left rounded-3xl outline-none focus:border-blue-600 focus:outline-2 flex-col items-start ${colorsClasses} ${className || ''}`}>
            <h3 className="text-base">{number.label}</h3>
            <p className="text-4xl">
              {number.number}
            </p>
          </Button>
        }></DrawerTrigger>
        <DrawerContent className="w-lg max-w-128">
          <DrawerHeader>
            <DrawerTitle>{number.label}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 text-xl flex flex-col gap-4">
            <p>
              {t('emergency.callInfo')}
            </p>

            <p>
              {t('emergency.beReady')}
            </p>
            <ul className="p-4 bg-green-200 rounded-3xl flex flex-col gap-2">
              <li className="flex gap-2 align-middle"><CircleCheckBig className="text-green-600" /> {t('emergency.stayCalm')}</li>
              <li className="flex gap-2 align-middle"><CircleCheckBig className="text-green-600" /> {t('emergency.dontHangUp')}</li>
            </ul>
          </div>


          <DrawerFooter>
            <HoldToConfirmButton label={t('emergency.callNumber', { number: number.number })} holdDurationMs={3000} onConfirm={() => window.open(`tel:0123456789${number.number}`, "_blank", "noopener,noreferrer")} holdingLabel={t('emergency.holdFor3Seconds')}>
            </HoldToConfirmButton>
            <DrawerClose render={<Button size="lg" variant="outline" />}>{t('common.cancel')}</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </>
  )
}