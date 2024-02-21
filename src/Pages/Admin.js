import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { HashLoader } from "react-spinners";
import { FaRegFilePdf } from "react-icons/fa6";
const Admin = () => {
    const [_userAuth, loading, error] = useAuthState(auth);
    const [loader, setLoader] = useState(true);
    const [user, setUser] = useState({});
    const [orgs, setOrgs] = useState([]);
    const [orgsInfo, setOrgsInfo] = useState({
        accepted: 0,
        rejected: 0,
        unreviewed: 0,
    });
    const [clicked, setClicked] = useState({ id: null });

    function handleVerifyOrg(firebaseId, key) {
        setClicked({ id: firebaseId });
        fetch(
            `${process.env.REACT_APP_LOCAL_API_URL}/admin/verify?orgId=${firebaseId}`,
            {
                method: "POST",
                headers: {
                    authorization: `Bearer ${_userAuth.accessToken}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log("data: ", data);
                if (data.status === "OK") {
                    console.log("OKKKAY");
                    var old = document.getElementById("org" + key);
                    var newElem = document.createElement("button");
                    newElem.disabled = true;
                    newElem.className =
                        "hover:scale-105 duration-300 bg-[#6BBE7D] text-[#edede3] w-32 h-8 rounded-2xl font-medium text-[14px]";
                    newElem.innerText = "VERIFIED";
                    old.parentNode.replaceChild(newElem, old);
                    setClicked(false);
                } else {
                    console.log("Error occurred while verifying organisation.");
                    setClicked(false);
                }
            });
    }

    useEffect(() => {
        if (auth.currentUser) {
            auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.role !== "admin") {
                    window.location.replace("/home");
                } else {
                    fetch(`${process.env.REACT_APP_DEPLOYED_API_URL}/org`)
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);
                            setOrgs(data.data);
                            let accepted = 0;
                            orgs.forEach((org) => {
                                if (org.isVerified) accepted++;
                            });
                            setOrgsInfo({
                                ...orgsInfo,
                                accepted,
                                unreviewed: orgs.length - accepted,
                            });
                            setLoader(false);
                        })
                        .catch((err) => {
                            console.log(
                                "error occurred while fetching organisations",
                                err
                            );
                        });
                }
            });
        } else {
            setLoader(false);
        }
    }, [loading]);

    if (loading || loader) {
        return (
            <div className="h-screen flex items-center justify-center">
                <HashLoader color="#36d7b7" size={100} />
            </div>
        );
    }

    return (
        <div className="bg-[#eef0e5] h-screen flex flex-col ">
            <div className="flex items-center pt-3 md:pt-6">
                <img
                    className="h-16 hover:scale-105 duration-300 mt-4 ml-4 sm:ml-8 md:ml-12"
                    src={logo}
                    alt=""
                />
                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-[#191B58] pt-2">
                    VERIFY ORGANIZATION
                </p>
            </div>

            <div className="flex items-center justify-center">
                <div className="flex justify-center items-center rounded-3xl p-2 md:p-4 bg-gradient-to-r from-[#353657] to-[#404162] w-3/4 mt-4 md:mt-8">
                    <div className="w-full text-gray-100 border-r-2 border-b-gray-100 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Accepted: </p>
                            <p className="pl-2 text-[#EAC5C5]">
                                {orgsInfo.accepted}
                            </p>
                        </div>
                    </div>
                    {/* <div className="w-full text-gray-100 border-r-2 border-b-gray-100 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Rejected: </p>
                            <p className="pl-2 text-[#EAC5C5]">
                                {orgsInfo.rejected}
                            </p>
                        </div>
                    </div> */}
                    <div className="w-full text-gray-100 border-b-gray-100 p-2  md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Unreviewed: </p>
                            <p className="pl-2 text-[#EAC5C5]">
                                {orgsInfo.unreviewed}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 
      search */}
            <div className="flex items-center justify-center font-semibold ">
                <div className="flex justify-center items-center rounded-xl p-1 md:p-2 bg-gradient-to-r from-[#353657] to-[#404162] w-11/12 mt-12 md:mt-16">
                    <div className="w-full text-gray-100 border-r-2 border-b-gray-700 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Name </p>
                        </div>
                    </div>
                    <div className="w-full text-gray-100 border-r-2 border-b-gray-700 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Apply Date </p>
                        </div>
                    </div>
                    <div className="w-full text-gray-100 border-r-2 border-b-gray-700 p-2  md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Information </p>
                        </div>
                    </div>
                    <div className="w-full text-gray-100  border-b-gray-700 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                        <div className="flex justify-center">
                            <p>Status </p>
                        </div>
                    </div>
                </div>
            </div>
            {orgs.map((org, key) => {
                return (
                    <div className="flex items-center justify-center  ">
                        <div className="flex justify-center items-center rounded-xl p-1 md:p-2 bg-[#E4E8D3] w-11/12 mt-3 md:mt-4">
                            <div className="w-full text-gray-700 border-r-2 border-gray-500 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                                <div className="flex justify-center">
                                    <p className="font-semibold">{org.name} </p>
                                </div>
                            </div>
                            <div className="w-full text-gray-700 border-r-2 border-gray-500 p-2 md:text-[20px] sm:text-[15px] text-[13px]">
                                <div className="flex justify-center">
                                    <p>{org.applyDate}</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-center text-gray-700 border-r-2 border-gray-500 p-2  md:text-[20px] sm:text-[15px] text-[13px]">
                                <FaRegFilePdf />
                            </div>
                            <div className="w-full flex justify-center text-gray-700 p-2  md:text-[20px] sm:text-[15px] text-[13px]">
                                {org.isVerified ? (
                                    <button
                                        disabled
                                        className="hover:scale-105 duration-300  bg-[#6BBE7D] text-[#edede3] w-32 h-8 rounded-2xl  font-medium text-[14px]"
                                    >
                                        VERIFIED
                                    </button>
                                ) : clicked.id === org.firebaseId ? (
                                    <button
                                        onClick={() => {
                                            handleVerifyOrg(
                                                org.firebaseId,
                                                key
                                            );
                                        }}
                                        className="hover:scale-105 duration-300  bg-[#f1ed9f] text-[#edede3] w-32 h-8 rounded-2xl  font-medium text-[14px]"
                                        id={"org" + key}
                                    >
                                        ACCEPT
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleVerifyOrg(
                                                org.firebaseId,
                                                key
                                            );
                                        }}
                                        className="hover:scale-105 duration-300  bg-[#BEBA6B] text-[#edede3] w-32 h-8 rounded-2xl  font-medium text-[14px]"
                                        id={"org" + key}
                                    >
                                        ACCEPT
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* .. */}
        </div>
    );
};

export default Admin;
