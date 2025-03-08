import React from "react";
import { SCard } from "./SCard";
import { Navbar } from "../Navbar_home";
import { Footer } from "../Footer";
import { SSidebar } from "./SSidebar";
import { Sapplications } from "./Sapplications";
export function SMyapplications(){
    return (
        <>
            <Navbar/>

            <div className="flex mx-5">
                <SSidebar/>
                <div>
                    <h1 className="mx-10 mt-8 text-2xl font-bold">Active Drives</h1>
                    <h1 className="mt-3 mx-10">Below you will find job roles you have applied for</h1>
                    <Sapplications/>
                    {/* <div className="">
                        <Pagination/>
                    </div> */}
                </div>
            </div>
            <Footer/>
        </>
    )
}