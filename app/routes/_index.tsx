import type { MetaFunction } from "@remix-run/node";
import Aurora from "~/components/Aurora";
import { BackgroundBeams } from "~/components/Beams";
import { ContainerScroll } from "~/components/ControllScroll";
import Hero from "~/components/Hero";
import LandingBento from "~/components/LandingBento";
import NavBar from "~/components/Navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "BizCred" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.7}
        amplitude={2.0}
        speed={0.5}
      />
      <NavBar />
      <Hero />
      <BackgroundBeams
        className="blue-beams z-0" // Apply a class for styling if needed
      />
      <LandingBento />
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the Power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src="ss.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
