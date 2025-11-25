import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CreateStudentResponse } from "@/domain/student/types";
import logo from "@/assets/upc-logo.png";

export const generateHomologationPDF = (result: CreateStudentResponse) => {
  const doc = new jsPDF();

  // Add logo at the top
  try {
    doc.addImage(logo, "PNG", 15, 10, 25, 25);
  } catch (error) {
    console.error("Error adding logo:", error);
  }

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // Black
  doc.text("Universidad Popular Del Cesar", 105, 20, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Black
  doc.text("Reporte de Homologación", 105, 30, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black
  doc.text(
    `Fecha: ${new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    105,
    38,
    { align: "center" }
  );

  // Line separator
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 42, 190, 42);

  // Información del Estudiante
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black
  doc.text("Información del Estudiante", 20, 50);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black

  const studentInfo = [
    `Nombre: ${result.student.names} ${result.student.lastNames}`,
    `Identificación: ${result.student.identification}`,
    `Email: ${result.student.email}`,
    `Semestre: ${result.student.semester}`,
    `Género: ${result.student.gender}`,
    `Ciudad: ${result.student.cityResidence}`,
    `Teléfono: ${result.student.telephone}`,
  ];

  let infoY = 58;
  studentInfo.forEach((info) => {
    doc.text(info, 25, infoY);
    infoY += 6;
  });

  let yPosition = infoY + 8;

  // Materias a Homologar
  if (result.subjectsToHomologate.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Materias a Homologar", 20, yPosition);

    yPosition += 8;

    const homologateData = result.subjectsToHomologate.map((subject) => [
      subject.name,
      subject.area.name,
      subject.semester.toString(),
      subject.credits.toString(),
    ]);

    // Calculate subtotal of credits
    const subtotalCreditsHomologate = result.subjectsToHomologate.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );

    // Add subtotal row
    homologateData.push([
      "SUBTOTAL",
      "",
      "",
      subtotalCreditsHomologate.toString(),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Materia", "Área", "Semestre", "Créditos"]],
      body: homologateData,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      styles: {
        cellPadding: 3,
        overflow: "linebreak",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawCell: (data) => {
        // Make subtotal row bold
        if (data.row.index === homologateData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220];
        }
      },
    });

    // Obtener la posición final de la tabla
    const finalY = (
      doc as jsPDF & { lastAutoTable?: { finalY: number } }
    ).lastAutoTable?.finalY;
    yPosition = finalY ? finalY + 15 : yPosition + 100;
  }

  // Materias Aprobadas
  if (result.approvedSubjects.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Materias Aprobadas", 20, yPosition);

    yPosition += 8;

    const approvedData = result.approvedSubjects.map((subject) => [
      subject.name,
      subject.area.name,
      subject.semester.toString(),
      subject.credits.toString(),
    ]);

    // Calculate subtotal of credits
    const subtotalCreditsApproved = result.approvedSubjects.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );

    // Add subtotal row
    approvedData.push([
      "SUBTOTAL",
      "",
      "",
      subtotalCreditsApproved.toString(),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Materia", "Área", "Semestre", "Créditos"]],
      body: approvedData,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      styles: {
        cellPadding: 3,
        overflow: "linebreak",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawCell: (data) => {
        // Make subtotal row bold
        if (data.row.index === approvedData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220];
        }
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save(`Homologacion_${new Date().getTime()}.pdf`);
};
