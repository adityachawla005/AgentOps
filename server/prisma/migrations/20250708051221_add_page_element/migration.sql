-- CreateTable
CREATE TABLE "PageElement" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "elementId" TEXT,
    "classes" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "outerHTML" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageElement_pkey" PRIMARY KEY ("id")
);
