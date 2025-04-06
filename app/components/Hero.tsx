import { Link } from "react-router-dom"; // Import Link for routing

export default function () {
  return (
    <div className="flex flex-col gap-5 place-items-center w-full mt-20 mb-40 z-20">
      <h1 className="text-6xl text-center font-bold w-[45%]">
        Empower Your Business with BizCred
      </h1>
      <p className="text-2xl dark:text-white/50 text-black/50 font-medium w-[50%] text-center">
        BizCred provides the tools and resources you need to scale your
        business, streamline operations, and reach new heights.
      </p>
      <div className="flex items-center gap-10">
        {/* Updated Get Started button */}
        <Link
          to="/dashboard"
          className="text-2xl font-medium text-white bg-gradient-to-tr from-blue-600 via-zinc-800 to-zinc-900 w-44 h-14 rounded-lg hover:scale-105 transition duration-300 flex items-center justify-center"
        >
          Get Started
        </Link>

        <button className="text-2xl font-medium text-white bg-gradient-to-tr from-zinc-900 via-zinc-800 to-red-600/80 w-44 h-14 rounded-lg hover:scale-105 transition duration-300">
          Learn More
        </button>
      </div>
      <p className="text-2xl font-medium">
        Join thousands of businesses that trust BizCred to simplify their
        workflows and achieve their goals.
      </p>
    </div>
  );
}
