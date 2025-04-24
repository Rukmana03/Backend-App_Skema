-- CreateTable
CREATE TABLE "_StudentClassToSubjectClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentClassToSubjectClass_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentClassToSubjectClass_B_index" ON "_StudentClassToSubjectClass"("B");

-- AddForeignKey
ALTER TABLE "_StudentClassToSubjectClass" ADD CONSTRAINT "_StudentClassToSubjectClass_A_fkey" FOREIGN KEY ("A") REFERENCES "student_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentClassToSubjectClass" ADD CONSTRAINT "_StudentClassToSubjectClass_B_fkey" FOREIGN KEY ("B") REFERENCES "subject_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
