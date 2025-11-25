import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CreateStudentResponse } from "@/domain/student/types";
import logo from "@/assets/upc-logo.png";

export const generateHomologationPDF = (result: CreateStudentResponse) => {
  // Create PDF with compression enabled and smaller page size
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Add logo at the top with compression
  try {
    // Reduce image quality and size
    doc.addImage(logo, "PNG", 15, 10, 20, 20, "FAST");
  } catch (error) {
    console.error("Error adding logo:", error);
  }

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Universidad Popular Del Cesar", 105, 18, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Reporte de Homologación", 105, 25, { align: "center" });

  // Date - more compact
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Fecha: ${new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    105,
    30,
    { align: "center" }
  );

  // Line separator
  doc.setDrawColor(100, 100, 100);
  doc.line(15, 32, 195, 32);

  // Información del Estudiante - Table format for better compression
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Información del Estudiante", 15, 37);

  const studentTableData = [
    ["Nombre:", `${result.student.names} ${result.student.lastNames}`],
    ["Identificación:", result.student.identification],
    ["Email:", result.student.email],
    ["Semestre:", result.student.semester.toString()],
    ["Género:", result.student.gender],
    ["Ciudad:", result.student.cityResidence],
    ["Teléfono:", result.student.telephone],
  ];

  autoTable(doc, {
    startY: 40,
    head: [],
    body: studentTableData,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 2,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35 },
      1: { cellWidth: 145 },
    },
    margin: { left: 15, right: 15 },
  });

  let yPosition = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
    .lastAutoTable?.finalY || 75;

  // Materias a Homologar
  if (result.subjectsToHomologate.length > 0) {
    yPosition += 5;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Materias a Homologar", 15, yPosition);

    yPosition += 4;

    const homologateData = result.subjectsToHomologate.map((subject) => [
      subject.name,
      subject.area.name,
      subject.semester.toString(),
      subject.credits.toString(),
    ]);

    const subtotalCreditsHomologate = result.subjectsToHomologate.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );

    homologateData.push([
      "SUBTOTAL",
      "",
      "",
      subtotalCreditsHomologate.toString(),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Materia", "Área", "Sem.", "Créditos"]],
      body: homologateData,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 8,
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
      },
      didDrawCell: (data) => {
        if (data.row.index === homologateData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220];
        }
      },
      margin: { left: 15, right: 15 },
    });

    yPosition =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY || yPosition + 50;
  }

  // Materias Aprobadas
  if (result.approvedSubjects.length > 0) {
    yPosition += 5;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Materias Aprobadas", 15, yPosition);

    yPosition += 4;

    const approvedData = result.approvedSubjects.map((subject) => [
      subject.name,
      subject.area.name,
      subject.semester.toString(),
      subject.credits.toString(),
    ]);

    const subtotalCreditsApproved = result.approvedSubjects.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );

    approvedData.push([
      "SUBTOTAL",
      "",
      "",
      subtotalCreditsApproved.toString(),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Materia", "Área", "Sem.", "Créditos"]],
      body: approvedData,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 8,
      },
      styles: {
        cellPadding: 2,
        overflow: "linebreak",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
      },
      didDrawCell: (data) => {
        if (data.row.index === approvedData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220];
        }
      },
      margin: { left: 15, right: 15 },
    });
  }

  // Footer - optimizado
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 7,
      { align: "center" }
    );
  }

  // Save the PDF with compression
  doc.save(`Homologacion_${new Date().getTime()}.pdf`);
};
