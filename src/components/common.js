import Vue from 'vue';
import commonTabs from "./common/tabs/tabs"
import commonSort from "./common/sort/sort"
import commonCheckbox from "./common/checkbox/checkbox"
import commonSearchBar from "./common/searchBar/searchBar"
import commonProgress from "./common/progress/progress"
import commonSelect from "./common/select/select"
// import commonOption from "./common/select/option"
import commonLoading from "./common/loading/loading"
import commonProgressbar from "./common/progressbar/progressbar"
import commonSubmenu from "./common/submenu/submenu"
import collapseTransition from "./common/collapseTransition/collapseTransition"
Vue.component("common-tabs",commonTabs)
Vue.component("common-sort",commonSort)
Vue.component("common-checkbox",commonCheckbox)
Vue.component("common-search-bar",commonSearchBar)
Vue.component("common-progress",commonProgress)
Vue.component("common-select",commonSelect)
// Vue.component("common-option",commonOption)
Vue.component("common-loading",commonLoading)
Vue.component("common-progressbar",commonProgressbar)
Vue.component("common-submenu",commonSubmenu)
Vue.component("common-collapse-transition",collapseTransition)