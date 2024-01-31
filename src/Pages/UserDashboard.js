import React, { useEffect, useState } from "react";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import person from "../assets/images/person.png";
import { PiHandCoinsBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
// import map from "../assets/images/map.png";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import HashLoader from "react-spinners/HashLoader";
import { auth, storage } from "../firebase.js";
import { getDownloadURL, ref } from "firebase/storage";
import Logout from "./logout_pop.js";
import EditPassword from "./EditPassword.js";
import { TbMessages } from "react-icons/tb";
import { Link } from "react-router-dom";
import moment from "moment";
import { useContext } from "react";
import { ProfileContext } from "../Components/ProfileContextProvider.js";
import Maps_DashBoard from "../Components/Maps_Dashboard.js";
import logo from "../assets/images/logo.png";
import { RxActivityLog } from "react-icons/rx";

const UserDashboard = () => {
    const [nav1, setNav1] = useState(true);

    const handleNav1 = () => {
        setNav1(!nav1);
    };
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };
    const [showMyModel, setShowMyModal] = useState(false);
    const handleOnClose = () => setShowMyModal(false);

    const [showMyModel1, setShowMyModal1] = useState(false);
    const handleOnClose1 = () => setShowMyModal1(false);

    // const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    // const [profile, setProfile] = useState(person);
    const [communities, setCommunities] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [profile, setProfile] = useContext(ProfileContext);
    const [loader, setLoader] = useState(true);
    const [markers, setMarkers] = useState([]);

    const handleMarkerClick = (marker) => {
        console.log("Marker clicked:", marker);
        // Perform actions when a marker is clicked
    };

    moment().format("MMMM Do YYYY");

    useEffect(() => {
        if (auth.currentUser) {
            auth.currentUser
                .getIdTokenResult()
                .then((tokenResult) => {
                    return tokenResult.claims.userId;
                })
                .then((userId) => {
                    Promise.all([
                        fetch(
                            `${process.env.REACT_APP_LOCAL_API_URL}/user/${userId}`
                        ),
                        fetch(
                            `${process.env.REACT_APP_LOCAL_API_URL}/campaign/upcoming`
                        ),
                    ])
                        .then((responses) => {
                            // responses[0] corresponds to the result of the first fetch
                            // responses[1] corresponds to the result of the second fetch
                            return Promise.all(
                                responses.map((response) => response.json())
                            );
                        })
                        .then((data) => {
                            // data[0] contains the parsed JSON from the first response
                            // data[1] contains the parsed JSON from the second response
                            console.log(data);
                            const storageRef = ref(
                                storage,
                                data[0].data.photoPathFirestore
                            );
                            getDownloadURL(storageRef)
                                .then(function (url) {
                                    setProfile({
                                        url,
                                        name: data[0].data.name,
                                    });
                                    localStorage.setItem(
                                        "profile",
                                        JSON.stringify({
                                            profileUrl: url,
                                            profileName: data[0].data.name,
                                        })
                                    );
                                    // setName(data[0].data.name);
                                    console.log(data[0].data);
                                    setCommunities(data[0].data.communities);
                                    setLoader(false);
                                    setCampaigns(data[1].data);
                                    setMarkers(
                                        data[1].data.map((campaign) => {
                                            return {
                                                campaignName: campaign.name,
                                                organizationName:
                                                    campaign.organization.name,
                                                location: {
                                                    lat: campaign.latitude,
                                                    lng: campaign.longitude,
                                                },
                                                startDate: campaign.startDate,
                                                endDate: campaign.endDate,
                                                locationType:
                                                    campaign.locationType,
                                                address: campaign.address,
                                                city: campaign.city,
                                                country: campaign.country,
                                                registeredUsersCount:
                                                    campaign.registeredUsersCount,
                                            };
                                        })
                                    );
                                    console.log(data[1].data);
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });
                        })
                        .catch((err) => {
                            console.error(
                                "ERROR WHILE FETCHING USER DATA: ",
                                err
                            );
                        });
                })
                .catch((err) => {
                    console.error("ERROR IN auth.currentUser: ", err);
                });
        } else {
            window.location.replace("/login");
        }
    }, [user]);

    if (loading || loader) {
        return (
            <div className="h-screen flex items-center justify-center">
                <HashLoader color="#36d7b7" size={100} />
            </div>
        );
    }
    if (!loading && !user) {
        window.location.replace("/login");
    }

    return (
        <div className="flex flex-col w-full xl:h-screen">
            <div className="w-full bg-[#0f1035] text-white flex justify-between ">
                <div className="flex items-center">
                    <div
                        onClick={handleNav}
                        className="text-2xl lg:3xl block xl:hidden ml-2 "
                    >
                        {nav ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </div>
                    <Link to="/">
                        <img
                            className="h-12  hover:scale-105 duration-300 md:h-16 mt-2"
                            src={logo}
                            alt=""
                        />
                    </Link>
                    <div className="ml-5 xl:m-6 text-3xl font-bold hidden xl:flex">
                        USER DASHBOARD
                    </div>
                    <a className="flex items-center sm:text-2xl md:text-3xl lg:text-3xl m-5 xl:m-8 sm:m-7 lg:m-6 gap-1 sm:gap-2 lg:gap-3 cursor-pointer ">
                        <Link to="/log">
                            <div className="flex items-center  hover:text-blue-400 text-[1.23rem] md:text-3xl lg:text-xl sm:flex">
                                <div className="text-2xl text-white mr-2">
                                    <RxActivityLog />
                                </div>
                                <div className="mb-2 hidden lg:flex mt-2">
                                    Activity Log
                                </div>
                            </div>{" "}
                        </Link>
                    </a>
                </div>
                <div className="flex justify-end items-center text-2xl sm:text-2xl md:text-3xl mr-1">
                    <Link
                        to="/store"
                        className="mx-1 sm:mx-2 lg:mx-3 xl:mx-8 cursor-pointer hover:scale-110 duration-300"
                    >
                        <MdOutlineLocalGroceryStore />
                    </Link>
                    <Link
                        to="/chat"
                        className="mx-1 sm:mx-3 lg:mx-5 xl:mx-8 cursor-pointer hover:scale-110 duration-300"
                    >
                        <TbMessages />
                    </Link>
                    <div className="flex mx-2 sm:mx-5 lg:mx-8 items-center">
                        <Link to="/user/profile">
                            <img
                                className="w-[60px] h-[60px] mx-4 rounded-full hover:scale-110 cursor-pointer duration-300 my-1"
                                src={profile.url}
                                alt=""
                            />
                        </Link>
                        <div className="text-3xl hidden md:flex">
                            {profile.name}
                        </div>
                        <a className="ml-2 mr-5 cursor-pointer text-3xl">
                            {" "}
                            <div onClick={handleNav1} className="block">
                                {nav1 ? (
                                    <TiArrowSortedUp />
                                ) : (
                                    <div className="mt-2">
                                        {" "}
                                        <TiArrowSortedDown />{" "}
                                    </div>
                                )}
                            </div>{" "}
                        </a>
                    </div>
                </div>
                <div
                    className={
                        !nav1
                            ? " flex flex-col cursor-pointer text-white text-2xl absolute right-10 top-[4.3rem] sm:top-[5.25rem] sm:w-[25%] border-r border-r-gray-900 bg-[#0f1035] ease-up-down duration-0"
                            : "ease-up-down duration-0 fixed left-[-200%]"
                    }
                >
                    <Link
                        to="/user/profile"
                        className="p-4 hover:scale-100 duration-300"
                    >
                        View Profile
                    </Link>
                    <a
                        className="p-4 hover:scale-100 duration-300"
                        onClick={() => setShowMyModal(true)}
                    >
                        Logout
                    </a>
                </div>
            </div>

            <div className="flex h-full">
                <div className="hidden xl:flex bg-[#0f1035] w-[25%] flex-col justify-around gap-0 items-center pb-0 border-t border-[#eef0e5]">
                    <Link to="/user/join">
                        <button className=" flex justify-center items-center gap-1 bg-[#eef0e5] text-[#0f1035] xl:text-[15px] 2xl:text-[19px] font-bold rounded-xl h-[2.8rem]  2xl:h-[3.2rem] w-56 2xl:w-64 hover:scale-105 duration-300 mt-3">
                            {" "}
                            <FaPlus />
                            Join Community
                        </button>
                    </Link>
                    <p className="text-[#eef0e5] text-2xl 2xl:text-2xl font-bold my-1 mt-1">
                        Joined Communities
                    </p>
                    <div className="flex flex-col gap-2 2xl:gap-5 overflow-x-hidden overflow-y-hidden w-full px-3">
                        {communities ? (
                            communities.slice(0, 4).map((community, key) => (
                                <a
                                    key={key}
                                    href={
                                        "/org/profile/" + community.organization
                                    }
                                >
                                    <div className="flex pb-3 2xl:pb-3 border-b-2 xl:gap-3 2xl:gap-4 px-4 2xl:px-7 hover:scale-105 duration-300">
                                        <img
                                            className="w-[50px] h-[50px] 2xl:w-[52px] 2xl:h-[52px] rounded-full"
                                            src={person}
                                            alt=""
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-[#eef0e5] text-[0.88rem] 2xl:text-[1rem] mt-1 2xl:mt-0">
                                                {community.orgName}
                                            </p>
                                            <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[0.9rem]">
                                                {community.userCount} People
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="flex justify-center items-center">
                                <p className="text-white">
                                    No community joined yet
                                </p>
                            </div>
                        )}
                    </div>
                    <button className=" flex justify-center items-center gap-1 bg-[#eef0e5] text-[#0f1035] xl:text-[17px] 2xl:text-[22px] font-bold rounded-xl h-[2.8rem]  2xl:h-[3.20rem] w-56 2xl:w-64 my-4 2xl:my-5 hover:scale-105 duration-300">
                        View More{" "}
                        <div className="mt-[0.32rem] text-3xl">
                            <FaLongArrowAltRight />
                        </div>{" "}
                    </button>
                </div>
                <div
                    className="w-full 2xl:w-[75%] bg-[#eef0e5] flex flex-col lg:flex-row lg:justify-around  
             justify-center items-center gap-10"
                >
                    <div>
                        <Maps_DashBoard
                            markers={markers}
                            onMarkerClick={handleMarkerClick}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-5 mr-6 py-8 xl:py-6">
                        <p className="text-[25px] font-bold text-[#0F1035] ">
                            UPCOMING CAMPAIGNS
                        </p>
                        <div className="border-black border-[1px] flex flex-col gap-5 bg-[#E1E5CD] pt-1">
                            {campaigns?.length > 0 ? (
                                campaigns.map((campaign) => {
                                    return (
                                        <a href="">
                                            <div className=" flex pb-3 border-b-2 gap-7 px-2 hover:scale-105 duration-300">
                                                <div className="text-6xl ">
                                                    <SlCalender />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-black text-[1.15rem] ">
                                                        {campaign.name
                                                            ? campaign.name
                                                            : campaign
                                                                  .organization
                                                                  .name}
                                                    </p>
                                                    <div className="flex justify-between items-baseline gap-3 ">
                                                        <div>
                                                            <div className="text-[0.9rem]">
                                                                {moment(
                                                                    campaign.startDate
                                                                ).format(
                                                                    "MMMM Do YYYY"
                                                                )}
                                                            </div>
                                                            <div className="text-[0.7rem]">
                                                                {
                                                                    campaign.registeredUsersCount
                                                                }{" "}
                                                                Peoples joined
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-center items-center text-[20px] gap-1">
                                                            Join now{" "}
                                                            <div className="mt-1">
                                                                <FaLongArrowAltRight />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })
                            ) : (
                                <div className="flex justify-center items-center w-fit p-20 rounded-lg">
                                    <p className="text-black">
                                        No upcoming campaigns!
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = "/campaigns";
                            }}
                            className=" flex justify-center items-center gap-1 bg-[#eef0e5] text-[#0f1035] xl:text-[17px] 2xl:text-[22px] font-bold rounded-xl h-[2.8rem] border-4 border-[#0f1035] 2xl:h-[3.20rem] w-56 2xl:w-64 2xl:my-5 hover:scale-105 duration-300"
                        >
                            View More{" "}
                            <div className="mt-[0.32rem] text-3xl">
                                <FaLongArrowAltRight />
                            </div>{" "}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={
                    nav
                        ? "absolute left-0 top-[4.3rem] sm:top-[5.25rem] flex flex-col h-[600px] border-r border-r-gray-900 ease-in-out duration-500 bg-[#0f1035]"
                        : "fixed left-[-200%]"
                }
            >
                <div className="flex bg-[#0f1035] w-[300px] flex-col items-center pb-2 border-t border-[#eef0e5] p-4">
                    <button className=" flex justify-center items-center gap-1 bg-[#eef0e5] text-[#0f1035] xl:text-[17px] 2xl:text-[22px] font-bold rounded-xl h-[2.8rem]  2xl:h-[3.20rem] w-56 2xl:w-64 hover:scale-105 duration-300 my-2">
                        {" "}
                        <FaPlus /> Join Community
                    </button>
                    <p className="text-[#eef0e5] text-2xl 2xl:text-3xl font-bold my-3">
                        Joined Communities
                    </p>
                    <div className="flex flex-col gap-3 2xl:gap-5">
                        <a href="">
                            <div className="flex pb-3 border-b-2 xl:gap-3 2xl:gap-7 px-4 2xl:px-7 hover:scale-105 duration-300">
                                <img
                                    className="w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full mr-3"
                                    src={person}
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <p className="text-[#eef0e5] text-[0.9rem] 2xl:text-xl mt-1 2xl:mt-0">
                                        GreenPeace Organisation
                                    </p>
                                    <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[1rem]">
                                        345 Peoples
                                    </p>
                                </div>
                            </div>
                        </a>
                        <a href="">
                            <div className="flex pb-3 border-b-2 xl:gap-3 2xl:gap-7 px-4 2xl:px-7 hover:scale-105 duration-300">
                                <img
                                    className="w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full mr-3"
                                    src={person}
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <p className="text-[#eef0e5] text-[0.9rem] 2xl:text-xl mt-1 2xl:mt-0">
                                        GreenPeace Organisation
                                    </p>
                                    <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[1rem]">
                                        345 Peoples
                                    </p>
                                </div>
                            </div>
                        </a>
                        <a href="">
                            <div className="flex pb-3 border-b-2 xl:gap-3 2xl:gap-7 px-4 2xl:px-7 hover:scale-105 duration-300">
                                <img
                                    className="w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full mr-3"
                                    src={person}
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <p className="text-[#eef0e5] text-[0.9rem] 2xl:text-xl mt-1 2xl:mt-0">
                                        GreenPeace Organisation
                                    </p>
                                    <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[1rem]">
                                        345 Peoples
                                    </p>
                                </div>
                            </div>
                        </a>
                        <a href="">
                            <div className="flex pb-3 border-b-2 xl:gap-3 2xl:gap-7 px-4 2xl:px-7 hover:scale-105 duration-300">
                                <img
                                    className="w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full mr-3"
                                    src={person}
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <p className="text-[#eef0e5] text-[0.9rem] 2xl:text-xl mt-1 2xl:mt-0">
                                        GreenPeace Organisation
                                    </p>
                                    <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[1rem]">
                                        345 Peoples
                                    </p>
                                </div>
                            </div>
                        </a>
                        <a href="">
                            <div className="flex pb-3 border-b-2 xl:gap-3 2xl:gap-7 px-4 2xl:px-7 hover:scale-105 duration-300">
                                <img
                                    className="w-[50px] h-[50px] 2xl:w-[60px] 2xl:h-[60px] rounded-full mr-3"
                                    src={person}
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <p className="text-[#eef0e5] text-[0.9rem] 2xl:text-xl mt-1 2xl:mt-0">
                                        GreenPeace Organisation
                                    </p>
                                    <p className="text-[#eef0e5] text-[0.75rem] 2xl:text-[1rem]">
                                        345 Peoples
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <button className=" flex justify-center items-center gap-1 bg-[#eef0e5] text-[#0f1035] xl:text-[17px] 2xl:text-[22px] font-bold rounded-xl h-[2.8rem]  2xl:h-[3.20rem] w-56 2xl:w-64 my-4 2xl:my-5 hover:scale-105 duration-300">
                        View More{" "}
                        <div className="mt-[0.32rem] text-3xl">
                            <FaLongArrowAltRight />
                        </div>{" "}
                    </button>
                </div>
            </div>
            <Logout onClose={handleOnClose} visible={showMyModel} />
            <EditPassword onClose={handleOnClose1} visible={showMyModel1} />
        </div>
    );
};

export default UserDashboard;
