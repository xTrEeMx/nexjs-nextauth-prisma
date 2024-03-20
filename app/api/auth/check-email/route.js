import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { email } = await req.json();

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return NextResponse.json({ available: false });
        } else {
            return NextResponse.json({ available: true });
        }
    } catch (e) {
        console.error('Error checking username availability:', e);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
