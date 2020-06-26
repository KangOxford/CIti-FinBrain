import createApiProviders from "../api/apiProviders";
import createStoreProviders from "../stores/storeProviders";
import { Binding } from "react.di";
import i18nProviders from "../internationalization/i18nProviders";
import routingProviders from "../routing/routingProviders";
import navStoreProviders from "../layouts/nav/navStoreProviders";

const isDefault = false;

export default [
  ...i18nProviders,
  ...routingProviders,
  ...navStoreProviders,
  ...createApiProviders(isDefault),
  ...createStoreProviders(isDefault),
] as Binding[];
