import React from "react";

export default function Settings() {
    return (
        <>
            {/* <Navbar /> */}
            <div className="flex justify-center mx-auto my-10">
                <div className="flex gap-40">
                    <div>
                        <h1 className="mx-10 mt-5 text-2xl font-bold">Change Password</h1>
                        <h1 className="mx-10 mt-3">Type in new password that you want to use</h1>
                        <div className="mx-10 mt-5">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="snpassword"
                            >
                                New Password
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="Enter your New password"
                                id="snpassword"
                            ></input>
                            <div className="mt-5">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="cnpassword"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Confirm your New password"
                                    id="cnpassword"
                                ></input>
                            </div>
                            <button type="button" className="mt-5 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                Change Password
                            </button>
                        </div>
                    </div>
                    <div>

                        <div className="flex mt-36">

                            <input type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />

                            <label htmlFor="hs-default-checkbox" className="text-sm text-gray-500 ms-3 dark:text-neutral-400">I want to deactivate my account</label>
                        </div>
                        <button type="button" className="mt-5 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Deactivate My Account
                        </button>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    )
}