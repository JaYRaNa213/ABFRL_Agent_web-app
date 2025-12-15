import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import SplitLayout from "./components/layout/SplitLayout.jsx";
import MainShop from "./components/shop/MainShop.jsx";
import AgentPanel from "./components/agent/AgentPanel.jsx";
import "./style.css";

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <CartProvider>
          <SplitLayout
            leftChild={<MainShop />}
            rightChild={<AgentPanel />}
            initialSplit={75}
          />
        </CartProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
