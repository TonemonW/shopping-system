"use client"
import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"

export default function Socials(){
    return (
        <div className="flex flex-col items-center w-full gap-4">
            <Button
                variant={"outline"}
                className="flexw-full gap-4"
                onClick={() => signIn('google', {
                    response: false,
                    callback: "/",
                })}>
                <p>Sign in with Google</p>
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
                variant={"outline"}
                className="flexw-full gap-4"
                onClick={() => signIn('github', {
                    response: false,
                    callback: "/",
                })}>
                <p>Sign in with Github</p>
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    )
}