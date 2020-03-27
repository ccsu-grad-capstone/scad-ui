import Vue from 'vue'

import './styles/quasar.styl'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  Ripple,
  QSpace,
  QInput,
  QTooltip,
  QAvatar,
  QMenu,
  QBadge,
  QSeparator,
  QCard,
  QScrollArea,
  QCardSection,
  QImg,
  QForm,
  QBtnGroup,
  QSelect,
  QSlider,
  QDialog,
  QTable,
  QMarkupTable,
  QTd,
  QPopupEdit,
  QTr,
  QCardActions,
  QCheckbox,
  Loading,
  Notify

} from 'quasar'

Vue.use(Quasar, {
  config: {
    brand: {
      primary: '#3d8569',
      secondary: '#fcdc79',
      accent: '#8f0909',

      dark: '#1d1d1d',

      positive: '#5df080',
      negative: '#fa1a44',
      info: '#6f8da8',
      warning: '#F2C037'
    }
  },
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSpace,
    QInput,
    QTooltip,
    QAvatar,
    QMenu,
    QBadge,
    QSeparator,
    QCard,
    QScrollArea,
    QCardSection,
    QImg,
    QForm,
    QBtnGroup,
    QSelect,
    QSlider,
    QDialog,
    QTable,
    QMarkupTable,
    QTd,
    QPopupEdit,
    QTr,
    QCardActions,
    QCheckbox
  },
  directives: {
    Ripple
  },
  plugins: {
    Loading,
    Notify
  }
})
