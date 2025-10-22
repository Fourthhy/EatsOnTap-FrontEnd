import { useBreakpoint } from "use-breakpoint"
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { Label } from "@/components/ui/label"
import { FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("")

  const BREAKPOINTS = {
    'mobile-md': 375,
    'mobile-lg': 425,
    'tablet': 768,
    'laptop-md': 1024,
    'laptop-lg': 1440,
  };

  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

  const buttonHeight =
    breakpoint === 'laptop-lg'
      ? '4vh'
      : breakpoint === 'laptop-md'
        ? '6vh'
        : '4vh'; // fallback for all other breakpoints

  const inputBoxHeight =
    breakpoint === 'laptop-lg'
      ? '4vh'
      : breakpoint === 'laptop-md'
        ? '6vh'
        : '5vh'; // fallback for mobile breakpoint

  const screenType =
    breakpoint === 'laptop-md' || breakpoint === 'laptop-lg' ? "laptop" :
      breakpoint === 'mobile-md' || breakpoint === 'mobile-lg' || breakpoint === "tablet" ? "handheld" : "";

  return (
    <>
      {screenType === "laptop" ?
        <>
          <div
            className="h-[100vh] w-[100vw]">
            <div
              className="h-[100vh] w-[100vw]"
              style={{
                margin: 0,
                padding: 0,
                background: 'linear-gradient(to bottom, #153FA3, #142345)',
              }}
            >
              <div className="grid grid-cols-[40vw_60vw]">
                {/*LOGIN MODAL*/}
                <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">

                  <div className="flex flex-col items-center" style={{ marginBottom: '15px' }}>
                    <p className="font-tolkien text-white text-[1.5vw]">
                      LA VERDAD CHRISITIAN COLLEGE
                    </p>
                    <p className="font-tiroTamil text-white text-[1.5vh]">
                      {/* MacArthur Highway, Sampaloc, Apalit, Pampanga 2016 */}
                      {breakpoint}
                    </p>
                  </div>

                  <div
                    // className="w-[100%] h-[80%] bg-contain bg-center bg-no-repeat"
                    // style={{ backgroundImage: "url('/login-card.svg')" }}
                    className="
                      w-100 h-120
                      [border-top-left-radius:32px]
                      [border-bottom-right-radius:32px]
                      shadow-xl
                      bg-gradient-to-br
                      from-blue-600 via-pink-400 to-yellow-300"
                  >

                    <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">
                      <img style={{ width: '5vw' }} src="/lv-logo.svg" alt="lv logo" />
                      <p className="font-geist text-white text-[.97vw]">Please enter your details to get started.</p>
                      <div>
                        <Input
                          style={{
                            background: '#FFFFFF',
                            width: '23vw',
                            height: inputBoxHeight,
                            paddingLeft: '5px',
                            font: 'geist'
                          }}
                          type="email"
                          placeholder="Email" />
                        {errorMessageEmail === "" ? "" :
                          <>
                            <Label>
                              <p style={{
                                fontFamily: 'geist',
                                font: 'regular',
                                color: '#D13B3B',
                                paddingTop: '2px'
                              }}
                                className="text-[1vw]"
                              >
                                {errorMessageEmail}
                              </p>
                            </Label>
                          </>
                        }
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Input
                          style={{
                            background: '#FFFFFF',
                            width: '23vw',
                            height: inputBoxHeight,
                            paddingLeft: '5px',
                            paddingRight: '30px', // add right padding to avoid text overlap with icon
                            fontFamily: 'geist', // corrected font property
                            boxSizing: 'border-box', // to manage padding correctly
                          }}
                          type="password"
                          placeholder="Password"
                        />
                        {errorMessagePassword === "" ? "" :
                          <>
                            <Label>
                              <p style={{
                                fontFamily: 'geist',
                                font: 'regular',
                                color: '#D13B3B',
                                paddingTop: '2px'
                              }}
                                className="text-[1vw]"
                              >
                                {errorMessagePassword}
                              </p>
                            </Label>
                          </>
                        }
                        <FaEyeSlash
                          color="#C0C0C0"
                          style={{
                            width: '2vw',
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            pointerEvents: 'auto', // icon will be clickable later if needed
                          }}
                        />
                      </div>
                      <p className="w-[23vw] text-right font-geist text-[#3F6AC9] text-[.97vw] hover:underline hover:cursor-pointer">Forgot Password?</p>
                      <div>

                        <Button
                          className="hover:cursor-pointer"
                          style={{
                            width: '23vw',
                            height: buttonHeight,
                            backgroundColor: '#254280',
                          }}>
                          Login
                        </Button>
                      </div>

                      <div
                        style={{
                          width: '23vw',
                          height: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '35%',
                            height: '1px',
                            backgroundColor: '#4C4B4B',
                            marginRight: '16px',
                          }}
                        />
                        <span
                          style={{
                            color: '#4C4B4B',
                            margin: '8px',
                            fontSize: '1vw',
                            fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                          }}
                        >
                          or
                        </span>
                        <div
                          style={{
                            width: '35%',
                            height: '1px',
                            backgroundColor: '#4C4B4B',
                            marginLeft: '16px',
                          }}
                        />
                      </div>

                      <div style={{}}>
                        <Button
                          className="hover:cursor-pointer"
                          style={{
                            width: '23vw',
                            height: buttonHeight,
                            backgroundColor: 'white',
                          }}>
                          <div
                            className="flex gap-3 items-center"
                          >
                            <img src="/google-icon.svg" alt="google-icon" />
                            <p
                              style={{
                                paddingTop: '2px',
                              }}
                              className="pt-[1px] font-geist text-[.97vw] font-medium text-black">
                              Continue with Google
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/*HERO IMAGE*/}
                <div className="flex justify-end h-[100vh]">
                  <img className="w-[100%] h-[100%] object-cover shadow-xl shadow-[-20px_10px_30px_rgba(0,0,0,0.5)]" src="/login-hero-image.svg" alt="hero-image" />
                </div>
              </div>
            </div>
          </div>
        </> :
        screenType === "handheld" ?
          <>
            <div className="h-[100vh] w-[100vw]">
              <div
                className="h-[100vh] w-[100vw] flex flex-col items-center justify-center"
                style={{
                  margin: 0,
                  padding: 0,
                  background: 'linear-gradient(to bottom, #153FA3, #142345)',
                }}
              >

                <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">

                  <div className="flex flex-col items-center" style={{ marginBottom: '15px' }}>
                    <p className="font-tolkien text-white text-[1.5vh]">
                      LA VERDAD CHRISITIAN COLLEGE
                    </p>
                    <p className="font-tiroTamil text-white text-[1.5vh]">
                      {/* MacArthur Highway, Sampaloc, Apalit, Pampanga 2016 */}
                      {breakpoint}
                    </p>
                  </div>

                  <div
                    // className="w-[100%] h-[80%] bg-contain bg-center bg-no-repeat"
                    // style={{ backgroundImage: "url('/login-card.svg')" }}
                    className="
                      w-95 h-120
                      [border-top-left-radius:32px]
                      [border-bottom-right-radius:32px]
                      shadow-xl
                      bg-gradient-to-br
                      from-blue-600 via-pink-400 to-yellow-300"
                  >

                    <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">
                      <img style={{ width: '7vh' }} src="/lv-logo.svg" alt="lv logo" />
                      <p className="font-geist text-white text-[1.5vh]">Please enter your details to get started.</p>
                      <div>
                        <Input
                          style={{
                            background: '#FFFFFF',
                            width: '80vw',
                            height: inputBoxHeight,
                            paddingLeft: '5px',
                            font: 'geist'
                          }}
                          type="email"
                          placeholder="Email" />
                        {errorMessageEmail === "" ? "" :
                          <>
                            <Label>
                              <p style={{
                                fontFamily: 'geist',
                                font: 'regular',
                                color: '#D13B3B',
                                paddingTop: '2px'
                              }}
                                className="text-[1.5vh]"
                              >
                                {errorMessageEmail}
                              </p>
                            </Label>
                          </>
                        }
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Input
                          style={{
                            background: '#FFFFFF',
                            width: '80vw',
                            height: inputBoxHeight,
                            paddingLeft: '5px',
                            paddingRight: '30px', // add right padding to avoid text overlap with icon
                            fontFamily: 'geist', // corrected font property
                            boxSizing: 'border-box', // to manage padding correctly
                          }}
                          type="password"
                          placeholder="Password"
                        />
                        {errorMessagePassword === "" ? "" :
                          <>
                            <Label>
                              <p style={{
                                fontFamily: 'geist',
                                font: 'regular',
                                color: '#D13B3B',
                                paddingTop: '2px'
                              }}
                                className="text-[1.5vh]"
                              >
                                {errorMessagePassword}
                              </p>
                            </Label>
                          </>
                        }
                        <FaEyeSlash
                          color="#C0C0C0"
                          style={{
                            width: '10vw',
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            pointerEvents: 'auto', // icon will be clickable later if needed
                          }}
                        />
                      </div>
                      <p
                        className="w-[80vw] text-right font-geist text-[#3F6AC9] text-[1.4vh] hover:underline hover:cursor-pointer">
                        Forgot Password?
                      </p>
                      <div>

                        <Button
                          className="hover:cursor-pointer"
                          style={{
                            width: '80vw',
                            height: buttonHeight,
                            backgroundColor: '#254280',
                          }}>
                          Login
                        </Button>
                      </div>

                      <div
                        style={{
                          width: '90vw',
                          height: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '35%',
                            height: '1px',
                            backgroundColor: '#4C4B4B',
                            marginRight: '16px',
                          }}
                        />
                        <span
                          style={{
                            color: '#4C4B4B',
                            margin: '8px',
                            fontSize: '1vw',
                            fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                          }}
                        >
                          or
                        </span>
                        <div
                          style={{
                            width: '35%',
                            height: '1px',
                            backgroundColor: '#4C4B4B',
                            marginLeft: '16px',
                          }}
                        />
                      </div>

                      <div style={{}}>
                        <Button
                          className="hover:cursor-pointer"
                          style={{
                            width: '80vw',
                            height: buttonHeight,
                            backgroundColor: 'white',
                          }}>
                          <div
                            className="flex gap-3 items-center"
                          >
                            <img src="/google-icon.svg" alt="google-icon" />
                            <p
                              style={{
                                paddingTop: '2px',
                              }}
                              className="pt-[1px] font-geist text-[1.5vh] font-medium text-black">
                              Continue with Google
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </> : ""}
    </>
  )
}

