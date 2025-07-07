-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "events" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
