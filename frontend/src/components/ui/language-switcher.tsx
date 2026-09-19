import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const LANGUAGES = [
        { code: "it", label: t("common.languages.italian") },
        { code: "en", label: t("common.languages.english") },
        { code: "de", label: t("common.languages.german") },
        { code: "fr", label: t("common.languages.french") },
        { code: "es", label: t("common.languages.spanish") },
        { code: "zh", label: t("common.languages.chinese") },
        { code: "ja", label: t("common.languages.japanese") },
        { code: "pt", label: t("common.languages.portuguese") },
    ];

    return (
        <Select
            value={i18n.resolvedLanguage}
            onValueChange={(lng) => i18n.changeLanguage(lng || undefined)}
        >
            <SelectTrigger aria-label={t("common.changeLanguage")}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {LANGUAGES.map(({ code, label }) => (
                    <SelectItem key={code} value={code}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}