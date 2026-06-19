/** Hauteur de la barre d’onglets mobile (hors safe-area). */
export const MOBILE_TAB_BAR_HEIGHT = '3.5rem'

/** Offset CSS pour placer un élément fixe au-dessus de la barre d’onglets. */
export const MOBILE_TAB_BAR_BOTTOM = `calc(${MOBILE_TAB_BAR_HEIGHT} + env(safe-area-inset-bottom, 0px))`

/** Padding bas du contenu principal quand la barre d’onglets est visible. */
export const MOBILE_TAB_BAR_PADDING = MOBILE_TAB_BAR_BOTTOM
