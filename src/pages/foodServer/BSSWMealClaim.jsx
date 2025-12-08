import React from "react";
import LvLogo from "/lv-logo.svg";
import sampleStudentProfile from "/MealClaim/Sample_Student_Profile.svg";
import BSSWlogo from "/MealClaim/BSSW-logo.svg";

function BSSWMealClaim() {
  const sampleStudentName = "Doe, J***";
  const sampleProgram = "BSSW 4";
  const sampleStudentID = "22-*****rjd";
  const sampleCreditValue = "₱60.00";

  return (
    <div className="flex flex-col  w-full h-screen bg-[url(/MealClaim/BGClaimed.svg)] bg-cover bg-no-repeat bg-center">
      <div
        className=" text-white mb-4"
        style={{ marginLeft: "40px", paddingTop: "30px" }}
      >
        <p className="text-[18px] font-tolkien">
          LA VERDAD CHRISTIAN COLLEGE, INC.
        </p>
        <p className="text-[12px]">
          MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
        </p>
      </div>
      <div className="flex items-center justify-center flex-grow">
        <div
          style={{
            width: "765px",
            height: "461px",
            backgroundImage: "url('/MealClaim/BSSW-card.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            gridTemplateRows: "20% 60% 20%",
            paddingLeft: 30,
            paddingTop: 10,
          }}
        >
          <div className="w-full h-full flex gap-[21px]">
            <div className="h-full flex items-center">
              <img src={LvLogo} alt="LV logo" />
            </div>
            <div className="h-full flex items-center">
              <p
                style={{
                  fontFamily: "geist",
                  fontSize: 35,
                  color: "white",
                  fontWeight: 450,
                }}
              >
                {sampleStudentName}
              </p>
            </div>
          </div>
          <div className="w-full h-full">
            <div className="h-[90%] w-full grid grid-cols-3">
              <div className="w-full h-full flex items-center">
                <img src={sampleStudentProfile} alt="Student profile" />
              </div>
              <div
                className="w-full h-full flex flex-col justify-evenly"
                style={{ paddingLeft: 25 }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "geist",
                      fontSize: 30,
                      color: "white",
                      fontWeight: 450,
                    }}
                  >
                    {sampleStudentID}
                  </p>
                  <p
                    style={{
                      fontFamily: "geist",
                      fontSize: 15,
                      color: "#999797",
                      fontWeight: 400,
                    }}
                  >
                    ID number
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "geist",
                      fontSize: 30,
                      color: "white",
                      fontWeight: 450,
                    }}
                  >
                    {sampleProgram}
                  </p>
                  <p
                    style={{
                      fontFamily: "geist",
                      fontSize: 15,
                      color: "#999797",
                      fontWeight: 400,
                    }}
                  >
                    Section/Year
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-end">
                <img
                  src={BSSWlogo}
                  alt="BSSW logo"
                  className="w-[180px]"
                  style={{ marginRight: "10px" }}
                />
              </div>
            </div>
            <div
              className="h-[10%] w-[30%] flex items-center"
              style={{
                fontFamily: "geist",
                fontSize: 15,
                color: "white",
                fontWeight: 400,
                marginLeft: 15,
              }}
            >
              August 20, 2025 | 11:45:37 AM
            </div>
          </div>
          <div
            className="w-full h-full flex justify-between items-end"
            style={{ paddingBottom: 5, paddingRight: 20 }}
          >
            <p
              style={{
                fontFamily: "geist",
                fontSize: 16,
                color: "#808080",
                fontWeight: 450,
                paddingBottom: 10,
              }}
            >
              Note: Non-transferable and valid for daily use only
            </p>
            <p
              style={{
                fontFamily: "geist",
                fontSize: 20,
                fontWeight: 500,
                color: "black",
              }}
            >
              {sampleCreditValue}
            </p>
          </div>
        </div>
      </div>
      <div
        className="text-white font-semibold"
        style={{ marginLeft: "20px", paddingBottom: "20px" }}
      >
        <p className="text-[10px]">Powered By:</p>
        <p className="text-[13px]">BSIS4 - GROUP 4 BATCH 2025</p>
      </div>
    </div>
  );
}

export default BSSWMealClaim;
