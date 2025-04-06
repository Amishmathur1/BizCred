import { useState } from "react"; // Import useState for managing active link
import { useLocation } from "react-router-dom"; // Import useLocation if using React Router

function NavBar() {
  const location = useLocation(); // Get the current route
  const [activeLink, setActiveLink] = useState(location.pathname); // Set the active link based on the route

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "How it Works?", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <div className="flex items-center justify-around place-content-center w-full absolute translate-y-5 z-20">
      <img src="logo.png" alt="" />
      <div className="flex items-center justify-evenly w-[50%] rounded-full px-5 py-2">
        {links.map((link) => (
          <a
            key={link.path}
            href={link.path}
            className={`text-lg px-3 py-2 rounded-full transition-all duration-300 ${
              activeLink === link.path
                ? "bg-white text-black"
                : "hover:bg-white hover:text-black"
            }`}
            onClick={() => setActiveLink(link.path)}
          >
            {link.name}
          </a>
        ))}
      </div>
      <button className="rounded-full px-4 py-2 border hover:text-black hover:bg-white transition duration-300 border-white">
        For Business
      </button>
    </div>
  );
}

export default NavBar;
