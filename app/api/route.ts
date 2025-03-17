import { NextRequest, NextResponse } from "next/server";
import { downloadTaskResults, getTask } from "@/services/constantContact.service";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    console.log("id", id);

    const task = await getTask(id);

    const downloadUrl = task._links.results.href.split("v3").pop();

    if (!downloadUrl) {
        return NextResponse.json({ error: "Download URL not found" }, { status: 400 });
    }

    const response = await downloadTaskResults(downloadUrl);
    return NextResponse.json(response);
}