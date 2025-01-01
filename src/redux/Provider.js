import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

const Providers = ({ children }) => {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default Providers;