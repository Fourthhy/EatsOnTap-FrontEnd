import React, { useState } from "react";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div className="min-h-screen flex bg-black font-[Geist,sans-serif]">
      {/* Left side: building image with blue overlay, cropped and positioned */}
      <div className="hidden md:block relative w-7/12 h-screen">
        <img
          src="/src/assets/LV4.jpg"
          alt="Building"
          className="object-cover object-left w-full h-full"
          style={{ display: 'block' }}
        />
        <div
          className="absolute inset-0 bg-blue-900"
          style={{ opacity: 0.3, pointerEvents: 'none' }}
        ></div>
      </div>
      {/* Right side: login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-5/12 px-8 py-12 bg-white">
        {/* Logo */}
        <img
          src="/src/assets/LV-LOGO 1.png"
          alt="Logo"
          className="mb-12 w-20 h-20"
        />
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-3 text-center">Welcome to Eat's on Tap</h2>
        <p className="text-gray-400 mb-10 text-center text-sm">
          Please enter your details to get started.
        </p>
        <form className="w-full max-w-sm space-y-6">
          {/* Email Floating Label */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full px-3 py-3 border border-gray-200 rounded-[12px] bg-white text-sm focus:outline-none focus:border-blue-700 placeholder-transparent"
              required
              autoComplete="email"
            />
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-200 pointer-events-none px-1
                ${
                  emailFocused
                    ? "text-xs -top-2 bg-white text-blue-700"
                    : email
                    ? "text-xs -top-2 bg-white text-gray-400"
                    : "text-sm top-3 text-gray-400 bg-transparent"
                }`}
            >
              Email
            </label>
          </div>
          {/* Password Floating Label */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full px-3 py-3 border border-gray-200 rounded-[12px] bg-white text-sm focus:outline-none focus:border-blue-700 placeholder-transparent"
              required
              autoComplete="current-password"
            />
            <label
              htmlFor="password"
              className={`absolute left-3 transition-all duration-200 pointer-events-none px-1
                ${
                  passwordFocused
                    ? "text-xs -top-2 bg-white text-blue-700"
                    : password
                    ? "text-xs -top-2 bg-white text-gray-400"
                    : "text-sm top-3 text-gray-400 bg-transparent"
                }`}
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {/* Eye icon */}
              {showPassword ? (
                // Eye (visible)
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // Eye-off (hidden)
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-10.94-7.5a10.97 10.97 0 0 1 2.54-3.62M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 3.5-3.5c0-.96-.38-1.83-1-2.47" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded-[4px]" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full max-w-sm py-3 rounded-[12px] bg-[#254280] text-white text-sm font-medium hover:bg-[#233876] transition flex items-center justify-center"
          >
            Login
          </button>
        </form>
        <div className="w-full max-w-sm flex items-center my-8">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>
        <button
          className="w-full max-w-sm py-3 rounded-[12px] flex items-center justify-center border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition"
        >
          <img
            src="/src/assets/google logo.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default App;