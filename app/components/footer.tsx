function Footer() {
  return (
    <div className="w-full relative">
      <footer className="w-full z-10 relative">
        <div className="backdrop-blur-3xl text-white bg-black/10 mx-auto w-full px-10 py-10">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start pb-8 mb-8">
            {/* Left Section */}
            <div>
              <h3 className="text-xl font-bold">BizCred</h3>
              <p className="text-sm mt-2">
                Empowering businesses with tokenized lending and AI-driven
                credit scoring.
              </p>
            </div>

            {/* Middle Section */}
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-16">
              <div>
                <h4 className="text-lg font-semibold mb-4">Getting Started</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#">Sign Up</a>
                  </li>
                  <li>
                    <a href="#">Login</a>
                  </li>
                  <li>
                    <a href="#">Forget Password</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Social</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#">LinkedIn</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Facebook</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} BizCred. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Themed Circle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-0">
        <div
          className="h-[20rem] w-[40rem] lg:h-[35rem] lg:w-[55rem] rounded-full"
          style={{
            background: "radial-gradient(circle, #3A29FF, #FF94B4, #FF3232)",
            boxShadow:
              "0 0 60px rgba(58, 41, 255, 0.7), 0 0 120px rgba(255, 50, 50, 0.5)",
          }}
        />
      </div>
    </div>
  );
}

export default Footer;
