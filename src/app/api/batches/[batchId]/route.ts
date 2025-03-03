import { NextRequest } from "next/server";
import { store } from "@/lib/store";
import { successResponse, errorResponse } from "@/lib/utils/api";
import { batchSchema } from "@/lib/validations/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = batchSchema.partial().parse(body);
    const updatedBatch = store.updateBatch(
      Number(params.batchId),
      validatedData
    );
    return successResponse(updatedBatch);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to update batch");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    store.deleteBatch(Number(params.batchId));
    return successResponse(undefined);
  } catch (error) {
    console.error("API Error:", error);
    return errorResponse("Failed to delete batch");
  }
}
