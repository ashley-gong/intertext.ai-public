import {Navbar, NavbarBrand} from "@heroui/react";
import NearestNeighborQuery from "./components/NearestNeighborQuery";
import { TextSectionProvider } from "./contexts/TextSectionContext";

export default function Home() {

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-2 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <TextSectionProvider>
        <Navbar position="static" className="items-start justify-start">
          <NavbarBrand>
            <div>
              <h1 className="font-bold text-2xl text-inherit">Intertext.AI</h1>
              <h6 className="text-sm text-gray-500">AI-Assisted Intertextuality Search</h6>
            </div>
          </NavbarBrand>
        </Navbar>
        <main className="flex flex-row row-start-2 items-start sm:items-start gap-4 w-full">
          <NearestNeighborQuery />
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <p>Last updated 2025 by Ashley Gong.</p>
        </footer>
      </TextSectionProvider>
    </div>
  );
}
