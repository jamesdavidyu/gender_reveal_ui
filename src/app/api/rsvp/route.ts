/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getGrpApiHttpClient } from "@/lib/grp-api-http-client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const body = await req.json();
        const client = getGrpApiHttpClient(token?.accessToken as string);

        const rsvpPayload = { ...body };

        await client.createRsvp(rsvpPayload);

        return NextResponse.json({ message: "Success" });
    } catch (e: any) {
        return NextResponse.json({ message: "Error creating RSVP." }, { status: 500 });
    };
};

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const client = getGrpApiHttpClient(token?.accessToken as string);
        const rsvpResponse = await client.getRsvp();

        return NextResponse.json(rsvpResponse);
    } catch (e: any) {
        return NextResponse.json(
            { message: "Error fetching rsvp." },
            { status: 500 },
        );
    };
};

export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const body = await req.json();
        const client = getGrpApiHttpClient(token?.accessToken as string);

        const rsvpPayload = { ...body };

        await client.putRsvp(rsvpPayload);

        return NextResponse.json({ message: "Success" });
    } catch (e: any) {
        return NextResponse.json({ message: "Error creating RSVP." }, { status: 500 });
    };
};