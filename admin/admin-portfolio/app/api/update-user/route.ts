import { NextResponse } from "next/server"

interface User {
    first_name: string,
    last_name: string;
    email: string;
    
}

export async function PATCH(): Promise<any> {
    
}