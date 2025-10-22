import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { FaEyeSlash } from "react-icons/fa";

export default function Login() {
  return (
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
              <p className="font-tolkien text-white text-[1.5vw]">
                LA VERDAD CHRISITIAN COLLEGE
              </p>
              <p className="font-tiroTamil text-white text-[1.5vh]">
                MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
              </p>
              <div
                className="w-[100%] h-[80%] bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/login-card.svg')" }}
              >
                <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">
                  <img src="/lv-logo.svg" alt="lv logo" />
                  <p className="font-geist text-white text-[.97vw]">Please enter your details to get started.</p>
                  <div>
                    <Input
                      style={{
                        background: '#FFFFFF',
                        width: '23vw',
                        height: '6vh',
                        paddingLeft: '5px',
                        font: 'geist'
                      }}
                      type="email"
                      placeholder="Email" />
                  </div>
                  <div style={{ position: 'relative', width: '23vw', height: '6vh' }}>
                    <Input
                      style={{
                        background: '#FFFFFF',
                        width: '100%',
                        height: '100%',
                        paddingLeft: '5px',
                        paddingRight: '30px', // add right padding to avoid text overlap with icon
                        fontFamily: 'geist', // corrected font property
                        boxSizing: 'border-box', // to manage padding correctly
                      }}
                      type="password"
                      placeholder="Password"
                    />
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
                  <div style={{ width: '23vw', height: '7vh' }}>
                    <Button
                      className="hover:cursor-pointer"
                      style={{
                        width: '100%',
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
                        margin: '0 8px',
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
                  <div style={{
                    width: '23vw',
                    height: '7vh',
                    marginBottom: '25px'
                  }}>
                    <Button
                      className="hover:cursor-pointer"
                      style={{
                        width: '100%',
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
    </>
  )
}