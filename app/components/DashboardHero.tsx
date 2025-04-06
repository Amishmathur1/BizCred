import { BackgroundGradientAnimation } from "./BackgroundGradient";

function DashboardHero() {
  return (
    <div className="flex justify-center items-center flex-1 h-full">
      <BackgroundGradientAnimation containerClassName="w-full h-[15rem] rounded-3xl">
        <div className="absolute z-50 inset-0 flex place-items-center place-content-center justify-between text-white font-bold pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl p-5">
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/90 to-white/20">
            Hello, user!!
          </p>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}

export default DashboardHero;
