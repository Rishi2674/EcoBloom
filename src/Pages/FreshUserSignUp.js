import React, { useState } from "react";
import BasicDetails from "./BasicDetails";
import UploadPhoto from "./UploadPhoto";
import MultiStep from "./MultiStep";

const FreshUserSignUp = () => {
    const [step, setStep] = useState({
        stepCount: 1,
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        phone: "",
        photo: null,
    });

    const { stepCount } = step;
    const { name, email, username, password, photo, confirmPassword } = step;

    // go back to previous step
    const prevStep = () => {
        setStep({ ...step, stepCount: step.stepCount - 1 });
    };

    const nextStep = () => {
        setStep({ ...step, stepCount: step.stepCount + 1 });
    };

    const handleChange = (e, value = e.target.value.trim()) => {
        let newStep = Object.assign({}, step);
        let input = e.target.name;
        console.log(e);
        newStep[input] = value;
        console.log(newStep);
        setStep(newStep);
    };

    if (stepCount === 3) {
        setTimeout(() => {
            window.location.replace("/login");
        }, 2000);
    }

    switch (stepCount) {
        case 1:
            return (
                <div className='absolute -z-10 bg-[url("./assets/images/authBg.jpg")] flex flex-col w-full h-screen justify-center items-center'>
                    <div className="absolute top-5 w-1/2">
                        <MultiStep
                            nextStep={nextStep}
                            prevStep={prevStep}
                            stepCount={step.stepCount}
                        />
                    </div>
                    <BasicDetails
                        nextStep={nextStep}
                        handleChange={handleChange}
                        values={step}
                    />
                </div>
            );
        case 2:
            return (
                <div className='absolute -z-10 bg-[url("./assets/images/authBg.jpg")] flex flex-col w-full h-screen justify-center items-center'>
                    <div className="absolute top-5 w-1/2">
                        <MultiStep
                            nextStep={nextStep}
                            prevStep={prevStep}
                            stepCount={step.stepCount}
                        />
                    </div>
                    <div className="flex flex-col w-full h-screen justify-center items-center">
                        <UploadPhoto
                            nextStep={nextStep}
                            prevStep={prevStep}
                            values={step}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
            );

        case 3:
            return (
                <div className="flex flex-col w-full h-screen justify-center items-center">
                    <div className="absolute top-5 w-1/2">
                        <MultiStep
                            nextStep={nextStep}
                            prevStep={prevStep}
                            stepCount={step.stepCount}
                        />
                    </div>

                    <div className="flex flex-col w-full h-screen justify-center items-center">
                        <h1 className="text-6xl text-green-500 text-center font-light">
                            Registered Successfully!
                        </h1>
                    </div>
                </div>
            );
        // never forget the default case, otherwise VS code would be mad!
        default:
            return null;
    }
};

export default FreshUserSignUp;