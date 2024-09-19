import LeftNav from "./components/leftnav/LeftNav.jsx";
import { Outlet } from "react-router-dom";
import Header from './components/leftnav/Header.jsx';
export default function RootLayout() {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      <LeftNav />
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        <Header />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
