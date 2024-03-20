import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req){
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { username, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.redirect(new URL('/sign-in'));
        // return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
